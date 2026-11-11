import { CompanyForm } from '@/components/CompanyForm'
import { Card, PageHeader } from '@/components/ui'
import { createCompany } from '@/lib/actions/crm'
import { requireUser } from '@/lib/auth'
import { todayIST } from '@/lib/dates.mjs'
import { listUsers } from '@/lib/queries'

export const metadata = { title: 'Add to CRM' }

export default async function NewCompanyPage({ searchParams }) {
  await requireUser()
  const { stage } = await searchParams
  const isClient = stage === 'won'
  const backHref = isClient ? '/clients?view=clients' : '/clients'

  return (
    <div className="max-w-3xl">
      <PageHeader back={{ href: backHref, label: 'Clients & CRM' }} title={isClient ? 'Add client' : 'Add lead'} />
      <Card>
        <CompanyForm
          action={createCompany}
          users={await listUsers()}
          defaultStage={isClient ? 'won' : 'new'}
          today={todayIST()}
          cancelHref={backHref}
        />
      </Card>
    </div>
  )
}
