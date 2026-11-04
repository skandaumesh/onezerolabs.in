import { SheetButton } from '@/components/Sheet'
import { TaskQuickAdd } from '@/components/TaskQuickAdd'
import { TaskRow } from '@/components/TaskRow'
import { BUTTON_PRIMARY, Card, Empty, PageHeader, Tabs } from '@/components/ui'
import { requireUser } from '@/lib/auth'
import { addDays, todayIST } from '@/lib/dates.mjs'
import { isUuid } from '@/lib/forms'
import { listDoneTasks, listOpenTasks, listProjectOptions, listUsers } from '@/lib/queries'

export const metadata = { title: 'Tasks' }

const groupByDate = (tasks, today) => {
  const week = addDays(today, 7)
  const groups = [
    { title: 'Overdue', test: (d) => d && d < today },
    { title: 'Today', test: (d) => d === today },
    { title: 'Next 7 days', test: (d) => d && d > today && d <= week },
    { title: 'Later', test: (d) => d && d > week },
    { title: 'No due date', test: (d) => !d },
  ]
  return groups
    .map((g) => ({ title: g.title, tasks: tasks.filter((t) => g.test(t.due_date)) }))
    .filter((g) => g.tasks.length)
}

export default async function TasksPage({ searchParams }) {
  const user = await requireUser()
  const params = await searchParams
  const today = todayIST()

  const who = params.who === 'all' || isUuid(params.who) ? params.who : 'me'
  const show = params.show === 'done' ? 'done' : 'open'
  const assigneeId = who === 'me' ? user.id : who === 'all' ? null : who

  const [users, projects, tasks] = await Promise.all([
    listUsers(),
    listProjectOptions(),
    show === 'done' ? listDoneTasks(assigneeId) : listOpenTasks(assigneeId),
  ])

  const link = (next) => {
    const q = new URLSearchParams({ who, show, ...next })
    return `/tasks?${q}`
  }
  const people = [
    { value: 'me', label: 'Mine', href: link({ who: 'me' }) },
    ...users.filter((u) => u.id !== user.id).map((u) => ({ value: u.id, label: u.name, href: link({ who: u.id }) })),
    { value: 'all', label: 'Everyone', href: link({ who: 'all' }) },
  ]

  return (
    <>
      <PageHeader
        title="Tasks"
        action={
          <SheetButton label="New task" title="New task" className={BUTTON_PRIMARY}>
            <TaskQuickAdd users={users} projects={projects} defaultAssignee={user.id} />
          </SheetButton>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Tabs label="Whose tasks" active={who} items={people} />
        <Tabs
          label="Open or done"
          active={show}
          items={[
            { value: 'open', label: 'Open', href: link({ show: 'open' }) },
            { value: 'done', label: 'Done', href: link({ show: 'done' }) },
          ]}
        />
      </div>

      {!tasks.length ? (
        <Card>
          <Empty title={show === 'done' ? 'Nothing finished yet' : 'No open tasks'} />
        </Card>
      ) : show === 'done' ? (
        <Card title="Recently finished">
          <ul className="rows rows-task">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} today={today} />
            ))}
          </ul>
        </Card>
      ) : (
        <div className="space-y-4">
          {groupByDate(tasks, today).map((group) => (
            <Card key={group.title} title={group.title} count={group.tasks.length}>
              <ul className="rows rows-task">
                {group.tasks.map((task) => (
                  <TaskRow key={task.id} task={task} today={today} />
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
