'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { APPROVALS, PRIORITIES, RECURRENCES } from '@/lib/constants.mjs'
import { minutesIST, todayIST } from '@/lib/dates.mjs'
import { sql, tx } from '@/lib/db.mjs'
import { taskChanged, tasksMoved } from '@/lib/notify'
import { day, oneOf, text, time, uuid } from '@/lib/forms'
import { parseMeetLink } from '@/lib/meet.mjs'
import { parseTask, whenText } from '@/lib/parse-task.mjs'

const RECUR_NEEDS_DATE = 'A repeating task needs a due date to count from.'
const TIME_NEEDS_DATE = 'Choose a date to go with that time.'

/** "both", one founder, or nobody, from the Assign to choice. */
const assignment = (form) =>
  text(form, 'assignee_id') === 'both' ? { assigneeId: null, forBoth: true } : { assigneeId: uuid(form, 'assignee_id'), forBoth: false }
const INTERVAL = { daily: '1 day', weekly: '1 week', monthly: '1 month', yearly: '1 year' }
// What a notice about a task needs to know.
const NOTICE_FIELDS = `id, title, assignee_id, for_both, due_date, to_char(due_time, 'HH24:MI') AS due_time, meet_link`

export async function createTask(_prev, form) {
  const user = await requireUser()
  const title = text(form, 'title')
  const dueDate = day(form, 'due_date')
  const dueTime = time(form, 'due_time')
  const recurrence = oneOf(form, 'recurrence', RECURRENCES, 'none')
  if (!title) return { error: 'Enter what needs doing.' }
  if (recurrence !== 'none' && !dueDate) return { error: RECUR_NEEDS_DATE }
  if (dueTime && !dueDate) return { error: TIME_NEEDS_DATE }
  const meet = parseMeetLink(text(form, 'meet_link'))
  if (meet.error) return { error: meet.error }
  const { assigneeId, forBoth } = assignment(form)

  const [task] = await sql(
    `INSERT INTO tasks (project_id, title, assignee_id, for_both, created_by, priority, due_date, due_time, recurrence, meet_link)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING ${NOTICE_FIELDS}`,
    [
      uuid(form, 'project_id'),
      title,
      assigneeId,
      forBoth,
      user.id,
      oneOf(form, 'priority', PRIORITIES, 'medium'),
      dueDate,
      dueTime,
      recurrence,
      meet.link,
    ]
  )
  await taskChanged(user, task)
  revalidatePath('/', 'layout')
  return { ok: true }
}

/** Saves a task from one spoken or typed sentence, such as "meeting today at 7". */
export async function quickAddTask(_prev, form) {
  const user = await requireUser()
  const said = text(form, 'said')
  if (!said) return { error: 'Say or type what needs doing.' }

  const today = todayIST()
  const users = await sql('SELECT id, name FROM users ORDER BY name')
  const task = parseTask(said, { today, minutesNow: minutesIST(), users, meId: user.id })
  if (!task.title) return { error: `I heard “${said}” but not what the task is. Try saying it again.` }

  const [row] = await sql(
    `INSERT INTO tasks (title, assignee_id, for_both, created_by, priority, due_date, due_time, recurrence)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ${NOTICE_FIELDS}`,
    [task.title, task.assigneeId, task.forBoth, user.id, task.priority, task.dueDate, task.dueTime, task.recurrence]
  )
  await taskChanged(user, row)
  revalidatePath('/', 'layout')
  return {
    ok: true,
    id: row.id,
    summary: [task.title, whenText(task.dueDate, task.dueTime, today)].filter(Boolean).join(' · '),
    assigneeName: task.forBoth ? 'both' : task.assigneeId === user.id ? null : task.assigneeName,
  }
}

/** Takes back a task just saved by voice. Only the person who added it can. */
export async function undoQuickTask(_prev, form) {
  const user = await requireUser()
  const [gone] = await sql('DELETE FROM tasks WHERE id = $1 AND created_by = $2 RETURNING id', [uuid(form, 'id'), user.id])
  if (gone) await forgetNotices(gone.id)
  await tasksMoved()
  revalidatePath('/', 'layout')
  return { ok: true }
}

/** A deleted task's notices go too, so nobody taps one into a missing page. */
const forgetNotices = (taskId) => sql('DELETE FROM notifications WHERE url = $1', [`/tasks/${taskId}`])

/** Would making `taskId` wait on `blockerId` form a loop? Walks up the blocker chain. */
const wouldCycle = async (taskId, blockerId) => {
  const seen = new Set()
  let current = blockerId
  while (current && !seen.has(current)) {
    if (current === taskId) return true
    seen.add(current)
    const [row] = await sql('SELECT blocked_by FROM tasks WHERE id = $1', [current])
    current = row?.blocked_by
  }
  return false
}

