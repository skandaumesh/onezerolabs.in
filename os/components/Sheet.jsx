'use client'

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { lockPageScroll } from '@/lib/scroll-lock'

const SheetContext = createContext(null)

/** Lets a form inside a sheet close it. Null outside a sheet. */
export const useSheet = () => useContext(SheetContext)

// Apple's sheet values. No bounce by default; a little only after a flick,
// because only then did something physical happen.
const SETTLE = { type: 'spring', visualDuration: 0.35, bounce: 0 }
const THROWN = { type: 'spring', visualDuration: 0.3, bounce: 0.2 }
const FADE = { duration: 0.2, ease: 'linear' }

const DESKTOP = '(min-width: 768px)'
const DRAG_START = 6 // px of movement before a press on the handle counts as a drag
const VELOCITY_WINDOW = 100 // ms of pointer history used to read release speed
const FLICK = 300 // px/s

/**
 * The finger's speed as it lifted, in px/s, downward positive. Measured back from
 * the last move, taking at least the sample before it, so a stutter that spaces
 * the moves out cannot make a flick read as standing still. A finger that had
 * already stopped before lifting really is at rest.
 */
const releaseSpeed = (history, now) => {
  const last = history[history.length - 1]
  if (!last || now - last.t > VELOCITY_WINDOW) return 0
  let first = last
  for (let i = history.length - 2; i >= 0; i--) {
    first = history[i]
    if (last.t - first.t >= VELOCITY_WINDOW) break
  }
  const seconds = (last.t - first.t) / 1000
  return seconds > 0 ? (last.y - first.y) / seconds : 0
}

/** Where a throw would come to rest, using Apple's scroll deceleration. */
const project = (velocity, rate = 0.998) => ((velocity / 1000) * rate) / (1 - rate)

/** Past an edge the sheet follows less and less, instead of stopping dead. */
const rubberband = (overshoot, dimension, constant = 0.55) =>
  (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))

/**
 * A button that opens a sheet: from the bottom on phones, centred on desktop.
 *
 * `shown` runs from 0 (closed) to 1 (open), and everything on screen is derived
 * from it. Springs always start from its live value and speed, so the sheet can
 * be grabbed or reversed at any moment, even while it is closing.
 */
