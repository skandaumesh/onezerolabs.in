'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check } from 'lucide-react'

const SHOWN_FOR = 2400 // ms
const SLIDE = { type: 'spring', visualDuration: 0.35, bounce: 0 }
const FADE = { duration: 0.2, ease: 'linear' }

let publish = null
let nextId = 0

/**
 * Says something worked, in a small pill that slides down from the top and goes by
 * itself, like the ones iPhone shows for "Copied". It never needs an answer, so it
 * is only for news. Anything that needs a decision or reading properly is an Alert.
 *
 * It does not announce itself to screen readers, because a banner over an open sheet
 * sits outside the part of the page they can reach. Callers keep a role="status" line.
 */
export const showBanner = (text) => {
  publish?.({ id: ++nextId, text })
  navigator.vibrate?.(10) // Android only; iPhones do not allow it
}

function Pill({ id, text, onDone }) {
  const popoverRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    // A popover joins the top layer, so it shows above an open sheet. If it is already
    // open, or the browser has no popovers, the fixed position below still holds.
    try {
      popoverRef.current.showPopover()
    } catch {}
    const timer = setTimeout(() => onDone(id), SHOWN_FOR)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hidden = reduced ? { opacity: 0 } : { opacity: 0, y: -72 }

  return (
    <div
      ref={popoverRef}
      popover="manual"
      className="fixed inset-x-0 bottom-auto top-[max(0.75rem,env(safe-area-inset-top))] z-50 m-0 mx-auto h-fit w-fit max-w-[calc(100vw-2rem)] overflow-visible border-0 bg-transparent p-0"
    >
      <motion.div
        initial={hidden}
        animate={{ opacity: 1, y: 0 }}
        exit={hidden}
        transition={reduced ? FADE : SLIDE}
        drag={reduced ? false : 'y'}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 1, bottom: 0.08 }}
        onDragEnd={(_, info) => {
          if (info.offset.y < -16 || info.velocity.y < -200) onDone(id)
        }}
        onClick={() => onDone(id)}
        className="glass dock flex min-h-11 cursor-pointer touch-none select-none items-center gap-2 rounded-full py-2 pl-3.5 pr-[1.125rem] text-sub font-medium text-ink"
      >
        <Check size={17} strokeWidth={2.75} className="shrink-0 text-good" aria-hidden="true" />
        <span className="min-w-0 break-words">{text}</span>
      </motion.div>
    </div>
  )
}

/** Mounted once, in the hub layout. */
export function Banners() {
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    publish = setCurrent
    return () => {
      publish = null
    }
  }, [])

  // By id, so an older banner's timer cannot take away the one that replaced it.
  const done = (id) => setCurrent((shown) => (shown?.id === id ? null : shown))

  return <AnimatePresence>{current && <Pill key={current.id} {...current} onDone={done} />}</AnimatePresence>
}
