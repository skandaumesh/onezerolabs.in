"use client"

/* Shared pieces for the inner pages, so they speak the homepage's language:
   a white page, a soft grey band behind card sections, glass cards, serif
   headings with the ink-to-slate fade, and the hero's two pill buttons.

   The values are the homepage's own (DoorsSection, WhyUs, hero-1). Those
   sections keep their inline copies; these are for every other page. */

export const HEADING =
  "ozl-heading-fade font-[family-name:var(--font-instrument-serif)] tracking-wide leading-[1.1]"

export const EYEBROW =
  "block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E809F] md:text-[11px]"

// Text on white or grey: ink for titles, slate for body copy, muted for asides.
export const INK = "text-[#0E1A33]"
export const BODY = "text-[#33415C]"
export const MUTED = "text-[#6E809F]"

export const BTN_PRIMARY =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-[#1E293B] px-6 text-sm font-medium text-white shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.35),inset_0_0_10px_rgba(255,255,255,0.1),0_4px_14px_rgba(15,23,42,0.25)] transition-all duration-200 hover:bg-[#0F172A] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),0_6px_18px_rgba(15,23,42,0.35)] disabled:cursor-not-allowed disabled:opacity-50 [touch-action:manipulation]"

export const BTN_SECONDARY =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 text-sm font-medium text-ozl-ink shadow-[inset_0_1.5px_2.5px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.05)] transition-all duration-200 hover:bg-gray-50 hover:shadow-[inset_0_1.5px_3.5px_rgba(0,0,0,0.12),0_4px_10px_rgba(0,0,0,0.08)] disabled:cursor-not-allowed disabled:opacity-50 [touch-action:manipulation]"

/* Section background. "grey" is the band the homepage sets its card sections
   on; fadeTop / fadeBottom blend it into a white neighbour instead of meeting
   it at a hard edge. */
export function Band({
  as: Tag = "section",
  tone = "white",
  fadeTop = false,
  fadeBottom = false,
  className = "",
  style,
  children,
  ...rest
}) {
  let background = "#FFFFFF"
  if (tone === "grey") {
    const top = fadeTop ? "#FFFFFF 0px, #ECEFF4 140px" : "#ECEFF4 0px"
    const bottom = fadeBottom ? "#ECEFF4 calc(100% - 140px), #FFFFFF 100%" : "#ECEFF4 100%"
    background = `linear-gradient(180deg, ${top}, ${bottom})`
  }
  return (
    <Tag className={`relative w-full ${className}`} style={{ background, ...style }} {...rest}>
      {children}
    </Tag>
  )
}

/* A translucent frame holding a translucent white panel, as on the homepage's
   service and why-us cards. Meant for the grey band; on white it reads as a
   soft white card. `interactive` adds the hover lift and the light sweep.

   The frame is a plain element, so its hover lift is a CSS transform. Put
   entrance animations on a motion wrapper around it, not on the card itself:
   framer owns the transform of anything it animates. */
export function GlassCard({
  as: Tag = "div",
  interactive = false,
  className = "",
  innerClassName = "",
  children,
  ...rest
}) {
  return (
    <Tag
      className={`group relative block rounded-[32px] border border-white/65 bg-white/[0.28] p-1.5 shadow-[0_12px_28px_-14px_rgba(51,65,85,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] sm:rounded-[34px] sm:p-2 ${
        interactive
          ? "transition-[box-shadow,border-color,transform] duration-500 ease-ozl hover:-translate-y-1 hover:border-white hover:shadow-[0_24px_44px_-18px_rgba(51,65,85,0.28),inset_0_1px_0_rgba(255,255,255,1)]"
          : ""
      } ${className}`}
      {...rest}
    >
      <div className="relative h-full overflow-hidden rounded-[26px] border border-white/85 bg-[linear-gradient(145deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.22)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
        {interactive && (
          // Parked off the left edge; the transition only runs while
          // hovered, so it sweeps in and snaps back unseen on the way out.
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-0 w-[45%] -translate-x-[160%] skew-x-[-18deg] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.75)_50%,rgba(255,255,255,0)_100%)] group-hover:translate-x-[330%] group-hover:transition-transform group-hover:duration-1000 group-hover:ease-out motion-reduce:hidden"
          />
        )}
        <div className={`relative z-10 h-full ${innerClassName}`}>{children}</div>
      </div>
    </Tag>
  )
}

/* Hero for the inner pages: the sky from the homepage's SAAME stage, in the
   same glass frame, with the page's name set in white over the blue. */
export function SkyHero({ eyebrow, title, children, className = "" }) {
  return (
    <section className={`relative w-full px-3 pb-6 pt-24 sm:px-6 md:px-8 md:pb-10 md:pt-28 ${className}`}>
      <div className="mx-auto w-full max-w-[1240px] rounded-[28px] border border-white/60 bg-white/[0.26] p-1.5 shadow-[0_20px_56px_-28px_rgba(15,23,42,0.22),inset_0_1px_0_0_rgba(255,255,255,0.95)] sm:rounded-[32px] sm:p-2">
        {/* Phones pin the words near the top: the frame is taller than it
            is wide there, so the whole picture shows top to bottom and a
            centred title sat on the bright peaks and sun. Up top it's on
            the blue. */}
        <div
          className="relative flex min-h-[380px] flex-col items-center justify-start overflow-hidden rounded-[22px] bg-cover px-6 pb-16 pt-10 text-center sm:rounded-[26px] md:min-h-[54vh] md:justify-center md:pb-24 md:pt-12"
          style={{ backgroundImage: "url('/sky-hero.jpg')", backgroundPosition: "center 30%" }}
        >
          {/* Soft inner glow, as on the SAAME frame. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),inset_0_0_60px_8px_rgba(255,255,255,0.35)]"
          />
          <div className="relative z-10 flex max-w-4xl flex-col items-center">
            {eyebrow && (
              <div className="mb-5 flex w-full max-w-[280px] flex-col items-center sm:mb-7 sm:max-w-[380px]">
                <span className="h-px w-full bg-white/50" />
                <span className="whitespace-nowrap px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.28em] text-white sm:text-[11px]">
                  {eyebrow}
                </span>
                <span className="h-px w-full bg-white/50" />
              </div>
            )}
            <h1
              className="text-balance font-[family-name:var(--font-instrument-serif)] text-5xl leading-[1.05] tracking-wide text-white md:text-6xl lg:text-[5.5rem]"
              style={{ textShadow: "0 2px 28px rgba(12,40,90,0.28)" }}
            >
              {title}
            </h1>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