export async function updateTask(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')
  const title = text(form, 'title')
  const dueDate = day(form, 'due_date')
  const dueTime = time(form, 'due_time')
  const recurrence = oneOf(form, 'recurrence', RECURRENCES, 'none')
  const blockedBy = uuid(form, 'blocked_by')
  if (!id) return { error: 'This task no longer exists.' }
  if (!title) return { error: 'Enter what needs doing.' }
  if (recurrence !== 'none' && !dueDate) return { error: RECUR_NEEDS_DATE }
  if (dueTime && !dueDate) return { error: TIME_NEEDS_DATE }
  const meet = parseMeetLink(text(form, 'meet_link'))
  if (meet.error) return { error: meet.error }
  const { assigneeId, forBoth } = assignment(form)
  if (blockedBy && (await wouldCycle(id, blockedBy))) {
    return { error: 'Those two tasks would end up waiting on each other.' }
  }

  const [before] = await sql(`SELECT ${NOTICE_FIELDS} FROM tasks WHERE id = $1`, [id])
  if (!before) return { error: 'This task no longer exists.' }
  const [task] = await sql(
    `UPDATE tasks
     SET title = $2, notes = $3, assignee_id = $4, priority = $5, due_date = $6,
         approval = $7, recurrence = $8, blocked_by = $9, due_time = $10, for_both = $11, meet_link = $12
     WHERE id = $1 RETURNING ${NOTICE_FIELDS}`,
    [
      id,
      title,
      text(form, 'notes'),
      assigneeId,
      oneOf(form, 'priority', PRIORITIES, 'medium'),
      dueDate,
      oneOf(form, 'approval', APPROVALS, 'not_required'),
      recurrence,
      blockedBy,
      dueTime,
      forBoth,
      meet.link,
    ]
  )
  if (task) await taskChanged(user, task, before)
  revalidatePath('/', 'layout')
  return { ok: true }
}

/**
 * Ticks a task on or off. Finishing a repeating task creates its next occurrence
 * and stops the finished one repeating, so reopening and re-ticking it cannot
 * create a duplicate.
 */
export async function toggleTask(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  const [task] = await sql(
    `SELECT t.*, (b.id IS NOT NULL AND b.done_at IS NULL) AS is_blocked, b.title AS blocker_title
     FROM tasks t LEFT JOIN tasks b ON b.id = t.blocked_by
     WHERE t.id = $1`,
    [id]
  )
  if (!task) return { error: 'This task no longer exists.' }

  if (task.done_at) {
    await sql('UPDATE tasks SET done_at = NULL WHERE id = $1', [id])
  } else {
    if (task.is_blocked) return { error: `Waiting on “${task.blocker_title}”. Finish that first.` }
    await tx(async (t) => {
      await t.query(`UPDATE tasks SET done_at = now(), recurrence = 'none' WHERE id = $1`, [id])
      if (task.recurrence !== 'none') {
        // A daily task ticked off late comes back tomorrow, not on a day already gone.
        const today = todayIST()
        const from = task.recurrence === 'daily' && task.due_date < today ? today : task.due_date
        await t.query(
          `INSERT INTO tasks (project_id, title, notes, assignee_id, created_by, priority, due_date, approval, recurrence, due_time, for_both, meet_link)
           VALUES ($1, $2, $3, $4, $5, $6, ($7::date + $8::interval)::date, $9, $10, $11, $12, $13)`,
          [
            task.project_id,
            task.title,
            task.notes,
            task.assignee_id,
            task.created_by,
            task.priority,
            from,
            INTERVAL[task.recurrence],
            task.approval === 'not_required' ? 'not_required' : 'awaiting',
            task.recurrence,
            task.due_time,
            task.for_both,
            task.meet_link,
          ]
        )
      }
    })
  }

  await tasksMoved()
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteTask(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  const [task] = await sql('SELECT project_id FROM tasks WHERE id = $1', [id])
  await sql('DELETE FROM tasks WHERE id = $1', [id])
  if (task) await forgetNotices(id)
  await tasksMoved()
  revalidatePath('/', 'layout')
  redirect(task?.project_id ? `/projects/${task.project_id}` : '/tasks')
}

export async function addSubtask(_prev, form) {
  await requireUser()
  const taskId = uuid(form, 'task_id')
  const title = text(form, 'title')
  if (!taskId) return { error: 'This task no longer exists.' }
  if (!title) return { error: 'Enter the subtask.' }
  await sql('INSERT INTO subtasks (task_id, title) VALUES ($1, $2)', [taskId, title])
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function toggleSubtask(_prev, form) {
  await requireUser()
  await sql('UPDATE subtasks SET done = NOT done WHERE id = $1', [uuid(form, 'id')])
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteSubtask(_prev, form) {
  await requireUser()
  await sql('DELETE FROM subtasks WHERE id = $1', [uuid(form, 'id')])
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function addComment(_prev, form) {
  const user = await requireUser()
  const taskId = uuid(form, 'task_id')
  const body = text(form, 'body')
  if (!taskId) return { error: 'This task no longer exists.' }
  if (!body) return { error: 'Write the comment first.' }
  await sql('INSERT INTO task_comments (task_id, author_id, body) VALUES ($1, $2, $3)', [taskId, user.id, body])
  revalidatePath('/', 'layout')
  return { ok: true }
}
