"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

// Before paint in the browser, so the console never shows at the wrong size.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

/**
 * Device shells for the SAAME screens.
 *
 * The screens inside are laid out at their display size rather than being
 * designed at phone resolution and scaled down with a transform. Scaling was
 * what made the old screenshots soft: a 1080px capture resampled into a 300px
 * frame lands on fractional pixels, and at the 1.25 device pixel ratio most
 * Windows laptops run, nothing lines up. Text drawn by the browser at the size
 * it is displayed stays sharp at any ratio.
 *
 * The device is enlarged with `zoom` rather than `transform: scale`. Both make
 * it bigger, but zoom re-runs layout at the new size, so glyphs are rasterised
 * at the size they are shown; a transform hands the browser a composited layer
 * to resample, which is the same softness the screenshots had, and it shows up
 * worst mid-animation. The screens are still authored at 272x463 and the frame
 * is that multiplied by the zoom, so the two can never drift apart.
 */

const SCREEN_W = 272
const SCREEN_H = 463
const BORDER = 9

/* The phone's zoom, from a CSS variable so it can change by breakpoint:
   0.98 on phones -- about 285px wide, which leaves the stage its padding even
   on a 360px screen -- and 1.3 from sm up. */
const PHONE_ZOOM = "[--phone-zoom:0.98] sm:[--phone-zoom:1.3]"

export function PhoneFrame({ children, label }) {
  return (
    <div className={`relative flex flex-col items-center ${PHONE_ZOOM}`}>
      <div
        /* Open at the bottom, because the device is meant to run off the
           panel's edge rather than sit complete inside it. A closed frame gets
           cut mid-curve by that clip, which looks like a mistake; an open one
           reads as a crop. */
        className="relative overflow-hidden rounded-t-[2.6rem] border-b-0 border-[#1a1f2c]
        bg-[#1a1f2c] shadow-[0_34px_80px_-22px_rgba(15,23,42,0.45)] sm:rounded-t-[3.2rem]"
        style={{
          width: `calc(${SCREEN_W}px * var(--phone-zoom) + ${BORDER * 2}px)`,
          height: `calc(${SCREEN_H}px * var(--phone-zoom) + ${BORDER}px)`,
          borderWidth: BORDER,
          borderBottomWidth: 0,
        }}
      >
        {/* Dynamic island */}
        <div className="pointer-events-none absolute left-1/2 top-[10px] z-30 flex h-[19px] w-[96px] -translate-x-1/2 items-center justify-end rounded-full bg-black px-2.5">
          <div className="h-[9px] w-[9px] rounded-full bg-[#0a0d14]" />
        </div>
        <div
          className="overflow-hidden rounded-t-[2.1rem]"
          style={{ width: SCREEN_W, height: SCREEN_H, zoom: "var(--phone-zoom)" }}
        >
          {children}
        </div>
      </div>
      {label && (
        <span className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-ozl-muted">
          {label}
        </span>
      )}
    </div>
  )
}

/* The browser is laid out at a fixed `designWidth` and zoomed to fit the room
   it's given, up to `scale`. Narrow screens get the same console, smaller,
   instead of the dashboard reflowing into a phone-width window where its
   stat labels and charts were cut off. Zoom rather than a transform, for the
   same sharpness reason as the phone. */
export function BrowserFrame({ children, url, label, scale = 1, designWidth = 528 }) {
  const boxRef = useRef(null)
  const [zoom, setZoom] = useState(scale)

  useIsoLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const fit = () => {
      const next = Math.min(scale, box.clientWidth / designWidth)
      setZoom((prev) => (Math.abs(prev - next) < 0.001 ? prev : next))
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(box)
    return () => observer.disconnect()
  }, [scale, designWidth])

  return (
    <div ref={boxRef} className="relative flex w-full flex-col items-center">
      <div style={{ width: designWidth, zoom }}>
        <div
          className="w-full overflow-hidden rounded-t-xl border border-b-0 border-slate-300/90 bg-white
          shadow-[0_34px_80px_-22px_rgba(15,23,42,0.36)]"
        >
          <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-3.5 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 truncate font-mono text-[11px] text-slate-500">{url}</span>
          </div>
          {children}
        </div>
      </div>
      {label && (
        <span className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-ozl-muted">
          {label}
        </span>
      )}
    </div>
  )
}
