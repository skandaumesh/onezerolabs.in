import Link from 'next/link'
import { Ellipsis, ImagePlus, MapPin } from 'lucide-react'
import { AddPhotosButton, Caption, PostPhotos } from '@/components/EventPhotos'
import { Avatar } from '@/components/ui'
import { avatarUrl } from '@/lib/avatar.mjs'
import { formatDay, formatTime } from '@/lib/dates.mjs'

/** A soft colour field behind a post with no photo yet: Apple-like blue, violet and pink. */
const NO_PHOTO_BACKDROP =
  'radial-gradient(circle at 15% 20%, #5ac8fa 0, transparent 55%), radial-gradient(circle at 85% 30%, #af52de 0, transparent 55%), radial-gradient(circle at 50% 95%, #ff6482 0, transparent 60%), #5e5ce6'

/**
 * An event as a post in iPhone's glass style. Behind it is a heavy blur of its
 * own first photo; on that, frosted panels hold who posted it and where, the
 * photos, and the name and what happened. Without photos the colour comes from
 * a soft gradient instead.
 */
export function EventPost({ event, today, expanded = false, manage = true, heading: Heading = 'h2' }) {
  const by = event.added_by ?? 'OneZeroLabs'
  const date = `${formatDay(event.happened_on, today)}${event.start_time ? `, ${formatTime(event.start_time)}` : ''}`
  const happened = event.happened_on <= today
  const cover = event.photos[0]

  return (
    <article aria-label={event.title} className="relative isolate overflow-hidden rounded-[1.75rem] p-2.5 shadow-[0_20px_44px_-22px_rgba(0,0,0,0.45)]">
      {/* The backdrop: the cover photo, blown up, blurred and brightened, then tinted for the theme. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        {cover ? (
          <img src={`/events/photo/${cover.id}?small`} alt="" className="h-full w-full scale-150 object-cover blur-3xl saturate-150" />
        ) : (
          <div className="h-full w-full" style={{ background: NO_PHOTO_BACKDROP }} />
        )}
        <div className="absolute inset-0 bg-[var(--post-tint)]" />
      </div>

      <header className="post-glass flex items-center gap-3 rounded-[1.25rem] py-2 pl-2.5 pr-1">
        <Avatar name={by} photo={avatarUrl(event.added_by_id, event.added_by_avatar_v)} size="medium" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sub font-semibold leading-tight text-ink">{by}</div>
          <div className="mt-0.5 flex min-w-0 items-center gap-1 text-foot leading-tight text-ink2">
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
            className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink2 hover:text-ink"
          >
            <Ellipsis size={20} aria-hidden="true" />
          </Link>
        )}
      </header>

      {cover ? (
        <div className="mt-2.5 overflow-hidden rounded-[1.25rem] shadow-[0_10px_30px_-14px_rgba(0,0,0,0.5)]">
          <PostPhotos photos={event.photos} title={event.title} />
        </div>
      ) : (
        happened &&
        manage && (
          <div className="post-glass mt-2.5 flex flex-col items-center gap-3 rounded-[1.25rem] px-4 py-8 text-center">
            <ImagePlus size={26} strokeWidth={1.75} aria-hidden="true" className="text-ink2" />
            <p className="text-sub text-ink2">No photos from this event yet.</p>
            <AddPhotosButton eventId={event.id} className="press inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-[var(--post-glass)] px-5 text-body font-semibold text-ink md:min-h-10 md:text-sub" />
          </div>
        )
      )}

      <div className="post-glass mt-2.5 rounded-[1.25rem] px-4 py-3">
        <Heading className="break-words text-headline text-ink">{event.title}</Heading>
        {event.description && <Caption text={event.description} expanded={expanded} />}
      </div>
    </article>
  )
}
