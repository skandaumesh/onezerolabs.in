'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { Expand, Minus, Plus } from 'lucide-react'
import { drawPage, openPdf } from '@/lib/pdf-client'
import { lockPageScroll } from '@/lib/scroll-lock'

const MAX_ZOOM = 4
const DOUBLE_TAP_MS = 300
const clamp = (n, low, high) => Math.min(high, Math.max(low, n))

/** The width an element has to fill, kept up to date. */
function useWidth(element) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!element) return undefined
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)))
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])
  return width
}

/**
 * One page, the right size from the start so nothing jumps as pages arrive. It is
 * drawn only near the screen and let go further away, so a long agreement never
 * fills a phone's memory. A new size is drawn off screen and swapped in, so zooming
 * never flashes blank.
 */
function Page({ page, number, width, root, onOpen }) {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)
  const [near, setNear] = useState(false)
  const base = page.getViewport({ scale: 1 })
  const height = Math.round((width * base.height) / base.width)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { root, rootMargin: '900px 0px' })
    observer.observe(boxRef.current)
    return () => observer.disconnect()
  }, [root])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!near) {
      canvas.width = 0 // gives the memory back
      canvas.height = 0
      return undefined
    }
    if (!width) return undefined
    let task
    let cancelled = false
    const timer = setTimeout(() => {
      const fresh = document.createElement('canvas')
      task = drawPage(page, fresh, width)
      task.promise
        .then(() => {
          if (cancelled) return
          canvas.width = fresh.width
          canvas.height = fresh.height
          canvas.getContext('2d').drawImage(fresh, 0, 0)
        })
        .catch(() => {})
    }, 80)
    return () => {
      cancelled = true
      clearTimeout(timer)
      task?.cancel()
    }
  }, [near, width, page])

  const sheet = (
    <div ref={boxRef} style={{ width, height }} className="relative mx-auto bg-paper shadow-[0_1px_4px_rgba(0,0,0,0.18)]">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  )
  if (!onOpen) {
    return (
      <div role="img" aria-label={`Page ${number}`} data-page={number}>
        {sheet}
      </div>
    )
  }
  return (
    <button type="button" onClick={onOpen} aria-label={`Page ${number}, open full screen`} data-page={number} className="block w-full">
      {sheet}
    </button>
  )
}

/**
 * Full screen, like Quick Look on iPhone: pinch or double-tap to zoom, Done to go back.
 * On a computer, + and - zoom too.
 */
