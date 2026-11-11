import { notFound } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { ActionForm, CheckButton, ConfirmSubmit, Submit } from '@/components/forms'
import { JoinMeet, MeetField } from '@/components/MeetField'
import { TaskCheck } from '@/components/TaskRow'
import {
  BUTTON_DANGER,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  Card,
  Empty,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
} from '@/components/ui'
import {
  addComment,
  addSubtask,
  deleteSubtask,
  deleteTask,
  toggleSubtask,
  updateTask,
} from '@/lib/actions/tasks'
import { getUser, requireUser } from '@/lib/auth'
import { APPROVALS, PRIORITIES, RECURRENCES } from '@/lib/constants.mjs'
import { formatDateTime } from '@/lib/dates.mjs'
import { isUuid } from '@/lib/forms'
import { getTask, listBlockerOptions, listComments, listSubtasks, listUsers } from '@/lib/queries'

export async function generateMetadata({ params }) {
  const { id } = await params
  const task = (await getUser()) && isUuid(id) ? await getTask(id) : null
  return { title: task?.title ?? 'Not found' }
}

export default async function TaskPage({ params }) {
  await requireUser()
  const { id } = await params
  const task = isUuid(id) ? await getTask(id) : null
  if (!task) notFound()

  const [subtasks, comments, users, blockers] = await Promise.all([
    listSubtasks(id),
    listComments(id),
    listUsers(),
    task.project_id ? listBlockerOptions(task.project_id, id) : [],
  ])

  // A finished blocker is no longer offered, but must stay selected if it is set.
  const blockerOptions = blockers.map((b) => ({ value: b.id, label: b.title }))
  if (task.blocked_by && !blockers.some((b) => b.id === task.blocked_by)) {
    blockerOptions.unshift({ value: task.blocked_by, label: `${task.blocker_title} (done)` })
  }

  return (
    <>
      <PageHeader
        back={
          task.project_id
            ? { href: `/projects/${task.project_id}`, label: task.project_name }
            : { href: '/tasks', label: 'Tasks' }
        }
        eyebrow={task.company_name}
        title={task.title}
        action={task.meet_link && !task.done_at ? <JoinMeet link={task.meet_link} /> : null}
      />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          <Card>
            <div className="flex flex-wrap items-center gap-x-3 px-4 py-3.5">
              <TaskCheck task={task} />
              <span className="min-w-0 flex-1 basis-40 text-body text-ink md:text-sub">
                {task.done_at ? 'Finished' : task.is_blocked ? `Waiting on ${task.blocker_title}` : 'Tap to mark done'}
              </span>
            </div>
          </Card>

          <Card title="Subtasks" count={subtasks.length}>
            {subtasks.length > 0 && (
              <ul className="rows" style={{ '--rows-inset': '3rem' }}>
                {subtasks.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center gap-x-3 py-1.5 pl-4 pr-2">
                    <CheckButton action={toggleSubtask} id={s.id} done={s.done} label={s.title} square />
                    <span className={`min-w-0 flex-1 basis-40 break-words text-body md:text-sub ${s.done ? 'text-muted line-through' : 'text-ink'}`}>
                      {s.title}
                    </span>
                    <ActionForm action={deleteSubtask}>
                      <input type="hidden" name="id" value={s.id} />
                      <Submit
                        aria-label={`Remove ${s.title}`}
                        className="press flex h-11 w-11 items-center justify-center rounded-full text-muted hover:text-late"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </Submit>
                    </ActionForm>
                  </li>
                ))}
              </ul>
            )}
            <ActionForm action={addSubtask} reset className="flex flex-wrap gap-2 p-4 pt-2">
              <input type="hidden" name="task_id" value={id} />
              <div className="min-w-40 flex-1">
                <Input name="title" required aria-label="New subtask" placeholder="Add a subtask" autoComplete="off" />
              </div>
              <Submit className={BUTTON_SECONDARY}>Add</Submit>
            </ActionForm>
          </Card>

          <Card title="Comments" count={comments.length}>
            {comments.length > 0 ? (
              <ul className="rows">
                {comments.map((c) => (
                  <li key={c.id} className="px-4 py-3">
                    <p className="whitespace-pre-line break-words text-body text-ink md:text-sub">{c.body}</p>
                    <div className="mt-1.5 text-foot text-muted">
                      {[c.author_name, formatDateTime(c.created_at)].filter(Boolean).join(' · ')}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="No comments yet" />
            )}
            <ActionForm action={addComment} reset className="grid gap-3 p-4 pt-2">
              <input type="hidden" name="task_id" value={id} />
              <Textarea name="body" required rows={2} aria-label="New comment" placeholder="Add a comment" />
              <div>
                <Submit className={BUTTON_SECONDARY}>Comment</Submit>
              </div>
            </ActionForm>
          </Card>
        </div>

        <div className="min-w-0 space-y-4">
          <Card title="Details">
            <ActionForm action={updateTask} success="Saved" className="grid gap-3.5 p-4 pt-2">
              <input type="hidden" name="id" value={id} />
              <Field label="Title">
                <Input name="title" required defaultValue={task.title} />
              </Field>
              <MeetField defaultValue={task.meet_link ?? ''} title={task.title} />
              <Field label="Assigned to">
                <Select
                  name="assignee_id"
                  blank="Unassigned"
                  defaultValue={task.for_both ? 'both' : (task.assignee_id ?? '')}
                  options={[...users.map((u) => ({ value: u.id, label: u.name })), { value: 'both', label: 'Both' }]}
                />
              </Field>
              <Field label="Priority">
                <Select name="priority" defaultValue={task.priority} options={PRIORITIES} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Due date">
                  <Input type="date" name="due_date" defaultValue={task.due_date ?? ''} />
                </Field>
                <Field label="Time">
                  <Input type="time" name="due_time" defaultValue={task.due_time ?? ''} />
                </Field>
              </div>
              <Field label="Repeats" hint="Finishing it creates the next one.">
                <Select name="recurrence" defaultValue={task.recurrence} options={RECURRENCES} />
              </Field>
              <Field label="Client approval">
                <Select name="approval" defaultValue={task.approval} options={APPROVALS} />
              </Field>
              {task.project_id && (
                <Field label="Waiting on" hint="It cannot be finished until this task is.">
                  <Select name="blocked_by" blank="Nothing" defaultValue={task.blocked_by ?? ''} options={blockerOptions} />
                </Field>
              )}
              <Field label="Notes">
                <Textarea name="notes" defaultValue={task.notes ?? ''} />
              </Field>
              <div>
                <Submit className={`${BUTTON_PRIMARY} w-full sm:w-auto`}>Save changes</Submit>
              </div>
            </ActionForm>
          </Card>

          <ActionForm action={deleteTask} errorTitle="Couldn’t Delete">
            <input type="hidden" name="id" value={id} />
            <ConfirmSubmit title="Delete Task?" message="Its subtasks and comments go with it. This can’t be undone." className={BUTTON_DANGER}>
              Delete task
            </ConfirmSubmit>
          </ActionForm>
        </div>
      </div>
    </>
  )
}
