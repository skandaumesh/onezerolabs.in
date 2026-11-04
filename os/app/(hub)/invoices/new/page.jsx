import Link from 'next/link'
import { InvoiceForm } from '@/components/InvoiceForm'
import { BUTTON_PRIMARY, Card, Empty, PageHeader } from '@/components/ui'
import { createInvoice } from '@/lib/actions/invoices'
import { requireUser } from '@/lib/auth'
import { addDays, todayIST } from '@/lib/dates.mjs'
import { isUuid } from '@/lib/forms'
import { getSettings, listClientsForInvoice, listIncome } from '@/lib/queries'

export const metadata = { title: 'New invoice' }

export default async function NewInvoicePage({ searchParams }) {
  await requireUser()
  const { client } = await searchParams
  const today = todayIST()
  const [clients, income, settings] = await Promise.all([listClientsForInvoice(), listIncome(), getSettings()])

  return (
    <div className="max-w-3xl">
      <PageHeader back={{ href: '/invoices', label: 'Invoices' }} title="New invoice" />
      {clients.length ? (
        <InvoiceForm
          action={createInvoice}
          clients={clients}
          income={income}
          settings={settings}
          today={today}
          defaultDue={addDays(today, 15)}
          defaultClient={isUuid(client) ? client : undefined}
          cancelHref="/invoices"
        />
      ) : (
        <Card>
          <Empty
            title="Add a client first"
            action={
              <Link href="/clients/new?stage=won" className={BUTTON_PRIMARY}>
                Add client
              </Link>
            }
          >
            Every invoice is for a client.
          </Empty>
        </Card>
      )}
    </div>
  )
}