function FullScreen({ pages, start, name, onClose }) {
  const dialogRef = useRef(null)
  const contentRef = useRef(null)
  const [scroller, setScroller] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [current, setCurrent] = useState(start + 1)
  const zoomRef = useRef(1)
  zoomRef.current = zoom

  const available = useWidth(scroller)
  const fit = Math.max(0, Math.min(available, 900) - 16)
  const width = Math.round(fit * zoom)

  // Before the first paint, so it never shows for a moment outside the top layer.
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
    return lockPageScroll()
  }, [])

  // Opens at the page that was tapped, once the pages have their size.
  const placed = useRef(false)
  useEffect(() => {
    if (placed.current || !fit || !contentRef.current) return
    placed.current = true
    contentRef.current.querySelector(`[data-page="${start + 1}"]`)?.scrollIntoView({ block: 'start' })
  }, [fit, start])

  // The counter shows the page across the middle of the screen, which still works
  // when a zoomed page is taller than the screen. Only once the pages have their size.
  const laidOut = fit > 0
  useEffect(() => {
    if (!scroller || !laidOut) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const box = scroller.getBoundingClientRect()
      const middle = box.top + scroller.clientHeight / 2
      for (const el of scroller.querySelectorAll('[data-page]')) {
        const r = el.getBoundingClientRect()
        if (r.top <= middle && r.bottom >= middle) {
          setCurrent(Number(el.dataset.page))
          return
        }
      }
      // In the gap between pages, or past the last one: the nearest above the middle.
      const above = [...scroller.querySelectorAll('[data-page]')].filter((el) => el.getBoundingClientRect().top <= middle)
      if (above.length) setCurrent(Number(above.at(-1).dataset.page))
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(update)
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [scroller, pages, laidOut, zoom])

  /** Zooms keeping the point under the fingers, or the middle of the screen, where it is. */
  const zoomTo = (next, x, y) => {
    const from = zoomRef.current
    const to = clamp(next, 1, MAX_ZOOM)
    if (!scroller || to === from) return
    const px = x ?? scroller.clientWidth / 2
    const py = y ?? scroller.clientHeight / 2
    const ratio = to / from
    const left = (scroller.scrollLeft + px) * ratio - px
    const top = (scroller.scrollTop + py) * ratio - py
    flushSync(() => setZoom(to))
    scroller.scrollLeft = left
    scroller.scrollTop = top
  }

  // Pinch and double-tap. Native pinch is turned off here (touch-action), so the
  // page itself doesn't zoom and the toolbar stays where it is.
  useEffect(() => {
    if (!scroller) return undefined
    const content = contentRef.current
    let pinch = null
    let lastTap = null

    const point = (touch) => {
      const rect = scroller.getBoundingClientRect()
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
    }
    const spread = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)

    const onStart = (e) => {
      if (e.touches.length !== 2) return
      const [a, b] = e.touches
      const pa = point(a)
      const pb = point(b)
      pinch = { distance: spread(a, b), x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2, scale: 1 }
      lastTap = null
    }
    const onMove = (e) => {
      if (!pinch || e.touches.length !== 2) return
      e.preventDefault()
      const zoomNow = zoomRef.current
      pinch.scale = clamp(spread(e.touches[0], e.touches[1]) / pinch.distance, 1 / zoomNow, MAX_ZOOM / zoomNow)
      content.style.transformOrigin = `${scroller.scrollLeft + pinch.x}px ${scroller.scrollTop + pinch.y}px`
      content.style.transform = `scale(${pinch.scale})`
    }
    const onEnd = (e) => {
      if (pinch) {
        if (e.touches.length > 0) return
        const { scale, x, y } = pinch
        pinch = null
        content.style.transform = ''
        zoomTo(zoomRef.current * scale, x, y)
        return
      }
      // Two quick taps in one place: zoom in there, or back out.
      if (e.changedTouches.length !== 1 || e.touches.length > 0) return
      const tap = { ...point(e.changedTouches[0]), at: e.timeStamp }
      if (lastTap && tap.at - lastTap.at < DOUBLE_TAP_MS && Math.hypot(tap.x - lastTap.x, tap.y - lastTap.y) < 30) {
        e.preventDefault()
        zoomTo(zoomRef.current > 1 ? 1 : 2.5, tap.x, tap.y)
        lastTap = null
      } else lastTap = tap
    }

    scroller.addEventListener('touchstart', onStart, { passive: true })
    scroller.addEventListener('touchmove', onMove, { passive: false })
    scroller.addEventListener('touchend', onEnd, { passive: false })
    scroller.addEventListener('touchcancel', onEnd, { passive: false })
    return () => {
      scroller.removeEventListener('touchstart', onStart)
      scroller.removeEventListener('touchmove', onMove)
      scroller.removeEventListener('touchend', onEnd)
      scroller.removeEventListener('touchcancel', onEnd)
    }
    // zoomTo reads live values through refs and the scroller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroller])

  const onKeyDown = (e) => {
    if (e.key === '+' || e.key === '=') zoomTo(zoomRef.current * 1.5)
    else if (e.key === '-') zoomTo(zoomRef.current / 1.5)
    else if (e.key === '0') zoomTo(1)
  }

  const onDoubleClick = (e) => {
    if (e.pointerType === 'touch') return // handled above
    const rect = scroller.getBoundingClientRect()
    zoomTo(zoomRef.current > 1 ? 1 : 2, e.clientX - rect.left, e.clientY - rect.top)
  }

  const iconButton = 'press flex h-11 w-11 items-center justify-center rounded-full text-accent disabled:text-muted disabled:opacity-60'

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-label={`${name}, full screen`}
      onCancel={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }}
      onClose={(e) => e.stopPropagation()}
      onKeyDown={onKeyDown}
      className="fixed inset-0 m-0 flex h-full max-h-none w-full max-w-none animate-[page-in_160ms_ease-out_both] flex-col overflow-clip bg-canvas p-0 backdrop:bg-transparent"
    >
      <header className="glass relative z-10 flex shrink-0 items-center gap-2 border-b border-line px-2 pb-1 pt-[max(0.25rem,env(safe-area-inset-top))] [border-top:0]">
        <button type="button" onClick={onClose} className="press min-h-11 px-2 text-body font-semibold text-accent md:text-sub">
          Done
        </button>
        <h2 className="min-w-0 flex-1 truncate text-center text-sub font-semibold text-ink">{name}</h2>
        <button type="button" onClick={() => zoomTo(zoomRef.current / 1.5)} disabled={zoom <= 1} aria-label="Zoom out" className={iconButton}>
          <Minus size={20} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => zoomTo(zoomRef.current * 1.5)} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in" className={iconButton}>
          <Plus size={20} aria-hidden="true" />
        </button>
      </header>

      <div
        ref={setScroller}
        onDoubleClick={onDoubleClick}
        className="min-h-0 flex-1 overflow-auto overscroll-contain"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        <div ref={contentRef} className="mx-auto w-fit min-w-full space-y-3 px-2 pb-[calc(env(safe-area-inset-bottom)+4rem)] pt-3">
          {pages.map((page, i) => (
            <Page key={i} page={page} number={i + 1} width={width} root={scroller} />
          ))}
        </div>
      </div>

      <p
        role="status"
        className="glass dock pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1.5 text-foot font-medium tabular-nums text-ink"
      >
        {current} of {pages.length}
        {zoom > 1 && <span className="text-muted"> · {Math.round(zoom * 100)}%</span>}
      </p>
    </dialog>,
    document.body
  )
}

