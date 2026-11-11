'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, ImagePlus, Trash2, X } from 'lucide-react'
import { ProblemAlert } from '@/components/Alert'
import { showBanner } from '@/components/Banner'
import { UploadProgress } from '@/components/EventForm'
import { ActionForm, ConfirmSubmit } from '@/components/forms'
import { BUTTON_PRIMARY } from '@/components/ui'
import { deleteEventPhoto } from '@/lib/actions/events'
import { photoCount } from '@/lib/events.mjs'
import { uploadPhotos } from '@/lib/photo-client'
import { lockPageScroll } from '@/lib/scroll-lock'

const src = (id, small) => `/events/photo/${id}${small ? '?small' : ''}`

/** Picks photos and adds them to an event, saying how far it has got. */
export function AddPhotosButton({ eventId, className = BUTTON_PRIMARY }) {
  const router = useRouter()
  const pickRef = useRef(null)
  const [progress, setProgress] = useState(null)
  const [problem, setProblem] = useState(null)

  const onPick = async (e) => {
    const files = [...e.target.files]
    e.target.value = ''
    if (!files.length) return
    const { saved, failed } = await uploadPhotos(eventId, files, setProgress)
    if (saved) showBanner(`${photoCount(saved)} added`)
    if (failed.length) setProblem(failed)
    router.refresh()
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <input ref={pickRef} type="file" accept="image/*" multiple className="sr-only" tabIndex={-1} onChange={onPick} aria-label="Photos to add" />
      <button type="button" disabled={Boolean(progress)} onClick={() => pickRef.current?.click()} className={`${className} whitespace-nowrap`}>
        <ImagePlus size={18} aria-hidden="true" />
        Add photos
      </button>
      <UploadProgress progress={progress} />
      {problem && (
        <ProblemAlert title={problem.length > 1 ? 'Some Photos Weren’t Added' : 'Photo Not Added'} message={problem.join('\n')} onClose={() => setProblem(null)} />
      )}
    </div>
  )
}

const VIEWER_BUTTON = 'press flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25'

