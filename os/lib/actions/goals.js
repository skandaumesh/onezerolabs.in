'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth'
import { sql } from '@/lib/db.mjs'
import { day, oneOf, text, uuid } from '@/lib/forms'
import { countsByTaps, goalState, GOAL_PERIODS, periodStart } from '@/lib/goals.mjs'
import { parseAmount } from '@/lib/money.mjs'
import { getGoalInPeriod } from '@/lib/queries'

/** Me, the other founder, or both, from the "For" choice. */
const owner = (form) =>
  text(form, 'owner_id') === 'both' ? { ownerId: null, forBoth: true } : { ownerId: uuid(form, 'owner_id'), forBoth: false }

/** The target, or null for a goal that is simply done or not. A bad number is an error, not a silent null. */
const readTarget = (form) => {
  const typed = text(form, 'target')
  if (!typed) return { target: null }
  const target = parseAmount(typed)
  if (target === null || target <= 0) return { error: 'Enter the target as a number, such as 20, or leave it empty.' }
  return { target }
}

export async function createGoal(_prev, form) {
  const user = await requireUser()
  const title = text(form, 'title')
  const period = oneOf(form, 'period', GOAL_PERIODS, 'day')
  const on = day(form, 'on')
  if (!title) return { error: 'Say what the goal is.' }
  if (!on) return { error: 'This goal needs a date to start from.' }
  const { target, error } = readTarget(form)
  if (error) return { error }
  const { ownerId, forBoth } = owner(form)

  await sql(
    `INSERT INTO goals (title, period, starts_on, repeats, owner_id, for_both, target, unit, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [title, period, periodStart(period, on), form.get('repeats') === 'on', ownerId ?? (forBoth ? null : user.id), forBoth, target, target ? text(form, 'unit') : null, user.id]
  )
  revalidatePath('/', 'layout')
  return { ok: true }
}

/** Renames a goal or changes its owner or target. For a repeating goal this applies to every period. */
export async function updateGoal(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  const title = text(form, 'title')
  if (!id) return { error: 'This goal no longer exists.' }
  if (!title) return { error: 'Say what the goal is.' }
  const { target, error } = readTarget(form)
  if (error) return { error }
  const { ownerId, forBoth } = owner(form)

  const [row] = await sql(
    `UPDATE goals SET title = $2, owner_id = $3, for_both = $4, target = $5, unit = $6 WHERE id = $1 RETURNING id`,
    [id, title, ownerId, forBoth, target, target ? text(form, 'unit') : null]
  )
  if (!row) return { error: 'This goal no longer exists.' }

  // Progress typed in the edit sheet, for targets too big to count up by taps.
  const periodStartDay = day(form, 'period_start')
  const typed = text(form, 'value')
  if (target && periodStartDay && typed !== null) {
    const value = parseAmount(typed)
    if (value === null || value < 0) return { error: 'Enter the progress so far as a number, such as 40000.' }
    await saveProgress(id, periodStartDay, { value, target }, null)
  }
  revalidatePath('/', 'layout')
  return { ok: true }
}

const saveProgress = (goalId, start, { value, target, done }, userId) => {
  const state = goalState({ target, value, done })
  return sql(
    `INSERT INTO goal_progress (goal_id, period_start, value, done, updated_by)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (goal_id, period_start) DO UPDATE SET value = $3, done = $4, updated_by = COALESCE($5, goal_progress.updated_by), updated_at = now()`,
    [goalId, start, value, state.done, userId]
  )
}

/**
 * One tap on a goal in one period: + or − for a goal with a small target, or a
 * tick for one without. Works out the new value from what is stored, not from
 * the screen, so two quick taps count twice.
 */
export async function stepGoal(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')
  const period = oneOf(form, 'period', GOAL_PERIODS, null)
  const start = day(form, 'period_start')
  const goal = id && period && start ? await getGoalInPeriod(id, period, periodStart(period, start)) : null
  if (!goal) return { error: 'This goal is not part of this period any more.' }

  const step = text(form, 'step')
  if (goal.target) {
    if (!countsByTaps(goal.target)) return { error: 'Type the progress in the goal instead.' }
    const value = Math.max(0, goal.value + (step === 'down' ? -1 : 1))
    await saveProgress(goal.id, periodStart(period, start), { value, target: goal.target }, user.id)
  } else {
    await saveProgress(goal.id, periodStart(period, start), { value: 0, done: !goal.done }, user.id)
  }
  revalidatePath('/', 'layout')
  return { ok: true }
}

/**
 * Removes a goal from the period being looked at onwards. A repeating goal that
 * already ran in earlier periods stops here and keeps those results; anything
 * else is deleted.
 */
export async function removeGoal(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  const start = day(form, 'period_start')
  const [goal] = id ? await sql('SELECT id, period, starts_on, repeats FROM goals WHERE id = $1', [id]) : []
  if (!goal) return { ok: true }
  const from = start ? periodStart(goal.period, start) : goal.starts_on

  if (goal.repeats && from > goal.starts_on) {
    await sql('UPDATE goals SET stopped_on = $2 WHERE id = $1', [id, from])
    await sql('DELETE FROM goal_progress WHERE goal_id = $1 AND period_start >= $2', [id, from])
  } else {
    await sql('DELETE FROM goals WHERE id = $1', [id])
  }
  revalidatePath('/', 'layout')
  return { ok: true }
}
