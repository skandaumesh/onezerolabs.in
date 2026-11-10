import { ArrowDownLeft, ArrowUpRight, Trash2 } from 'lucide-react'
import { BankEntryForm } from '@/components/BankEntryForm'
import { EarningForm } from '@/components/EarningForm'
import { ActionForm, ConfirmSubmit, Submit } from '@/components/forms'
import { SheetButton } from '@/components/Sheet'
import { Badge, BUTTON_PRIMARY, BUTTON_SECONDARY, Card, Empty, PageHeader, Tabs } from '@/components/ui'
import { deleteBankEntry, deleteEarning, markSharePaid } from '@/lib/actions/bank'
import { requireUser } from '@/lib/auth'
import { SHARE_PERCENT, shareStatus, SPEND_LABEL, summariseBank } from '@/lib/bank.mjs'
import { formatDay, todayIST } from '@/lib/dates.mjs'
import { formatINR } from '@/lib/money.mjs'
import { listBankEntries, listCompanyOptions, listEarnings, listUsers } from '@/lib/queries'

export const metadata = { title: 'Bank' }

const DELETE_BUTTON = 'press -mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-late'

function Amount({ value, tone = 'ink' }) {
  return <span className={`shrink-0 text-body font-semibold tabular-nums md:text-sub ${tone === 'good' ? 'text-good' : 'text-ink'}`}>{value}</span>
}

