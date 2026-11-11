import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BellRing, ChevronLeft } from 'lucide-react'
import { EditEventForm } from '@/components/EventForm'
import { AddPhotosButton } from '@/components/EventPhotos'
import { EventPost } from '@/components/EventPost'
import { ActionForm, ConfirmSubmit } from '@/components/forms'
import { SheetButton } from '@/components/Sheet'
import { BUTTON_DANGER, BUTTON_SECONDARY } from '@/components/ui'
import { deleteEvent } from '@/lib/actions/events'
import { requireUser } from '@/lib/auth'
import { formatTime, minutesIST, todayIST } from '@/lib/dates.mjs'
import { isUpcoming, photoCount } from '@/lib/events.mjs'
import { isUuid } from '@/lib/forms'
import { getEvent } from '@/lib/queries'

export async function generateMetadata({ params }) {
  const { id } = await params
  const event = isUuid(id) ? await getEvent(id) : null
  return { title: event?.title ?? 'Event' }
}

/** One event's post in full, with what can be done to it. */
export default async function EventPage({ params }) {
  await requireUser()
  const { id } = await params
  const event = isUuid(id) ? await getEvent(id) : null
  if (!event) notFound()
  const today = todayIST()
  const photos = event.photos.length
  const upcoming = event.happened_on > today

  return (
    <div className="mx-auto max-w-xl">
      <Link href={`/events?show=${isUpcoming(event, today, minutesIST()) ? 'upcoming' : 'completed'}`} className="press -ml-1.5 mb-3 inline-flex min-h-9 items-center gap-0.5 text-body text-accent md:text-sub">
        <ChevronLeft size={20} strokeWidth={2.25} aria-hidden="true" />
        Events
      </Link>

      <EventPost event={event} today={today} expanded manage={false} heading="h1" />

      {upcoming && (
        <p className="mt-4 flex items-start gap-2.5 rounded-xl bg-fill px-3.5 py-3 text-foot text-ink2">
          <BellRing size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
          <span>
            You’ll both get a reminder on your phones the day before, at {event.start_time ? formatTime(event.start_time) : '9:00 am'}. Photos can be
            added once the day comes.
          </span>
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-start gap-2">
        {!upcoming && <AddPhotosButton eventId={event.id} className={BUTTON_SECONDARY} />}
        <SheetButton label="Edit event" title="Edit Event" className={BUTTON_SECONDARY}>
          <EditEventForm event={event} today={today} />
        </SheetButton>
        <ActionForm action={deleteEvent} errorTitle="Couldn’t Delete">
          <input type="hidden" name="id" value={event.id} />
          <ConfirmSubmit
            title="Delete Event?"
            message={`“${event.title}”${photos ? ` and its ${photoCount(photos)}` : ''} will be deleted for both of you.`}
            className={BUTTON_DANGER}
          >
            Delete event
          </ConfirmSubmit>
        </ActionForm>
      </div>
    </div>
  )
}
