import Link from 'next/link'
import { BellRing, CalendarDays, ChevronLeft, ChevronRight, List } from 'lucide-react'
import { ContentPostForm, ImportPlanForm } from '@/components/ContentForms'
import { ContentRow, FORMAT_ICON } from '@/components/ContentRow'
import { SheetButton } from '@/components/Sheet'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Card, Empty, PageHeader, Tabs } from '@/components/ui'
import { requireUser } from '@/lib/auth'
import { addDays, todayIST } from '@/lib/dates.mjs'
import { isUuid } from '@/lib/forms'
import { listContentPosts, listUsers } from '@/lib/queries'

export const metadata = { title: 'Content' }

const ARROW = 'press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fill text-ink hover:bg-fill-hover'
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const monthName = (ym) => new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${ym}-01T00:00:00Z`))
const shiftMonth = (ym, n) => {
  const [y, m] = ym.split('-').map(Number)
  const t = y * 12 + (m - 1) + n
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`
}

/** The month as weeks of seven days, Monday first, padded with the days around it. */
const monthGrid = (ym) => {
  const first = `${ym}-01`
  const weekday = (new Date(`${first}T00:00:00Z`).getUTCDay() + 6) % 7
  let day = addDays(first, -weekday)
  const weeks = []
  do {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(day, i)))
    day = addDays(day, 7)
  } while (day.slice(0, 7) === ym)
  return weeks
}

