import { notFound, redirect } from 'next/navigation'
import { InvoiceForm } from '@/components/InvoiceForm'
import { PageHeader } from '@/components/ui'
import { updateInvoice } from '@/lib/actions/invoices'
import { requireUser } from '@/lib/auth'
import { todayIST } from '@/lib/dates.mjs'
import { isUuid } from '@/lib/forms'
import { getInvoice, getSettings, listClientsForInvoice, listIncome, listInvoiceItems } from '@/lib/queries'

export const metadata = { title: 'Edit invoice' }

export default async function EditInvoicePage({ params }) {
  await requireUser()
  const { id } = await params
  const invoice = isUuid(id) ? await getInvoice(id) : null
  if (!invoice) notFound()
  if (invoice.status !== 'draft') redirect(`/invoices/${id}`)

  const [items, clients, income, settings] = await Promise.all([
    listInvoiceItems(id),
    listClientsForInvoice(),
    listIncome(),
    getSettings(),
  ])

  return (
    <div className="max-w-3xl">
      <PageHeader back={{ href: `/invoices/${id}`, label: 'Draft' }} title="Edit draft" />
      <InvoiceForm
        action={updateInvoice}
        invoice={invoice}
        items={items}
        clients={clients}
        income={income}
        settings={settings}
        today={todayIST()}
        cancelHref={`/invoices/${id}`}
      />
    </div>
  )
}
