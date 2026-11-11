import Link from 'next/link'
import { Ellipsis, ImagePlus, MapPin } from 'lucide-react'
import { AddPhotosButton, Caption, PostPhotos } from '@/components/EventPhotos'
import { Avatar } from '@/components/ui'
import { avatarUrl } from '@/lib/avatar.mjs'
import { formatDay, formatTime } from '@/lib/dates.mjs'

/**
 * An event as a post on a card of frosted glass, with no colour of its own: who
 * posted it, where and when, the photos with rounded corners, then the name and
 * what happened.
 */
export function EventPost({ event, today, expanded = false, manage = true, heading: Heading = 'h2' }) {
  const by = event.added_by ?? 'OneZeroLabs'
  const date = `${formatDay(event.happened_on, today)}${event.start_time ? `, ${formatTime(event.start_time)}` : ''}`
  const happened = event.happened_on <= today
  const cover = event.photos[0]

  return (
    <article aria-label={event.title} className="post-glass overflow-hidden rounded-[1.75rem] p-2.5">
      <header className="flex items-center gap-3 py-1 pl-1.5">
        <Avatar name={by} photo={avatarUrl(event.added_by_id, event.added_by_avatar_v)} size="medium" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sub font-semibold leading-tight text-ink">{by}</div>
          <div className="mt-0.5 flex min-w-0 items-center gap-1 text-foot leading-tight text-muted">
            {event.place && (
              <>
                <MapPin size={12} aria-hidden="true" className="shrink-0" />
                <span className="truncate">{event.place}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <time dateTime={event.happened_on} className="shrink-0">
              {date}
            </time>
          </div>
        </div>
        {manage && (
          <Link
            href={`/events/${event.id}`}
            aria-label={`Edit or add photos to ${event.title}`}
            className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-ink"
          >
            <Ellipsis size={20} aria-hidden="true" />
          </Link>
        )}
      </header>

      {cover ? (
        <div className="mt-2 overflow-hidden rounded-[1.25rem]">
          <PostPhotos photos={event.photos} title={event.title} />
        </div>
      ) : (
        happened &&
        manage && (
          <div className="mt-2 flex flex-col items-center gap-3 rounded-[1.25rem] border border-dashed border-[color:var(--line)] px-4 py-8 text-center">
            <ImagePlus size={26} strokeWidth={1.75} aria-hidden="true" className="text-muted" />
            <p className="text-sub text-muted">No photos from this event yet.</p>
            <AddPhotosButton eventId={event.id} className="press inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-fill px-5 text-body font-semibold text-ink hover:bg-fill-hover md:min-h-10 md:text-sub" />
          </div>
        )
      )}

      <div className="px-1.5 pb-1.5 pt-3">
        <Heading className="break-words text-headline text-ink">{event.title}</Heading>
        {event.description && <Caption text={event.description} expanded={expanded} />}
      </div>
    </article>
  )
}
