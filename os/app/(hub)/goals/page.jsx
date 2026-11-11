import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GoalForm } from '@/components/GoalForm'
import { GoalRow } from '@/components/GoalRow'
import { SheetButton } from '@/components/Sheet'
import { BUTTON_PRIMARY, BUTTON_TEXT, Card, Empty, PageHeader, Tabs } from '@/components/ui'
import { requireUser } from '@/lib/auth'
import { isValidDay, todayIST } from '@/lib/dates.mjs'
import { goalState, GOAL_PERIODS, PERIOD, periodLabel, periodStart, shiftPeriod } from '@/lib/goals.mjs'
import { listGoals, listUsers } from '@/lib/queries'

export const metadata = { title: 'Goals' }

const ARROW = 'press flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-fill text-ink hover:bg-fill-hover'

/** "Today" reads as "today" mid-sentence; dates keep their capitals. */
const phraseFor = (name, period) =>
  [PERIOD[period].current, PERIOD[period].previous, PERIOD[period].next].includes(name) ? name.toLowerCase() : name

export default async function GoalsPage({ searchParams }) {
  const user = await requireUser()
  const today = todayIST()
  const params = await searchParams
  const period = PERIOD[params.period] ? params.period : 'day'
  const start = periodStart(period, isValidDay(params.on ?? '') ? params.on : today)
  const current = periodStart(period, today)
  const label = periodLabel(period, start, today)
  const href = (p, on) => `/goals?period=${p}${on && on !== periodStart(p, today) ? `&on=${on}` : ''}`

  const [goals, users] = await Promise.all([listGoals(period, start), listUsers()])
  const doneCount = goals.filter((g) => goalState(g).done).length
  const groups = [
    { key: 'both', title: 'Together', items: goals.filter((g) => g.for_both) },
    { key: 'me', title: 'Yours', items: goals.filter((g) => !g.for_both && g.owner_id === user.id) },
    ...users
      .filter((u) => u.id !== user.id)
      .map((u) => ({ key: u.id, title: u.name, items: goals.filter((g) => !g.for_both && g.owner_id === u.id) })),
    { key: 'none', title: 'No one yet', items: goals.filter((g) => !g.for_both && !g.owner_id) },
  ].filter((g) => g.items.length)

  const addGoal = (
    <SheetButton label="Add goal" title="New Goal" className={`${BUTTON_PRIMARY} whitespace-nowrap`}>
      <GoalForm users={users} meId={user.id} period={period} on={start} />
    </SheetButton>
  )

  return (
    <>
      <PageHeader back={{ href: '/', label: 'Overview' }} title="Goals" action={addGoal} />

      <div className="mb-4">
        <Tabs label="Goal period" active={period} items={GOAL_PERIODS.map((p) => ({ value: p.value, label: p.label, href: href(p.value) }))} />
      </div>

      <section aria-label="Period" className="card-surface mb-4 rounded-card bg-surface p-4 md:p-5">
        <div className="flex items-center gap-3">
          <Link href={href(period, shiftPeriod(period, start, -1))} aria-label={`Previous ${PERIOD[period].noun}`} className={ARROW}>
            <ChevronLeft size={20} aria-hidden="true" />
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <h2 className="break-words text-title text-ink">{label.name}</h2>
            {label.detail && <p className="mt-0.5 text-foot text-muted">{label.detail}</p>}
          </div>
          <Link href={href(period, shiftPeriod(period, start, 1))} aria-label={`Next ${PERIOD[period].noun}`} className={ARROW}>
            <ChevronRight size={20} aria-hidden="true" />
          </Link>
        </div>

        {goals.length > 0 && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-baseline justify-between text-foot">
              <span className="font-medium text-ink">
                {doneCount} of {goals.length} done
              </span>
              <span className="text-muted tabular-nums">{Math.round((doneCount / goals.length) * 100)}%</span>
            </div>
            <div role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={goals.length} aria-label="Goals done" className="h-1.5 overflow-hidden rounded-full bg-fill">
              <div className="bar h-full rounded-full bg-good" style={{ transform: `translateX(${(doneCount / goals.length) * 100 - 100}%)` }} />
            </div>
          </div>
        )}
        {start !== current && (
          <div className="mt-3 text-center">
            <Link href={href(period)} className={BUTTON_TEXT}>
              Back to {PERIOD[period].current.toLowerCase()}
            </Link>
          </div>
        )}
      </section>

      {groups.length ? (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          {groups.map((g) => (
            <Card key={g.key} title={g.title} count={g.items.length}>
              <ul className="rows pb-1">
                {g.items.map((goal) => (
                  <GoalRow key={goal.id} goal={goal} period={period} start={start} users={users} periodPhrase={phraseFor(label.name, period)} />
                ))}
              </ul>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Empty title={`No goals for ${phraseFor(label.name, period)}`} action={addGoal}>
            Set what each of you, or both of you together, want done {start === current ? phraseFor(label.name, period) : `in this ${PERIOD[period].noun}`}. A repeating goal comes back every {PERIOD[period].noun}.
          </Empty>
        </Card>
      )}
    </>
  )
}
