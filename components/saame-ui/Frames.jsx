"use client"

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
 * is that multiplied by SCALE, so the two can never drift apart.
 */

const SCALE = 1.3
const SCREEN_W = 272
const SCREEN_H = 463
const BORDER = 9

export function PhoneFrame({ children, label }) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        /* Open at the bottom, because the device is meant to run off the
           panel's edge rather than sit complete inside it. A closed frame gets
           cut mid-curve by that clip, which looks like a mistake; an open one
           reads as a crop. */
        className="relative overflow-hidden rounded-t-[3.2rem] border-b-0 border-[#1a1f2c]
        bg-[#1a1f2c] shadow-[0_34px_80px_-22px_rgba(15,23,42,0.45)]"
        style={{
          width: SCREEN_W * SCALE + BORDER * 2,
          height: SCREEN_H * SCALE + BORDER,
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
          style={{ width: SCREEN_W, height: SCREEN_H, zoom: SCALE }}
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

/* `scale` uses zoom for the same reason PhoneFrame does: it re-runs layout, so
   the dashboard's small labels are rasterised at the size they are shown
   instead of being resampled from a composited layer. Callers size the
   container at the pre-zoom width, so rendered width is width x scale. */
export function BrowserFrame({ children, url, label, scale = 1 }) {
  return (
    <div
      className="relative flex w-full flex-col items-center"
      style={scale === 1 ? undefined : { zoom: scale }}
    >
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
      {label && (
        <span className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-ozl-muted">
          {label}
        </span>
      )}
    </div>
  )
}