/** A month of posts as a calendar, as Notion's calendar view. Each post opens its page. */
function CalendarView({ posts, month, today, href }) {
  const byDay = Object.groupBy ? Object.groupBy(posts, (p) => p.post_date) : posts.reduce((a, p) => ((a[p.post_date] ??= []).push(p), a), {})
  return (
    <Card>
      <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-3.5">
        <Link href={href({ month: shiftMonth(month, -1) })} aria-label="Previous month" className={ARROW}>
          <ChevronLeft size={18} aria-hidden="true" />
        </Link>
        <h2 className="text-headline text-ink">{monthName(month)}</h2>
        <Link href={href({ month: shiftMonth(month, 1) })} aria-label="Next month" className={ARROW}>
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-7 border-t border-[color:var(--line)] text-center text-cap font-medium text-muted">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1.5">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {monthGrid(month)
          .flat()
          .map((day) => {
            const inMonth = day.slice(0, 7) === month
            const items = byDay[day] ?? []
            return (
              <div key={day} className={`min-h-[4.75rem] border-t border-[color:var(--line)] p-1 md:min-h-[6.5rem] md:p-1.5 [&:not(:nth-child(7n+1))]:border-l ${inMonth ? '' : 'opacity-40'}`}>
                <div className="mb-1 flex justify-center md:justify-start">
                  <span className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-foot tabular-nums ${day === today ? 'bg-accent-fill font-semibold text-white' : 'text-ink2'}`}>
                    {Number(day.slice(8))}
                  </span>
                </div>
                <ul className="space-y-1">
                  {items.map((p) => {
                    const Icon = FORMAT_ICON[p.format]
                    return (
                      <li key={p.id}>
                        <Link
                          href={`/content/${p.id}`}
                          title={p.topic}
                          aria-label={`${p.topic}${p.done_at ? ', done' : ''}`}
                          className={`press flex items-center justify-center gap-1 rounded-md px-1 py-0.5 text-[0.6875rem] leading-tight md:justify-start ${
                            p.done_at ? 'bg-good-soft text-good' : 'bg-fill text-ink'
                          }`}
                        >
                          <Icon size={12} aria-hidden="true" className="shrink-0" />
                          <span className={`hidden truncate md:inline ${p.done_at ? 'line-through' : ''}`}>{p.topic}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
      </div>
    </Card>
  )
}

export default async function ContentPage({ searchParams }) {
  const user = await requireUser()
  const params = await searchParams
  const today = todayIST()
  const users = await listUsers()

  const who = params.who === 'all' || params.who === 'both' || isUuid(params.who) ? params.who : 'all'
  const view = params.view === 'calendar' ? 'calendar' : 'list'
  const month = /^\d{4}-\d{2}$/.test(params.month ?? '') ? params.month : today.slice(0, 7)
  const ownerId = who === 'all' || who === 'both' ? null : who === 'me' ? user.id : who
  const posts = await listContentPosts(ownerId, who === 'both')

  const href = (next) => {
    const q = new URLSearchParams({ view, who, ...(view === 'calendar' ? { month } : {}), ...next })
    return `/content?${q}`
  }
  const people = [
    { value: 'all', label: 'Everyone', href: href({ who: 'all' }) },
    { value: user.id, label: 'Mine', href: href({ who: user.id }) },
    ...users.filter((u) => u.id !== user.id).map((u) => ({ value: u.id, label: u.name, href: href({ who: u.id }) })),
    { value: 'both', label: 'Both', href: href({ who: 'both' }) },
  ]

  const todays = posts.filter((p) => p.post_date === today)
  const themes = [...new Set(posts.map((p) => p.theme).filter(Boolean))]
  const doneCount = posts.filter((p) => p.done_at).length

  // The list hides posts done more than a week ago, so it stays about what's next.
  const recent = addDays(today, -7)
  const shown = posts.filter((p) => !p.done_at || p.post_date >= recent)
  const groups = []
  for (const p of shown) {
    const title = p.theme ?? 'Other posts'
    const group = groups.find((g) => g.title === title) ?? groups[groups.push({ title, posts: [] }) - 1]
    group.posts.push(p)
  }

  const addPost = (
    <SheetButton label="Add post" title="New Post" className={`${BUTTON_PRIMARY} whitespace-nowrap`}>
      <ContentPostForm users={users} today={today} defaultOwner={user.id} themes={themes} />
    </SheetButton>
  )
  const importPlan = (
    <SheetButton label="Import plan" title="Import a Plan" className={`${BUTTON_SECONDARY} whitespace-nowrap`}>
      <ImportPlanForm users={users} today={today} />
    </SheetButton>
  )

  return (
    <>
      <PageHeader
        back={{ href: '/', label: 'Overview' }}
        title="Content"
        description={posts.length ? `${doneCount} of ${posts.length} posts done` : 'Plan your social media posts, day by day.'}
        action={
          <div className="flex flex-wrap gap-2">
            {importPlan}
            {addPost}
          </div>
        }
      />

      {todays.length > 0 && (
        <Card title="Today" count={todays.length} className="mb-4">
          <ul className="rows rows-task">
            {todays.map((p) => (
              <ContentRow key={p.id} post={p} today={today} showDate={false} />
            ))}
          </ul>
          <p className="flex items-center gap-1.5 px-4 pb-3.5 text-foot text-muted">
            <BellRing size={13} aria-hidden="true" />
            Your phones remind you both at 5 pm until it’s ticked.
          </p>
        </Card>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Tabs label="Whose posts" active={who} items={people} />
        <nav aria-label="View" className="inline-flex gap-0.5 rounded-[0.9rem] bg-fill p-0.5">
          {[
            { value: 'list', label: 'List', icon: List },
            { value: 'calendar', label: 'Calendar', icon: CalendarDays },
          ].map(({ value, label, icon: Icon }) => (
            <Link
              key={value}
              href={href({ view: value })}
              aria-current={view === value ? 'page' : undefined}
              className={`press inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3 text-sub ${view === value ? 'bg-thumb font-medium text-ink shadow-[0_1px_3px_rgba(0,0,0,0.12)]' : 'text-ink2'}`}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {!posts.length ? (
        <Card>
          <Empty
            title="No posts planned yet"
            action={
              <div className="flex flex-wrap justify-center gap-2">
                {importPlan}
                {addPost}
              </div>
            }
          >
            Import a month’s plan in one go, or add posts one at a time. Each day’s post reminds you both at 5 pm.
          </Empty>
        </Card>
      ) : view === 'calendar' ? (
        <CalendarView posts={posts} month={month} today={today} href={href} />
      ) : (
        <div className="space-y-4">
          {groups.map((g) => (
            <Card key={g.title} title={g.title} count={`${g.posts.filter((p) => p.done_at).length}/${g.posts.length}`}>
              <ul className="rows rows-task">
                {g.posts.map((p) => (
                  <ContentRow key={p.id} post={p} today={today} />
                ))}
              </ul>
            </Card>
          ))}
          {shown.length < posts.length && <p className="px-1 text-foot text-muted">Posts done more than a week ago are in the Calendar view.</p>}
        </div>
      )}
    </>
  )
}
