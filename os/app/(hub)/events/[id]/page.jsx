import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { EditEventForm } from '@/components/EventForm'
import { AddPhotosButton } from '@/components/EventPhotos'
import { EventPost } from '@/components/EventPost'
import { ActionForm, ConfirmSubmit } from '@/components/forms'
import { SheetButton } from '@/components/Sheet'
import { BUTTON_DANGER, BUTTON_SECONDARY } from '@/components/ui'
import { deleteEvent } from '@/lib/actions/events'
import { requireUser } from '@/lib/auth'
import { todayIST } from '@/lib/dates.mjs'
import { photoCount } from '@/lib/events.mjs'
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

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/events" className="press -ml-1.5 mb-3 inline-flex min-h-9 items-center gap-0.5 text-body text-accent md:text-sub">
        <ChevronLeft size={20} strokeWidth={2.25} aria-hidden="true" />
        Events
      </Link>

      <EventPost event={event} today={today} expanded manage={false} heading="h1" />

      <div className="mt-4 flex flex-wrap items-start gap-2">
        <AddPhotosButton eventId={event.id} className={BUTTON_SECONDARY} />
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