export default async function BankPage() {
  const user = await requireUser()
  const today = todayIST()
  const [earnings, entries, users, companies] = await Promise.all([listEarnings(), listBankEntries(), listUsers(), listCompanyOptions()])
  const summary = summariseBank({ earnings, entries, users, today })
  const pending = earnings.filter((e) => !e.paid_on)

  const addEarning = (
    <SheetButton label="Add earning" title="Add earning" className={`${BUTTON_PRIMARY} whitespace-nowrap`}>
      <EarningForm users={users} meId={user.id} companies={companies} today={today} />
    </SheetButton>
  )

  return (
    <>
      <PageHeader back={{ href: '/', label: 'Overview' }} title="Bank" action={addEarning} />

      <div className="mb-4">
        <Tabs
          label="Money"
          active="bank"
          items={[
            { value: 'revenue', label: 'Revenue', href: '/revenue' },
            { value: 'invoices', label: 'Invoices', href: '/invoices' },
            { value: 'bank', label: 'Bank', href: '/bank' },
          ]}
        />
      </div>

      <section aria-label="Company balance" className="card-surface mb-4 rounded-card bg-surface p-5 md:p-6">
        <p className="text-sub text-muted">In the company bank</p>
        <p data-balance="" className={`mt-1 text-[clamp(2.25rem,11vw,3.25rem)] font-bold leading-none tracking-[-0.03em] tabular-nums ${summary.balance < 0 ? 'text-late' : 'text-ink'}`}>
          {formatINR(summary.balance)}
        </p>
        <p className="mt-2.5 text-foot text-muted">
          This month: {formatINR(summary.monthIn)} in · {formatINR(summary.monthOut)} out
          {summary.toPay > 0 && <span className="font-medium text-soon"> · {formatINR(summary.toPay)} still to pay in</span>}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <SheetButton
            title="Money in"
            className={`${BUTTON_SECONDARY} flex-1 whitespace-nowrap sm:flex-none`}
            label={
              <>
                <ArrowDownLeft size={17} aria-hidden="true" />
                Money in
              </>
            }
          >
            <BankEntryForm direction="in" today={today} />
          </SheetButton>
          <SheetButton
            title="Money out"
            className={`${BUTTON_SECONDARY} flex-1 whitespace-nowrap sm:flex-none`}
            label={
              <>
                <ArrowUpRight size={17} aria-hidden="true" />
                Money out
              </>
            }
          >
            <BankEntryForm direction="out" today={today} />
          </SheetButton>
        </div>
      </section>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className="min-w-0 space-y-4">
          {pending.length > 0 && (
            <Card id="to-pay" title="To pay into the bank" count={pending.length}>
              <ul className="rows pb-1">
                {pending.map((e) => {
                  const status = shareStatus(e, today)
                  return (
                    <li key={e.id} className="flex items-center gap-3 px-4 py-3">
                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-body text-ink md:text-sub">
                          {e.user_name}: {formatINR(e.share)}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-foot text-muted">
                          <span>
                            {SHARE_PERCENT}% of {formatINR(e.amount)}
                          </span>
                          <Badge tone={status.tone}>{status.text}</Badge>
                        </span>
                      </span>
                      <ActionForm action={markSharePaid} errorTitle="Couldn’t Save">
                        <input type="hidden" name="id" value={e.id} />
                        <Submit aria-label={`Mark ${e.user_name}’s ${formatINR(e.share)} as paid in`} className={`${BUTTON_SECONDARY} whitespace-nowrap`}>
                          Paid
                        </Submit>
                      </ActionForm>
                    </li>
                  )
                })}
              </ul>
            </Card>
          )}

          <Card id="this-month" title={summary.thisMonth.label}>
            <ul className="rows">
              {summary.thisMonth.people.map((p) => (
                <li key={p.name} className="flex items-baseline justify-between gap-3 px-4 py-3">
                  <span className="min-w-0">
                    <span className="block text-body text-ink md:text-sub">{p.name}</span>
                    <span className="block text-foot text-muted">Earned {formatINR(p.earned)}</span>
                  </span>
                  <span className="text-right">
                    <Amount value={formatINR(p.share)} />
                    <span className="block text-foot text-muted">to the company</span>
                  </span>
                </li>
              ))}
              <li className="flex items-baseline justify-between gap-3 px-4 py-3">
                <span className="text-body font-semibold text-ink md:text-sub">Together</span>
                <Amount value={formatINR(summary.thisMonth.toCompany)} tone="good" />
              </li>
            </ul>
          </Card>

          <Card id="earnings" title="Earnings" count={earnings.length}>
            {earnings.length ? (
              <ul className="rows pb-1">
                {earnings.map((e) => {
                  const status = shareStatus(e, today)
                  return (
                    <li key={e.id} className="flex items-center gap-3 py-3 pl-4 pr-3">
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="min-w-0 break-words text-body text-ink md:text-sub">{e.user_name}</span>
                          <Amount value={formatINR(e.amount)} />
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-foot text-muted">
                          <span>{formatDay(e.received_on, today)}</span>
                          {e.company_name && <span className="break-words">{e.company_name}</span>}
                          {e.note && <span className="break-words">{e.note}</span>}
                          <span>{formatINR(e.share)} to the company</span>
                          <Badge tone={status.tone}>{status.text}</Badge>
                        </span>
                      </span>
                      <ActionForm action={deleteEarning} errorTitle="Couldn’t Delete">
                        <input type="hidden" name="id" value={e.id} />
                        <ConfirmSubmit
                          title="Delete Earning?"
                          message={`${e.user_name}’s ${formatINR(e.amount)} and its ${formatINR(e.share)} share come off the record.`}
                          aria-label={`Delete ${e.user_name}’s earning of ${formatINR(e.amount)}`}
                          className={DELETE_BUTTON}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </ConfirmSubmit>
                      </ActionForm>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <Empty title="No earnings yet" action={addEarning}>
                Add what each of you earns from OneZeroLabs work. {SHARE_PERCENT}% of it goes to the company bank.
              </Empty>
            )}
          </Card>
        </div>

        <div className="min-w-0 space-y-4">
          <Card id="money" title="Money in and out" count={entries.length}>
            {entries.length ? (
              <ul className="rows pb-1">
                {entries.map((b) => (
                  <li key={b.id} className="flex items-center gap-3 py-3 pl-4 pr-3">
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="min-w-0 break-words text-body text-ink md:text-sub">{b.description}</span>
                        <Amount value={`${b.direction === 'out' ? '−' : '+'}${formatINR(b.amount)}`} tone={b.direction === 'in' ? 'good' : 'ink'} />
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-foot text-muted">
                        <span>{formatDay(b.entry_date, today)}</span>
                        {b.category && <span>{SPEND_LABEL[b.category]}</span>}
                        {b.direction === 'out' && <span>Agreed by both</span>}
                        {b.added_by && <span>Added by {b.added_by}</span>}
                      </span>
                    </span>
                    <ActionForm action={deleteBankEntry} errorTitle="Couldn’t Delete">
                      <input type="hidden" name="id" value={b.id} />
                      <ConfirmSubmit
                        title={b.direction === 'out' ? 'Delete Spending?' : 'Delete Money In?'}
                        message={`${formatINR(b.amount)} for ${b.description} comes off the record.`}
                        aria-label={`Delete ${b.description}`}
                        className={DELETE_BUTTON}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </ConfirmSubmit>
                    </ActionForm>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="Nothing in or out yet">Add the opening balance with Money in, and spending with Money out.</Empty>
            )}
          </Card>

          {summary.byMonth.length > 0 && (
            <Card id="by-month" title="By month">
              <ul className="rows">
                {summary.byMonth.map((m) => (
                  <li key={m.key} className="flex items-baseline justify-between gap-3 px-4 py-3">
                    <span className="min-w-0">
                      <span className="block text-body text-ink md:text-sub">{m.label}</span>
                      <span className="block break-words text-foot text-muted">
                        {m.people.map((p) => `${p.name} ${formatINR(p.earned)}`).join(' · ')}
                      </span>
                    </span>
                    <span className="text-right">
                      <Amount value={formatINR(m.toCompany)} tone="good" />
                      <span className="block text-foot text-muted">to the company</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
