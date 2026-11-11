import Link from 'next/link'
import { Ellipsis } from 'lucide-react'
import { Caption, PostPhotos } from '@/components/EventPhotos'
import { Avatar } from '@/components/ui'
import { avatarUrl } from '@/lib/avatar.mjs'
import { formatDay } from '@/lib/dates.mjs'

/**
 * An event as a post, as iPhone apps show one, straight on the page with no card:
 * who posted it, where and when, the photos with rounded corners, then the name
 * and what happened.
 */
export function EventPost({ event, today, expanded = false, manage = true, heading: Heading = 'h2' }) {
  const by = event.added_by ?? 'OneZeroLabs'
  const where = [event.place ? `At ${event.place}` : null, formatDay(event.happened_on, today)].filter(Boolean).join(' · ')
  return (
    <article aria-label={event.title}>
      <header className="-mr-2 flex items-center gap-3 pb-3">
        <Avatar name={by} photo={avatarUrl(event.added_by_id, event.added_by_avatar_v)} size="medium" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sub font-semibold leading-tight text-ink">{by}</div>
          <div className="mt-0.5 truncate text-foot leading-tight text-muted">
            <time dateTime={event.happened_on}>{where}</time>
          </div>
        </div>
        {manage && (
          <Link href={`/events/${event.id}`} aria-label={`Edit or add photos to ${event.title}`} className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-ink">
            <Ellipsis size={20} aria-hidden="true" />
          </Link>
        )}
      </header>

      {event.photos.length > 0 && <PostPhotos photos={event.photos} title={event.title} />}

      <div className="pt-3">
        <Heading className="break-words text-headline text-ink">{event.title}</Heading>
        {event.description && <Caption text={event.description} expanded={expanded} />}
      </div>
    </article>
  )
}