/** Full screen, one photo at a time: arrows, swipes or the keyboard move along. */
function Viewer({ photos, index, onMove, onClose }) {
  const photo = photos[index]
  const closeRef = useRef(null)
  const touch = useRef(null)

  useEffect(() => {
    const unlock = lockPageScroll()
    const opener = document.activeElement
    closeRef.current?.focus()
    return () => {
      unlock()
      opener?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !document.querySelector('dialog[role=alertdialog][open]')) onClose()
      if (e.key === 'ArrowLeft') onMove(-1)
      if (e.key === 'ArrowRight') onMove(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onMove, onClose])

  if (!photo) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      className="fixed inset-0 z-50 flex flex-col bg-black"
      onPointerDown={(e) => (touch.current = { x: e.clientX, y: e.clientY })}
      onPointerUp={(e) => {
        const start = touch.current
        touch.current = null
        if (!start) return
        const dx = e.clientX - start.x
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - start.y)) onMove(dx < 0 ? 1 : -1)
      }}
    >
      <div className="flex items-center justify-between gap-3 px-3 pb-2 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={VIEWER_BUTTON}>
          <X size={20} aria-hidden="true" />
        </button>
        <span className="text-sub tabular-nums text-white/80">
          {index + 1} of {photos.length}
        </span>
        <ActionForm action={deleteEventPhoto} errorTitle="Couldn’t Delete">
          <input type="hidden" name="id" value={photo.id} />
          <ConfirmSubmit title="Delete Photo?" message="It will be removed from this event for both of you." aria-label="Delete this photo" className={VIEWER_BUTTON}>
            <Trash2 size={18} aria-hidden="true" />
          </ConfirmSubmit>
        </ActionForm>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        {/* The small copy is already in the browser, so it shows at once while the full one loads over it. */}
        <img key={`${photo.id}-small`} src={src(photo.id, true)} alt="" className="absolute max-h-full max-w-full object-contain blur-[2px]" style={{ aspectRatio: `${photo.width} / ${photo.height}` }} />
        <img key={photo.id} src={src(photo.id)} alt={`Photo ${index + 1}`} className="relative max-h-full max-w-full object-contain" style={{ aspectRatio: `${photo.width} / ${photo.height}` }} />
        {photos.length > 1 && (
          <>
            <button type="button" onClick={() => onMove(-1)} aria-label="Previous photo" className={`${VIEWER_BUTTON} absolute left-3 top-1/2 hidden -translate-y-1/2 md:flex`}>
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => onMove(1)} aria-label="Next photo" className={`${VIEWER_BUTTON} absolute right-3 top-1/2 hidden -translate-y-1/2 md:flex`}>
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * A post's photos, as on Instagram: swipe between them, with a count in the
 * corner and dots below. All take the first photo's shape, kept between tall
 * (4:5) and wide (1.91:1). The small copy shows at once while the full one loads.
 * Tapping a photo opens it full screen.
 */
export function PostPhotos({ photos, title }) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(null)
  const track = useRef(null)
  const first = photos[0]
  const ratio = Math.min(1.91, Math.max(0.8, first.width / first.height))
  const move = useCallback((step) => setOpen((i) => (i === null ? i : (i + step + photos.length) % photos.length)), [photos.length])
  const close = useCallback(() => setOpen(null), [])

  // A deleted photo leaves the list; stay on the one that took its place.
  useEffect(() => {
    if (open !== null && open >= photos.length) setOpen(photos.length ? photos.length - 1 : null)
    if (index >= photos.length) setIndex(Math.max(0, photos.length - 1))
  }, [open, index, photos.length])

  const onScroll = () => {
    const el = track.current
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }
  const slide = (step) => track.current?.scrollBy({ left: step * track.current.clientWidth, behavior: 'smooth' })

  return (
    <div>
      {/* Rounded corners, as iPhone shows a photo in a post. */}
      <div className="relative overflow-hidden rounded-2xl">
        <div
          ref={track}
          onScroll={onScroll}
          aria-label={`Photos of ${title}`}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-fill [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ aspectRatio: ratio }}
        >
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo ${i + 1} of ${photos.length}`}
              className="relative h-full w-full shrink-0 snap-center snap-always bg-cover bg-center"
              style={{ backgroundImage: `url(${src(p.id, true)})` }}
            >
              <img src={src(p.id)} alt="" loading={i === 0 ? 'eager' : 'lazy'} decoding="async" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        {photos.length > 1 && (
          <>
            <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-cap font-medium tabular-nums text-white">
              {index + 1}/{photos.length}
            </span>
            {index > 0 && (
              <button type="button" onClick={() => slide(-1)} aria-label="Previous photo" className="press absolute left-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black shadow md:flex">
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
            )}
            {index < photos.length - 1 && (
              <button type="button" onClick={() => slide(1)} aria-label="Next photo" className="press absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black shadow md:flex">
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            )}
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div aria-hidden="true" className="flex justify-center gap-1 pt-2.5">
          {photos.map((p, i) => (
            <span key={p.id} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === index ? 'bg-accent' : 'bg-fill'}`} />
          ))}
        </div>
      )}
      {open !== null && <Viewer photos={photos} index={open} onMove={move} onClose={close} />}
    </div>
  )
}

/** The description under a post: three lines, then "more" to read the rest. */
export function Caption({ text, expanded = false }) {
  const [open, setOpen] = useState(expanded)
  const [long, setLong] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (el) setLong(el.scrollHeight > el.clientHeight + 1)
  }, [text])

  return (
    <div className="mt-1">
      <p ref={ref} className={`whitespace-pre-line break-words text-body text-ink2 md:text-sub ${open ? '' : 'line-clamp-3'}`}>
        {text}
      </p>
      {!open && long && (
        <button type="button" onClick={() => setOpen(true)} className="press -my-1 min-h-9 text-sub text-muted">
          more
        </button>
      )}
    </div>
  )
}
