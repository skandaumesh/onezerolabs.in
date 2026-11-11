import { NewEventForm } from '@/components/EventForm'
import { EventPost } from '@/components/EventPost'
import { SheetButton } from '@/components/Sheet'
import { BUTTON_PRIMARY, Card, Empty, PageHeader } from '@/components/ui'
import { requireUser } from '@/lib/auth'
import { todayIST } from '@/lib/dates.mjs'
import { listEvents } from '@/lib/queries'

export const metadata = { title: 'Events' }

export default async function EventsPage() {
  await requireUser()
  const today = todayIST()
  const events = await listEvents()

  const addEvent = (
    <SheetButton label="Add event" title="New Event" className={`${BUTTON_PRIMARY} whitespace-nowrap`}>
      <NewEventForm today={today} />
    </SheetButton>
  )

  return (
    <>
      <PageHeader back={{ href: '/', label: 'Overview' }} title="Events" description="Every event we go to, with photos and what came of it." action={addEvent} />

      {events.length ? (
        <div className="mx-auto max-w-xl space-y-9">
          {events.map((e) => (
            <EventPost key={e.id} event={e} today={today} />
          ))}
        </div>
      ) : (
        <Card>
          <Empty title="No events yet" action={addEvent}>
            Post the meetups, conferences and client visits you go to, with photos and a note of what happened.
          </Empty>
        </Card>
      )}
    </>
  )
}
