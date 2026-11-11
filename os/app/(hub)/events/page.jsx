import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { NewEventForm } from '@/components/EventForm'
import { EventPost } from '@/components/EventPost'
import { SheetButton } from '@/components/Sheet'
import { Badge, BUTTON_PRIMARY, Card, Empty, PageHeader, Tabs } from '@/components/ui'
import { requireUser } from '@/lib/auth'
import { formatTime, minutesIST, todayIST } from '@/lib/dates.mjs'
import { countdown, isUpcoming } from '@/lib/events.mjs'
import { listEvents } from '@/lib/queries'

export const metadata = { title: 'Events' }

const MONTH = (day) => new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' }).format(new Date(`${day}T00:00:00Z`)).toUpperCase()

/** An upcoming event as a calendar row: the date as a little calendar page, then what, when and where. */
function UpcomingRow({ event, today }) {
  const soon = countdown(event.happened_on, today)
  const detail = [event.start_time ? formatTime(event.start_time) : null, event.place].filter(Boolean).join(' · ')
  return (
    <li className="row-press relative flex items-center gap-3.5 px-4 py-3">
      <span aria-hidden="true" className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-fill">
        <span className="text-[0.625rem] font-semibold leading-none tracking-wide text-late">{MONTH(event.happened_on)}</span>
        <span className="mt-0.5 text-title font-semibold leading-none text-ink">{Number(event.happened_on.slice(8))}</span>
      </span>
      <span className="min-w-0 flex-1">
        <Link href={`/events/${event.id}`} className="block break-words text-body font-medium text-ink after:absolute after:inset-0 md:text-sub">
          {event.title}
        </Link>
        {detail && <span className="mt-0.5 block break-words text-foot text-muted">{detail}</span>}
      </span>
      <Badge tone={soon.tone}>{soon.text}</Badge>
      <ChevronRight size={18} className="shrink-0 text-muted" aria-hidden="true" />
    </li>
  )
}

/**
 * Events in two lists. Upcoming: what's ahead, soonest first, with a reminder on
 * both phones the day before. Completed: what's happened, as posts with photos.
 * An event moves from one to the other by itself once its day has passed.
 */
export default async function EventsPage({ searchParams }) {
  await requireUser()
  const today = todayIST()
  const params = await searchParams
  const events = await listEvents()
  const now = minutesIST()
  const upcoming = events
    .filter((e) => isUpcoming(e, today, now))
    .sort((a, b) => a.happened_on.localeCompare(b.happened_on) || (a.start_time ?? '99').localeCompare(b.start_time ?? '99'))
  const completed = events.filter((e) => !isUpcoming(e, today, now))
  const show = params.show === 'completed' || params.show === 'upcoming' ? params.show : upcoming.length || !completed.length ? 'upcoming' : 'completed'

  const addEvent = (
    <SheetButton label="Add event" title={show === 'upcoming' ? 'Upcoming Event' : 'Completed Event'} className={`${BUTTON_PRIMARY} whitespace-nowrap`}>
      <NewEventForm today={today} kind={show} />
    </SheetButton>
  )

  return (
    <>
      <PageHeader back={{ href: '/', label: 'Overview' }} title="Events" action={addEvent} />

      <div className="mb-5">
        <Tabs
          label="Which events"
          active={show}
          items={[
            { value: 'upcoming', label: 'Upcoming', count: upcoming.length, href: '/events?show=upcoming' },
            { value: 'completed', label: 'Completed', count: completed.length, href: '/events?show=completed' },
          ]}
        />
      </div>

      {show === 'upcoming' ? (
        upcoming.length ? (
          <div className="mx-auto max-w-xl">
            <Card>
              <ul className="rows">
                {upcoming.map((e) => (
                  <UpcomingRow key={e.id} event={e} today={today} />
                ))}
              </ul>
            </Card>
            <p className="mt-3 px-1 text-foot text-muted">You’ll both get a reminder on your phones the day before each event.</p>
          </div>
        ) : (
          <Card>
            <Empty title="No upcoming events" action={addEvent}>
              Add the meetups, conferences and client visits coming up. You’ll both be reminded the day before.
            </Empty>
          </Card>
        )
      ) : completed.length ? (
        <div className="mx-auto max-w-xl space-y-9">
          {completed.map((e) => (
            <EventPost key={e.id} event={e} today={today} />
          ))}
        </div>
      ) : (
        <Card>
          <Empty title="No completed events yet" action={addEvent}>
            Once an event has happened, it shows here as a post. Add its photos and what came of it.
          </Empty>
        </Card>
      )}
    </>
  )
}