export function SheetButton({ label, title, className, children, ...rest }) {
  const [mounted, setMounted] = useState(false)
  const [desktop, setDesktop] = useState(false)
  const [keyboard, setKeyboard] = useState(0)
  const dialogRef = useRef(null)
  const panelRef = useRef(null)
  const motionRef = useRef(null)
  const runRef = useRef(0)
  const dragRef = useRef(null)
  const travelRef = useRef(800)
  const titleId = useId()
  const reduced = useReducedMotion()

  const shown = useMotionValue(0)
  const scrim = useTransform(shown, [0, 1], [0, 1])
  const scale = useTransform(shown, [0, 1], [0.96, 1])
  const y = useTransform(shown, (v) => (1 - v) * travelRef.current)

  // Each run has a number, so a closing animation that was interrupted can never
  // finish the job and take away a sheet the user has since caught.
  const run = useCallback(
    (target, transition, onComplete) => {
      const id = ++runRef.current
      motionRef.current?.stop()
      motionRef.current = animate(shown, target, {
        ...transition,
        onComplete: () => {
          if (id === runRef.current) onComplete?.()
        },
      })
    },
    [shown]
  )

  const finish = useCallback(() => {
    dialogRef.current?.close()
    setMounted(false)
  }, [])

  const close = useCallback(
    (velocity = 0) => run(0, reduced ? FADE : { ...SETTLE, velocity }, finish),
    [run, finish, reduced]
  )

  const context = useMemo(() => ({ close }), [close])

  useEffect(() => {
    if (!mounted) return undefined
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
    travelRef.current = panelRef.current.offsetHeight
    panelRef.current.querySelector('[data-autofocus]')?.focus({ preventScroll: true })
    run(1, reduced ? FADE : SETTLE)

    const unlockScroll = lockPageScroll()

    // iOS draws the keyboard over a fixed sheet, so lift the sheet clear of it.
    const viewport = window.visualViewport
    const measure = () => setKeyboard(Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop))
    viewport?.addEventListener('resize', measure)
    viewport?.addEventListener('scroll', measure)

    return () => {
      unlockScroll()
      viewport?.removeEventListener('resize', measure)
      viewport?.removeEventListener('scroll', measure)
      setKeyboard(0)
    }
    // Runs once per opening. `reduced` and `run` are stable while it is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  const openSheet = () => {
    setDesktop(window.matchMedia(DESKTOP).matches)
    setMounted(true)
  }

  const canDrag = !desktop && !reduced

  const onPointerDown = (e) => {
    if (!canDrag || e.button !== 0) return
    runRef.current += 1
    motionRef.current?.stop() // catches it mid-flight, wherever it is
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      startY: e.clientY,
      startOffset: (1 - shown.get()) * travelRef.current,
      moved: false,
      history: [],
    }
  }

  const onPointerMove = (e) => {
    const drag = dragRef.current
    if (!drag) return
    if (!drag.moved) {
      if (Math.abs(e.clientY - drag.startY) < DRAG_START) return
      drag.moved = true
      drag.startY = e.clientY // from here it tracks 1:1, with no jump
    }
    const travel = travelRef.current
    const raw = drag.startOffset + (e.clientY - drag.startY)
    const offset = raw < 0 ? rubberband(raw, travel) : raw
    shown.set(1 - offset / travel)
    drag.history.push({ t: e.timeStamp, y: e.clientY })
  }

  const onPointerUp = (e) => {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag) return
    // Grabbed and let go without moving: carry on to open.
    if (!drag.moved) {
      run(1, SETTLE)
      return
    }
    const travel = travelRef.current
    const speed = releaseSpeed(drag.history, e.timeStamp)

    // Decide from where the flick is heading, not where the finger stopped.
    const offset = (1 - shown.get()) * travel
    const velocity = -speed / travel // handed to the spring so there is no seam
    if (offset + project(speed) > travel / 2) {
      close(velocity)
    } else {
      run(1, { ...(Math.abs(speed) > FLICK ? THROWN : SETTLE), velocity })
    }
  }

  const panelStyle = reduced ? { opacity: shown } : desktop ? { opacity: shown, scale } : { y }

  return (
    <>
      <button type="button" className={className} onClick={openSheet} {...rest}>
        {label}
      </button>

      {mounted && (
        <dialog
          ref={dialogRef}
          aria-labelledby={titleId}
          // React passes these up through the tree, so a sheet opened from inside
          // another sheet would otherwise close that one too.
          onCancel={(e) => {
            e.preventDefault()
            e.stopPropagation()
            close()
          }}
          onClose={(e) => {
            e.stopPropagation()
            setMounted(false)
          }}
          // clip, not hidden: the sheet starts below the screen, and a browser can
          // still scroll a hidden overflow to reach the first focusable control,
          // which would leave the sheet stuck above the top of the screen.
          className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-clip bg-transparent p-0 backdrop:bg-transparent"
        >
          <motion.div aria-hidden="true" className="absolute inset-0 bg-black/35" style={{ opacity: scrim }} onClick={() => close()} />

          <div
            className="pointer-events-none absolute inset-x-0 top-0 flex items-end justify-center md:items-center"
            style={{ bottom: keyboard }}
          >
            <motion.div
              ref={panelRef}
              style={panelStyle}
              className="pointer-events-auto relative flex max-h-[88dvh] w-full flex-col rounded-t-[1.5rem] bg-surface shadow-[0_-8px_40px_rgba(0,0,0,0.16)] after:absolute after:inset-x-0 after:top-full after:h-[100dvh] after:bg-surface md:max-h-[85dvh] md:max-w-lg md:rounded-[1.5rem] md:shadow-[0_24px_70px_rgba(0,0,0,0.28)] md:after:hidden"
            >
              <SheetContext.Provider value={context}>
                <div
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  className="shrink-0 cursor-grab touch-none select-none active:cursor-grabbing md:cursor-auto md:touch-auto"
                >
                  <div aria-hidden="true" className="mx-auto mt-2 h-[5px] w-9 rounded-full bg-muted/40 md:hidden" />
                  <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-2.5 md:pt-4">
                    <h2 id={titleId} className="min-w-0 break-words text-headline text-ink">
                      {title}
                    </h2>
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => close()}
                      className="press -mr-1 inline-flex min-h-11 items-center px-1 text-body font-semibold text-accent md:min-h-9 md:text-sub"
                    >
                      Done
                    </button>
                  </div>
                </div>
                <div className="min-h-0 overflow-y-auto overscroll-contain pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                  {children}
                </div>
              </SheetContext.Provider>
            </motion.div>
          </div>
        </dialog>
      )}
    </>
  )
}
