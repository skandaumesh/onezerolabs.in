/* Shared presentational pieces. No hooks, so server pages can use them directly. */

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

// 16px on phones on purpose: iOS zooms the whole page when a smaller field is tapped.
export const CONTROL =
  'min-h-11 w-full rounded-xl bg-field px-3.5 py-2.5 text-body text-ink placeholder:text-muted outline-none ' +
  'transition-shadow duration-150 focus:bg-surface focus:ring-[3px] focus:ring-accent/30 md:min-h-10 md:text-sub ' +
  '[&::-webkit-date-and-time-value]:text-left'

const BUTTON_BASE =
  'press inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-5 text-body font-medium md:min-h-10 md:text-sub ' +
  'disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export const BUTTON_PRIMARY = `${BUTTON_BASE} bg-accent-fill text-white hover:bg-accent-press active:bg-accent-press`
export const BUTTON_SECONDARY = `${BUTTON_BASE} bg-fill text-ink hover:bg-fill-hover`
export const BUTTON_DANGER = `${BUTTON_BASE} bg-late-soft text-late hover:opacity-85`
export const BUTTON_TEXT =
  'press -my-1 inline-flex min-h-9 items-center text-sub font-medium text-accent ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function PageHeader({ back, eyebrow, title, description, action }) {
  return (
    <header className="mb-5 md:mb-7">
      {back && (
        <Link href={back.href} className="press -ml-1.5 mb-1.5 inline-flex min-h-9 max-w-full items-center gap-0.5 text-body text-accent md:text-sub">
          <ChevronLeft size={20} strokeWidth={2.25} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{back.label}</span>
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          {eyebrow && <div className="mb-1 text-sub font-medium text-muted">{eyebrow}</div>}
          <h1 className="break-words text-large-title text-ink md:text-display">{title}</h1>
          {description && <p className="mt-1.5 max-w-2xl text-body text-muted md:text-sub">{description}</p>}
        </div>
        {action}
      </div>
    </header>
  )
}

export function Card({ title, count, action, id, className = '', children }) {
  return (
    <section id={id} className={`card-surface scroll-mt-6 overflow-hidden rounded-card bg-surface ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 px-4 pb-1.5 pt-3.5">
          <h2 className="min-w-0 break-words text-headline text-ink">
            {title}
            {count !== undefined && <span className="ml-1.5 font-normal text-muted">{count}</span>}
          </h2>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Field({ label, hint, wide, children }) {
  return (
    <label className={`block min-w-0 ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1.5 block text-foot font-medium text-ink2">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-foot text-muted">{hint}</span>}
    </label>
  )
}

export const Input = (props) => <input className={CONTROL} {...props} />

export const Textarea = (props) => <textarea className={CONTROL} rows={3} {...props} />

/** `blank` adds an empty first option with that label. */
export function Select({ options, blank, ...props }) {
  return (
    <select className={`${CONTROL} select-arrow`} {...props}>
      {blank !== undefined && <option value="">{blank}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

const TONES = {
  plain: 'bg-pill text-ink2',
  late: 'bg-late-soft text-late',
  soon: 'bg-soon-soft text-soon',
  good: 'bg-good-soft text-good',
}

/** A person's first initial in a circle. */
export function Avatar({ name, large = false }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent-fill font-semibold text-white ${
        large ? 'h-16 w-16 text-title' : 'h-8 w-8 text-sub'
      }`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  )
}

export function Badge({ tone = 'plain', children }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-cap font-medium ${TONES[tone]}`}>
      {children}
    </span>
  )
}

export function Progress({ done, total }) {
  const percent = total ? Math.round((done / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Project progress"
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-fill"
      >
        {/* Moved, not resized: a transform is the one change the browser can draw cheaply. */}
        <div className="bar h-full rounded-full bg-accent" style={{ transform: `translateX(${percent - 100}%)` }} />
      </div>
      <span className="whitespace-nowrap text-foot text-muted tabular-nums">
        {total ? `${done} of ${total} done` : 'No tasks yet'}
      </span>
    </div>
  )
}

export function Empty({ title, action, children }) {
  return (
    <div className="px-5 pb-8 pt-6 text-center">
      <p className="text-body font-medium text-ink md:text-sub">{title}</p>
      {children && <p className="mx-auto mt-1 max-w-md text-sub text-muted">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/** A segmented control. Each segment is a link, so the view stays in the URL. */
export function Tabs({ label, items, active }) {
  return (
    <nav aria-label={label} className="inline-flex max-w-full flex-wrap gap-0.5 rounded-[0.9rem] bg-fill p-0.5">
      {items.map((item) => (
        <Link
          key={item.value}
          href={item.href}
          aria-current={item.value === active ? 'page' : undefined}
          className={`press inline-flex min-h-9 items-center rounded-xl px-3.5 text-sub ${
            item.value === active ? 'bg-thumb font-medium text-ink shadow-[0_1px_3px_rgba(0,0,0,0.12)]' : 'text-ink2'
          }`}
        >
          {item.label}
          {item.count !== undefined && (
            <span className={`ml-1.5 tabular-nums ${item.value === active ? 'text-ink2' : 'text-muted'}`}>{item.count}</span>
          )}
        </Link>
      ))}
    </nav>
  )
}
