import Link from 'next/link'
import { CircleDot, Clapperboard, GalleryHorizontalEnd, Image as ImageIcon, ListChecks } from 'lucide-react'
import { CheckButton } from '@/components/forms'
import { Badge } from '@/components/ui'
import { toggleContentDone } from '@/lib/actions/content'
import { FORMAT_LABEL } from '@/lib/content.mjs'
import { dueLabel, formatDay } from '@/lib/dates.mjs'

export const FORMAT_ICON = { reel: Clapperboard, carousel: GalleryHorizontalEnd, post: ImageIcon, story: CircleDot }

export function FormatTag({ format }) {
  const Icon = FORMAT_ICON[format] ?? ImageIcon
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-pill px-2 py-0.5 text-cap font-medium text-ink2">
      <Icon size={12} aria-hidden="true" />
      {FORMAT_LABEL[format]}
    </span>
  )
}

/** A post as a database row: tick, topic, then day, format, owner and checklist progress. */
export function ContentRow({ post, today, showDate = true }) {
  const done = Boolean(post.done_at)
  const due = dueLabel(post.post_date, today)
  return (
    <li className="row-press flex flex-wrap items-start gap-x-3 px-4 py-3">
      <CheckButton action={toggleContentDone} id={post.id} done={post.done_at} label={post.topic} />
      <div className="min-w-0 flex-1 basis-40">
        <Link href={`/content/${post.id}`} className={`break-words text-body after:absolute after:inset-0 md:text-sub ${done ? 'text-muted line-through' : 'text-ink'}`}>
          {post.topic}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-foot text-muted">
          {showDate && (done ? <span>{formatDay(post.post_date, today)}</span> : <Badge tone={due.tone}>{due.text}</Badge>)}
          <FormatTag format={post.format} />
          {post.owner_name && <span>{post.owner_name}</span>}
          {post.step_count > 0 && (
            <span className={`inline-flex items-center gap-1 tabular-nums ${post.steps_done === post.step_count ? 'text-good' : ''}`}>
              <ListChecks size={13} aria-hidden="true" />
              {post.steps_done}/{post.step_count}
            </span>
          )}
        </div>
      </div>
    </li>
  )
}
