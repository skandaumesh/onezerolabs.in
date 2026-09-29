"use client"

import Link from "next/link"
import { motion } from "framer-motion"

/* The hero's arch and the pale band behind it, as ellipse radii (width%
   height% of the hero). Phones are narrow and tall, so the desktop
   percentages drew a thin U there; they get a wider, deeper arch that still
   spans the top edge and reaches down to the eyebrow. */
const ARCH_SIZES = {
  phone: { band: "130% 98%", arch: "80% 74%" },
  wide: { band: "98% 106%", arch: "60% 68%" },
}

/* A smoothstep fall-off from full colour at `from`% to nothing at 100%,
   sampled into gradient stops. Colour stops join in straight lines, so a long
   solid stretch followed by a quick drop leaves a visible crease where the
   slope changes -- that showed as a hard diagonal edge down the side of the
   arch. The eased curve starts and ends flat, so there is no corner for the
   eye to catch. */
const easeOut = (rgb, from, steps = 12) => {
  const stops = [`rgba(${rgb},1) ${from}%`]
  for (let i = 1; i <= steps; i++) {
    const s = i / steps
    const alpha = 1 - (3 * s * s - 2 * s * s * s)
    stops.push(`rgba(${rgb},${alpha.toFixed(3)}) ${(from + (100 - from) * s).toFixed(1)}%`)
  }
  return stops.join(", ")
}

const paleBand = (size) =>
  `radial-gradient(ellipse ${size} at 50% 0%, rgba(176,196,248,1) 0%, ${easeOut("176,196,248", 35)})`

const blueArch = (size) =>
  `radial-gradient(ellipse ${size} at 50% 0%, #1E4ED8 0%, #2459E6 45%, ${easeOut("40,96,234", 55)})`

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
}) {
  return (
    <section
      id="hero"
      className="relative mx-auto w-full overflow-hidden px-4 text-center md:px-8
      flex-1 flex flex-col items-center justify-center
      bg-ozl-base text-ozl-ink pt-24 pb-12 md:pt-28 md:pb-10"
    >
      {/* Colour field: a clean arch hanging from the top edge. Two
          half-ellipses anchored at the top centre -- a wide pale-periwinkle
          one behind, a narrower saturated blue one in front -- so the pale one
          shows as a band that is thick at the sides and thin under the centre.

          Plain gradients, no blur filter: the soft edge comes from the colour
          stops, so the curve stays an exact, even arc instead of a smudge. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Pale band */}
        <div className="absolute inset-0 md:hidden" style={{ background: paleBand(ARCH_SIZES.phone.band) }} />
        <div className="absolute inset-0 hidden md:block" style={{ background: paleBand(ARCH_SIZES.wide.band) }} />

        {/* Blue arch, with a slow, slight breathing. Solid to just over half
            its radius, then an eased fade (see easeOut); it reaches down into
            the headline, with the eyebrow well inside the blue. Sized in % of
            the hero, which works because the content is centred in it. */}
        <motion.div
          animate={{ opacity: [0.94, 1, 0.94] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 md:hidden" style={{ background: blueArch(ARCH_SIZES.phone.arch) }} />
          <div className="absolute inset-0 hidden md:block" style={{ background: blueArch(ARCH_SIZES.wide.arch) }} />
        </motion.div>

        {/* Lighter strip along the top edge, under the navbar */}
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)" }}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

        {/* Soft bottom edge transition */}
        <div
          className="absolute inset-x-0 bottom-0 h-36"
          style={{
            background:
              "linear-gradient(to top, #FFFFFF 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Animated Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.15, delayChildren: 0.1 }}
        className="relative z-20 mx-auto flex max-w-4xl flex-col items-center px-1 sm:px-4"
      >
        {/* Eyebrow */}
        {eyebrow && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -12, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.5 }}
            className="mb-4 sm:mb-6 flex w-full max-w-[280px] sm:max-w-[420px] flex-col items-center"
          >
            <span className="h-px w-full bg-white/45" />
            <span className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] sm:tracking-[0.28em] text-white md:text-[12px] whitespace-nowrap">
              {eyebrow}
            </span>
            <span className="h-px w-full bg-white/45" />
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          // Instrument Serif, as in the section headings. It is narrower and
          // lighter than the EB Garamond this used, so it is set larger, and
          // it has one weight -- font-medium would ask for a bold that
          // doesn't exist. Leading is restated at each size: text-5xl and
          // text-6xl carry their own line-height, which would otherwise win.
          className="text-balance text-zinc-950
          text-[40px] leading-[1.04] sm:text-6xl sm:leading-[1.04] md:text-[84px] md:leading-[1.02] tracking-[0.005em]
          font-[family-name:var(--font-instrument-serif)]"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 sm:mt-5 mb-6 sm:mb-8 max-w-2xl text-balance
          text-base sm:text-lg leading-relaxed tracking-tight text-ozl-ink/70 md:text-[1.3rem]"
        >
          {subtitle}
        </motion.p>

        {/* Actions */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
          className="flex w-full max-w-xs sm:max-w-md flex-col items-center justify-center gap-3 sm:flex-row px-2 sm:px-0"
        >
          {primaryAction && (
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href={primaryAction.href}
                className="group relative inline-flex h-11 w-full items-center justify-center rounded-full bg-[#1E293B] px-6 py-2.5 text-sm font-medium text-white border border-white/20 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.35),inset_0_0_10px_rgba(255,255,255,0.1),0_4px_14px_rgba(15,23,42,0.25)] cursor-pointer transition-all duration-200 hover:bg-[#0F172A] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),0_6px_18px_rgba(15,23,42,0.35)]"
              >
                {primaryAction.label}
              </Link>
            </motion.div>
          )}
          {secondaryAction && (
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href={secondaryAction.href}
                className="group relative inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-medium text-ozl-ink border border-black/10 shadow-[inset_0_1.5px_2.5px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.05)] cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-[inset_0_1.5px_3.5px_rgba(0,0,0,0.12),0_4px_10px_rgba(0,0,0,0.08)]"
              >
                {secondaryAction.label}
              </Link>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28
        bg-gradient-to-t from-ozl-base to-transparent"
      />
    </section>
  )
}
