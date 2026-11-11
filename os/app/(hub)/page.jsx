import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { TaskRow } from '@/components/TaskRow'
import { Badge, Card, Empty, PageHeader } from '@/components/ui'
import { requireUser } from '@/lib/auth'
import { STAGE_LABEL } from '@/lib/constants.mjs'
import { dueLabel, formatDay, hourIST, todayIST } from '@/lib/dates.mjs'
import { formatINR, summariseIncome } from '@/lib/money.mjs'
import { withBalance } from '@/lib/invoice.mjs'
import { formatBytes } from '@/lib/documents.mjs'
import { summariseBank } from '@/lib/bank.mjs'
import { goalState, periodStart } from '@/lib/goals.mjs'
import { getDocumentStats, getOverview, getSettings, listBankEntries, listEarnings, listEvents, listGoals, listIncome, listInvoices, listUsers } from '@/lib/queries'

export const metadata = { title: 'Overview' }

const greeting = () => {
  const hour = hourIST()
  if (hour < 12) return 'Good morning'
  return hour < 17 ? 'Good afternoon' : 'Good evening'
}

function Stat({ label, value, href, alert }) {
  return (
    <Link href={href} className="press card-surface block rounded-card bg-surface p-4 md:p-5">
      <div className={`text-[2.125rem] font-bold leading-none tracking-[-0.03em] tabular-nums ${alert && value > 0 ? 'text-late' : 'text-ink'}`}>
        {value}
      </div>
      <div className="mt-2 text-foot text-muted">{label}</div>
    </Link>
  )
}

function MoneyLink({ href, title, detail }) {
  return (
    <Link href={href} className="press card-surface flex items-center justify-between gap-2 rounded-card bg-surface p-4 md:px-5">
      <span className="min-w-0">
        <span className="block text-headline text-ink">{title}</span>
        <span className="mt-0.5 block text-foot text-muted">{detail}</span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-muted" aria-hidden="true" />
    </Link>
  )
}

/** A list row whose whole width is the link, with a date on the right. */
function DateRow({ href, title, detail, due }) {
  return (
    <li className="row-press flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3">
      <div className="min-w-0">
        <Link href={href} className="break-words text-body text-ink after:absolute after:inset-0 md:text-sub">
          {title}
        </Link>
        {detail && <div className="mt-0.5 text-foot text-muted">{detail}</div>}
      </div>
      <Badge tone={due.tone}>{due.text}</Badge>
    </li>
  )
}

export default async function OverviewPage() {
  const user = await requireUser()
  const today = todayIST()
  const [o, income, invoiceRows, settings, files, earnings, bankEntries, users, dayGoals, weekGoals, events] = await Promise.all([
    getOverview(user.id, today),
    listIncome(),
    listInvoices(),
    getSettings(),
    getDocumentStats(),
    listEarnings(),
    listBankEntries(),
    listUsers(),
    listGoals('day', today),
    listGoals('week', periodStart('week', today)),
    listEvents(),
  ])
  const bank = summariseBank({ earnings, entries: bankEntries, users, today })
  const totals = summariseIncome(income)
  const invoices = invoiceRows.map((inv) => withBalance(inv, settings))
  const toCollect = invoices.filter((i) => i.status === 'issued').reduce((sum, i) => sum + i.balance, 0)
  const goalCount = (goals) => `${goals.filter((g) => goalState(g).done).length} of ${goals.length}`
  const goalDetail = [dayGoals.length && `Today ${goalCount(dayGoals)}`, weekGoals.length && `This week ${goalCount(weekGoals)}`].filter(Boolean).join(' · ')

  return (
    <>
      <PageHeader eyebrow={formatDay(today, today)} title={`${greeting()}, ${user.name}`} />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Active projects" value={o.active_projects} href="/projects" />
        <Stat label="Deadlines in the next 7 days" value={o.upcoming_deadlines} href="#deadlines" />
        <Stat label="Overdue tasks" value={o.overdue_tasks} href="#today" alert />
        <Stat label="Follow-ups due" value={o.follow_ups_due} href="#follow-ups" alert />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MoneyLink
          href="/revenue"
          title="Revenue"
          detail={
            income.length
              ? `${formatINR(totals.monthly)} a month · ${formatINR(totals.projectValue)} in projects`
              : 'No income recorded yet'
          }
        />
        <MoneyLink
          href="/invoices"
          title="Invoices"
          detail={invoices.length ? `${formatINR(toCollect)} to collect` : 'No invoices yet'}
        />
        <MoneyLink
          href="/bank"
          title="Bank"
          detail={
            earnings.length || bankEntries.length
              ? `${formatINR(bank.balance)} in the bank${bank.toPay > 0 ? ` · ${formatINR(bank.toPay)} to pay in` : ''}`
              : 'The company fund'
          }
        />
        <MoneyLink
          href="/documents"
          title="Documents"
          detail={files.files ? `${files.files === 1 ? '1 file' : `${files.files} files`} · ${formatBytes(files.bytes)}` : 'Agreements and quotations'}
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MoneyLink href="/goals" title="Goals" detail={goalDetail || 'Daily, weekly, monthly, yearly'} />
        <MoneyLink
          href="/events"
          title="Events"
          detail={events.length ? `${events.length === 1 ? '1 event' : `${events.length} events`} · latest ${formatDay(events[0].happened_on, today)}` : 'Photos from events we attend'}
        />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Card id="today" title="Today’s priorities" count={o.attention.length}>
          {o.attention.length ? (
            <ul className="rows rows-task">
              {o.attention.map((task) => (
                <TaskRow key={task.id} task={task} today={today} />
              ))}
            </ul>
          ) : (
            <Empty title="Nothing due today">No overdue tasks either.</Empty>
          )}
        </Card>

        <Card id="follow-ups" title="Follow-ups due" count={o.followUps.length}>
          {o.followUps.length ? (
            <ul className="rows">
              {o.followUps.map((c) => (
                <DateRow
                  key={c.id}
                  href={`/clients/${c.id}`}
                  title={c.name}
                  detail={[STAGE_LABEL[c.stage], c.contact_name, c.owner_name].filter(Boolean).join(' · ')}
                  due={dueLabel(c.next_follow_up, today)}
                />
              ))}
            </ul>
          ) : (
            <Empty title="No follow-ups due">Nothing to chase today.</Empty>
          )}
        </Card>

        <Card id="deadlines" title="Coming up in the next 7 days" count={o.deadlines.length}>
          {o.deadlines.length ? (
            <ul className="rows">
              {o.deadlines.map((d) => (
                <DateRow
                  key={`${d.type}-${d.id}`}
                  href={d.type === 'task' ? `/tasks/${d.id}` : `/projects/${d.id}`}
                  title={d.title}
                  detail={[d.type === 'project' ? 'Project deadline' : null, d.company_name, d.person].filter(Boolean).join(' · ')}
                  due={dueLabel(d.due_date, today, d.due_time)}
                />
              ))}
            </ul>
          ) : (
            <Empty title="No deadlines this week" />
          )}
        </Card>

        <Card title="Waiting on clients" count={o.approvals.length}>
          {o.approvals.length ? (
            <ul className="rows rows-task">
              {o.approvals.map((task) => (
                <TaskRow key={task.id} task={task} today={today} />
              ))}
            </ul>
          ) : (
            <Empty title="No approvals outstanding">Set a task to “Awaiting client” and it will show here.</Empty>
          )}
        </Card>
      </div>
    </>
  )
}