/**
 * Shows a PDF inside the app: every page, fitted to the width. Tapping a page opens
 * it full screen, where it can be zoomed.
 */
export function PdfViewer({ src, name }) {
  const [box, setBox] = useState(null)
  const [pages, setPages] = useState(null)
  const [failed, setFailed] = useState(false)
  const [full, setFull] = useState(null)
  const width = useWidth(box)

  useEffect(() => {
    let task = null
    let gone = false
    setPages(null)
    setFailed(false)
    openPdf(src)
      .then(async (loading) => {
        task = loading
        if (gone) return loading.destroy()
        const pdf = await loading.promise
        const all = await Promise.all(Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1)))
        if (!gone) setPages(all)
      })
      .catch(() => {
        if (!gone) setFailed(true)
      })
    return () => {
      gone = true
      task?.destroy()
    }
  }, [src])

  if (failed) {
    return (
      <div role="alert" className="card-surface rounded-card bg-surface px-5 py-10 text-center text-sub text-muted">
        This PDF couldn’t be shown here. Download it to open it.
      </div>
    )
  }

  return (
    <section aria-label={`${name}, ${pages ? `${pages.length} pages` : 'opening'}`}>
      <div className="mb-2 flex min-h-11 items-center justify-between gap-3">
        <p role="status" className="text-foot text-muted">
          {pages ? (pages.length === 1 ? '1 page' : `${pages.length} pages`) : 'Opening…'}
        </p>
        {pages && (
          <button type="button" onClick={() => setFull(0)} className="press inline-flex min-h-11 items-center gap-1.5 px-1 text-sub font-medium text-accent">
            <Expand size={16} aria-hidden="true" />
            Full screen
          </button>
        )}
      </div>

      <div ref={setBox} className="space-y-3">
        {pages ? (
          pages.map((page, i) => <Page key={i} page={page} number={i + 1} width={width} root={null} onOpen={() => setFull(i)} />)
        ) : (
          <div aria-hidden="true" className="skeleton mx-auto aspect-[1/1.414] w-full bg-paper shadow-[0_1px_4px_rgba(0,0,0,0.18)]" />
        )}
      </div>

      {full !== null && pages && <FullScreen pages={pages} start={full} name={name} onClose={() => setFull(null)} />}
    </section>
  )
}
