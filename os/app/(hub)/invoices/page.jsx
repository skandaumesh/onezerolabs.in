import Link from 'next/link'
import { Badge, BUTTON_PRIMARY, BUTTON_TEXT, Card, Empty, PageHeader, Tabs } from '@/components/ui'
import { requireUser } from '@/lib/auth'
import { todayIST, formatDay } from '@/lib/dates.mjs'
import { invoiceState, withBalance } from '@/lib/invoice.mjs'
import { formatINR } from '@/lib/money.mjs'
import { getSettings, listInvoices } from '@/lib/queries'

export const metadata = { title: 'Invoices' }

function Figure({ label, value, alert }) {
  return (
    <div className="card-surface rounded-card bg-surface p-4 md:p-5">
      <div className={`text-[clamp(1.25rem,6.5vw,1.75rem)] font-bold leading-none tracking-[-0.025em] tabular-nums ${alert ? 'text-late' : 'text-ink'}`}>
        {value}
      </div>
      <div className="mt-2 text-foot text-muted">{label}</div>
    </div>
  )
}

export default async function InvoicesPage() {
  await requireUser()
  const today = todayIST()
  const [rows, settings] = await Promise.all([listInvoices(), getSettings()])

  const invoices = rows.map((inv) => withBalance(inv, settings))
  const issued = invoices.filter((i) => i.status === 'issued')
  const overdue = issued.filter((i) => invoiceState(i, today).text === 'Overdue')
  const outstanding = issued.reduce((sum, i) => sum + i.balance, 0)
  const collected = invoices.reduce((sum, i) => sum + i.paid, 0)
  const newInvoice = (
    <Link href="/invoices/new" className={BUTTON_PRIMARY}>
      New invoice
    </Link>
  )

  return (
    <>
      <PageHeader back={{ href: '/', label: 'Overview' }} title="Invoices" action={newInvoice} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Tabs
          label="Money"
          active="invoices"
          items={[
            { value: 'revenue', label: 'Revenue', href: '/revenue' },
            { value: 'invoices', label: 'Invoices', href: '/invoices' },
            { value: 'bank', label: 'Bank', href: '/bank' },
          ]}
        />
        <Link href="/invoices/settings" className={BUTTON_TEXT}>
          Invoice details
        </Link>
      </div>

      {invoices.length ? (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Figure label="Still to collect" value={formatINR(outstanding)} />
            <Figure label="Overdue invoices" value={overdue.length} alert={overdue.length > 0} />
            <Figure label="Collected on invoices" value={formatINR(collected)} />
            <Figure label="Drafts" value={invoices.filter((i) => i.status === 'draft').length} />
          </div>

          <Card>
            <ul className="rows pt-1">
              {invoices.map((inv) => {
                const state = invoiceState(inv, today)
                return (
                  <li key={inv.id} className="row-press px-4 py-3">
                    <span className="flex items-baseline justify-between gap-3">
                      <Link href={`/invoices/${inv.id}`} className="min-w-0 break-words text-body font-medium text-ink after:absolute after:inset-0 md:text-sub">
                        {inv.bill_to_name}
                      </Link>
                      <span className="shrink-0 text-body font-semibold text-ink tabular-nums md:text-sub">{formatINR(inv.total)}</span>
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-foot text-muted">
                      <span>{inv.number ?? 'No number yet'}</span>
                      <span>{formatDay(inv.issue_date, today)}</span>
                      <Badge tone={state.tone}>{state.text}</Badge>
                      {state.text === 'Part paid' && <span>{formatINR(inv.balance)} to come</span>}
                    </span>
                  </li>
                )
              })}
            </ul>
          </Card>
        </>
      ) : (
        <Card>
          <Empty title="No invoices yet" action={newInvoice}>
            Start one for any client. It stays a draft you can change until you issue it.
          </Empty>
        </Card>
      )}
    </>
  )
}
