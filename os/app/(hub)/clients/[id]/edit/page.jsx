import { notFound } from 'next/navigation'
import { CompanyForm } from '@/components/CompanyForm'
import { Card, PageHeader } from '@/components/ui'
import { updateCompany } from '@/lib/actions/crm'
import { requireUser } from '@/lib/auth'
import { todayIST } from '@/lib/dates.mjs'
import { isUuid } from '@/lib/forms'
import { getCompany, listUsers } from '@/lib/queries'

export const metadata = { title: 'Edit client' }

export default async function EditCompanyPage({ params }) {
  await requireUser()
  const { id } = await params
  const company = isUuid(id) ? await getCompany(id) : null
  if (!company) notFound()

  return (
    <div className="max-w-3xl">
      <PageHeader back={{ href: `/clients/${company.id}`, label: company.name }} title="Edit details" />
      <Card>
        <CompanyForm
          action={updateCompany}
          company={company}
          users={await listUsers()}
          today={todayIST()}
          cancelHref={`/clients/${company.id}`}
        />
      </Card>
    </div>
  )
}
