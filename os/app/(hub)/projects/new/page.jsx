import Link from 'next/link'
import { ProjectForm } from '@/components/ProjectForm'
import { BUTTON_PRIMARY, Card, Empty, PageHeader } from '@/components/ui'
import { createProject } from '@/lib/actions/projects'
import { requireUser } from '@/lib/auth'
import { isUuid } from '@/lib/forms'
import { listCompanyOptions, listUsers } from '@/lib/queries'

export const metadata = { title: 'New project' }

export default async function NewProjectPage({ searchParams }) {
  await requireUser()
  const { client } = await searchParams
  const [companies, users] = await Promise.all([listCompanyOptions(), listUsers()])
  const backHref = isUuid(client) ? `/clients/${client}` : '/projects'

  return (
    <div className="max-w-3xl">
      <PageHeader back={{ href: backHref, label: isUuid(client) ? 'Client' : 'Projects' }} title="New project" />
      <Card>
        {companies.length ? (
          <ProjectForm
            action={createProject}
            companies={companies}
            defaultCompany={isUuid(client) ? client : undefined}
            users={users}
            cancelHref={backHref}
          />
        ) : (
          <Empty
            title="Add a client first"
            action={
              <Link href="/clients/new?stage=won" className={BUTTON_PRIMARY}>
                Add client
              </Link>
            }
          >
            Every project belongs to a client.
          </Empty>
        )}
      </Card>
    </div>
  )
}
