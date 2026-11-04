import Link from 'next/link'
import { Hourglass, ListTree, Repeat } from 'lucide-react'
import { CheckButton } from '@/components/forms'
import { Badge } from '@/components/ui'
import { toggleTask } from '@/lib/actions/tasks'
import { APPROVAL_LABEL, PRIORITY_LABEL, RECURRENCE_LABEL } from '@/lib/constants.mjs'
import { dueLabel, formatDay } from '@/lib/dates.mjs'

const PRIORITY_TONE = { critical: 'late', high: 'soon' }
const APPROVAL_TONE = { awaiting: 'soon', approved: 'good', changes_requested: 'late' }

export function TaskCheck({ task }) {
  return (
    <CheckButton
      action={toggleTask}
      id={task.id}
      done={task.done_at}
      label={task.title}
      blockedBy={task.is_blocked ? task.blocker_title : null}
    />
  )
}

/** The whole row opens the task; the tick sits above that link. */
export function TaskRow({ task, today, showProject = true }) {
  const done = Boolean(task.done_at)
  const due = task.due_date ? dueLabel(task.due_date, today, task.due_time) : null

  return (
    <li className="row-press flex flex-wrap items-start gap-x-3 px-4 py-3">
      <TaskCheck task={task} />
      <div className="min-w-0 flex-1 basis-40">
        <Link
          href={`/tasks/${task.id}`}
          className={`break-words text-body after:absolute after:inset-0 md:text-sub ${done ? 'text-muted line-through' : 'text-ink'}`}
        >
          {task.title}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-foot text-muted">
          {showProject && task.project_name && (
            <span className="break-words">
              {task.company_name} · {task.project_name}
            </span>
          )}
          {task.assignee_name && <span>{task.assignee_name}</span>}
          {!done && task.priority in PRIORITY_TONE && (
            <Badge tone={PRIORITY_TONE[task.priority]}>{PRIORITY_LABEL[task.priority]}</Badge>
          )}
          {!done && due && <Badge tone={due.tone}>{due.text}</Badge>}
          {done && task.due_date && <span>Due {formatDay(task.due_date, today)}</span>}
          {task.approval in APPROVAL_TONE && (
            <Badge tone={APPROVAL_TONE[task.approval]}>{APPROVAL_LABEL[task.approval]}</Badge>
          )}
          {!done && task.is_blocked && (
            <Badge>
              <Hourglass size={11} aria-hidden="true" />
              Waiting on {task.blocker_title}
            </Badge>
          )}
          {task.subtask_count > 0 && (
            <span className="inline-flex items-center gap-1">
              <ListTree size={13} aria-hidden="true" />
              {task.subtask_done}/{task.subtask_count}
            </span>
          )}
          {task.recurrence !== 'none' && (
            <span className="inline-flex items-center gap-1">
              <Repeat size={13} aria-hidden="true" />
              {RECURRENCE_LABEL[task.recurrence]}
            </span>
          )}
        </div>
      </div>
    </li>
  )
}
