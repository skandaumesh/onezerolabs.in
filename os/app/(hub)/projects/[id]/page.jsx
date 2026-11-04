import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ActionForm, ConfirmSubmit } from '@/components/forms'
import { SheetButton } from '@/components/Sheet'
import { TaskQuickAdd } from '@/components/TaskQuickAdd'
import { TaskRow } from '@/components/TaskRow'
import { Badge, BUTTON_DANGER, BUTTON_SECONDARY, BUTTON_TEXT, Card, Empty, PageHeader, Progress } from '@/components/ui'
import { deleteProject } from '@/lib/actions/projects'
import { getUser, requireUser } from '@/lib/auth'
import { PROJECT_STATUS_LABEL } from '@/lib/constants.mjs'
import { dueLabel, todayIST } from '@/lib/dates.mjs'
import { isUuid } from '@/lib/forms'
import { getProject, listProjectTasks, listUsers } from '@/lib/queries'

export async function generateMetadata({ params }) {
  const { id } = await params
  const project = (await getUser()) && isUuid(id) ? await getProject(id) : null
  return { title: project?.name ?? 'Not found' }
}

function Fact({ label, children }) {
  return (
    <div>
      <div className="text-foot text-muted">{label}</div>
      <div className="mt-0.5 text-body text-ink md:text-sub">{children}</div>
    </div>
  )
}

export default async function ProjectPage({ params }) {
  const user = await requireUser()
  const { id } = await params
  const project = isUuid(id) ? await getProject(id) : null
  if (!project) notFound()

  const today = todayIST()
  const [tasks, users] = await Promise.all([listProjectTasks(id), listUsers()])
  const due = project.due_date && project.status !== 'done' ? dueLabel(project.due_date, today) : null

  return (
    <>
      <PageHeader
        back={{ href: `/clients/${project.company_id}`, label: project.company_name }}
        title={project.name}
        action={
          <Link href={`/projects/${id}/edit`} className={BUTTON_SECONDARY}>
            Edit
          </Link>
        }
      />

      <Card className="mb-4 p-4 md:p-5">
        <div className="flex flex-wrap gap-x-10 gap-y-3">
          <Fact label="Status">
            <Badge tone={project.status === 'done' ? 'good' : 'plain'}>{PROJECT_STATUS_LABEL[project.status]}</Badge>
          </Fact>
          <Fact label="Owner">{project.owner_name ?? 'No owner'}</Fact>
          <Fact label="Deadline">
            {due ? <Badge tone={due.tone}>{due.text}</Badge> : project.due_date ? 'Finished' : 'Not set'}
          </Fact>
        </div>
        {project.description && (
          <p className="mt-4 whitespace-pre-line break-words text-body text-ink2 md:text-sub">{project.description}</p>
        )}
        <div className="mt-4">
          <Progress done={project.done_tasks} total={project.total_tasks} />
        </div>
      </Card>

      <Card
        title="Tasks"
        count={tasks.length}
        action={
          <SheetButton label="Add task" title="New task" className={BUTTON_TEXT}>
            <TaskQuickAdd users={users} projectId={id} defaultAssignee={project.owner_id ?? user.id} />
          </SheetButton>
        }
      >
        {tasks.length ? (
          <ul className="rows rows-task">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} today={today} showProject={false} />
            ))}
          </ul>
        ) : (
          <Empty title="No tasks yet">Add the steps to finish this project, in order.</Empty>
        )}
      </Card>

      <ActionForm action={deleteProject} errorTitle="Couldn’t Delete" className="mt-4">
        <input type="hidden" name="id" value={id} />
        <ConfirmSubmit title={`Delete ${project.name}?`} message="All its tasks go with it. This can’t be undone." className={BUTTON_DANGER}>
          Delete project
        </ConfirmSubmit>
      </ActionForm>
    </>
  )
}
