import Link from 'next/link'
import { Badge, BUTTON_PRIMARY, Card, Empty, PageHeader, Progress } from '@/components/ui'
import { requireUser } from '@/lib/auth'
import { PROJECT_STATUS_LABEL } from '@/lib/constants.mjs'
import { dueLabel, todayIST } from '@/lib/dates.mjs'
import { listProjects } from '@/lib/queries'

export const metadata = { title: 'Projects' }

const STATUS_TONE = { done: 'good', client_review: 'soon' }

export default async function ProjectsPage() {
  await requireUser()
  const today = todayIST()
  const projects = await listProjects()
  const newProject = (
    <Link href="/projects/new" className={BUTTON_PRIMARY}>
      New project
    </Link>
  )

  return (
    <>
      <PageHeader title="Projects" description="A workspace for each piece of client work." action={newProject} />

      {projects.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {projects.map((p) => {
            const due = p.due_date && p.status !== 'done' ? dueLabel(p.due_date, today) : null
            return (
              <Link key={p.id} href={`/projects/${p.id}`} className="press card-surface block rounded-card bg-surface p-4 md:p-5">
                <div className="text-foot text-muted">{p.company_name}</div>
                <div className="mt-0.5 break-words text-headline text-ink">{p.name}</div>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <Badge tone={STATUS_TONE[p.status] ?? 'plain'}>{PROJECT_STATUS_LABEL[p.status]}</Badge>
                  {due && <Badge tone={due.tone}>Due: {due.text}</Badge>}
                  {p.owner_name && <span className="text-foot text-muted">{p.owner_name}</span>}
                </div>
                <div className="mt-3.5">
                  <Progress done={p.done_tasks} total={p.total_tasks} />
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <Card>
          <Empty title="No projects yet" action={newProject}>
            Projects belong to a client, so add the client in the CRM first.
          </Empty>
        </Card>
      )}
    </>
  )
}
