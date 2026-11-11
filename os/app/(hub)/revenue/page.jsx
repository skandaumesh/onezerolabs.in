import { IncomeForm } from '@/components/IncomeForm'
import { SheetButton } from '@/components/Sheet'
import { Badge, BUTTON_PRIMARY, Card, Empty, PageHeader, Tabs } from '@/components/ui'
import { requireUser } from '@/lib/auth'
import { formatINR, receivedStatus, summariseIncome } from '@/lib/money.mjs'
import { listCompanyOptions, listIncome } from '@/lib/queries'

export const metadata = { title: 'Revenue' }

function Figure({ label, value, hint }) {
  return (
    <div className="card-surface rounded-card bg-surface p-4 md:p-5">
      {/* Scales with the screen so a figure like ₹1,25,000 fits in a phone's half-width tile. */}
      <div className="text-[clamp(1.25rem,6.5vw,1.75rem)] font-bold leading-none tracking-[-0.025em] text-ink tabular-nums">{value}</div>
      <div className="mt-2 text-foot text-muted">{label}</div>
      {hint && <div className="mt-0.5 text-foot text-muted">{hint}</div>}
    </div>
  )
}

/**
 * One row. The exact amount sits beside the client in ink; the bar, when there is
 * one, only shows size. Tapping the row edits it.
 */
function IncomeRow({ item, companies, largest }) {
  const monthly = item.kind === 'monthly'
  const status = monthly ? null : receivedStatus(item)
  return (
    <li>
      <SheetButton
        title="Edit income"
        className="row-press block w-full px-4 py-3 text-left"
        label={
          <>
            <span className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 break-words text-body font-medium text-ink md:text-sub">{item.company_name}</span>
              <span className="shrink-0 text-body font-semibold text-ink tabular-nums md:text-sub">
                {formatINR(item.amount)}
                {monthly && <span className="font-normal text-muted"> /month</span>}
              </span>
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-foot text-muted">
              <span className="min-w-0 break-words">{item.description}</span>
              {status && <Badge tone={status.tone}>{status.text}</Badge>}
            </span>
            {largest && (
              <span aria-hidden="true" className="mt-2 block h-2 overflow-hidden">
                <span
                  className="block h-full min-w-1 rounded-r bg-[var(--bar)]"
                  style={{ width: `${(item.amount / largest) * 100}%` }}
                />
              </span>
            )}
          </>
        }
      >
        <IncomeForm item={item} companies={companies} />
      </SheetButton>
    </li>
  )
}

export default async function RevenuePage() {
  await requireUser()
  const [items, companies] = await Promise.all([listIncome(), listCompanyOptions()])
  const totals = summariseIncome(items)

  const projects = items.filter((i) => i.kind === 'project')
  const monthly = items.filter((i) => i.kind === 'monthly')
  const other = items.filter((i) => i.kind === 'other')
  const addIncome = (
    <SheetButton label="Add income" title="Add income" className={BUTTON_PRIMARY}>
      <IncomeForm companies={companies} />
    </SheetButton>
  )

  return (
    <>
      <PageHeader
        back={{ href: '/', label: 'Overview' }}
        title="Revenue"
        description="What work is worth, kept apart from what has been recorded as received."
        action={addIncome}
      />

      <div className="mb-4">
        <Tabs
          label="Money"
          active="revenue"
          items={[
            { value: 'revenue', label: 'Revenue', href: '/revenue' },
            { value: 'invoices', label: 'Invoices', href: '/invoices' },
            { value: 'bank', label: 'Bank', href: '/bank' },
          ]}
        />
      </div>

      {items.length ? (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Figure label="One-time project value" value={formatINR(totals.projectValue)} />
            <Figure label="Monthly income" value={formatINR(totals.monthly)} />
            <Figure label="Other work" value={formatINR(totals.other)} />
            <Figure
              label="Recorded as received"
              value={formatINR(totals.received)}
              hint={totals.unrecorded ? `${totals.unrecorded} not recorded yet` : undefined}
            />
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <Card title="Project value by client" count={projects.length}>
              {projects.length ? (
                <ul className="rows">
                  {projects.map((item) => (
                    <IncomeRow key={item.id} item={item} companies={companies} largest={projects[0].amount} />
                  ))}
                </ul>
              ) : (
                <Empty title="No one-time projects yet" />
              )}
            </Card>

            <div className="min-w-0 space-y-4">
              <Card title="Monthly income" count={monthly.length}>
                {monthly.length ? (
                  <ul className="rows">
                    {monthly.map((item) => (
                      <IncomeRow key={item.id} item={item} companies={companies} />
                    ))}
                  </ul>
                ) : (
                  <Empty title="No monthly fees yet" />
                )}
              </Card>

              {other.length > 0 && (
                <Card title="Other work" count={other.length}>
                  <ul className="rows">
                    {other.map((item) => (
                      <IncomeRow key={item.id} item={item} companies={companies} />
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </div>
        </>
      ) : (
        <Card>
          <Empty title="No income recorded yet">Add a client’s project or monthly fee and the totals will appear here.</Empty>
        </Card>
      )}
    </>
  )
}
