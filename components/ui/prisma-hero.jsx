"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { WordsPullUp } from "@/components/ui/words-pull-up"

/**
 * Full-bleed video hero: a looping background clip with a wordmark set at
 * viewport scale across the foot of the frame, copy and a CTA beside it.
 *
 * Converted from the upstream .tsx -- this project has no tsconfig.json, so a
 * .tsx here would not be type-checked by anything.
 *
 * WordsPullUp is imported rather than redeclared. The upstream file ships its
 * own copy inline; keeping two definitions of the same reveal in one codebase
 * means fixing every bug twice.
 *
 * COLOUR: the original uses `bg-primary` / `text-primary` for the cream. That
 * token is blue in this project (--primary: 217 91% 60%), so the button and copy
 * would come out blue on a dusk-lit photograph. The cream is set explicitly
 * instead, which is what the reference actually renders.
 */

const CREAM = "#E1E0CC"

export function PrismaHero({
  wordmark = "Prisma",
  showAsterisk = true,
  navItems = ["Our story", "Collective", "Workshops", "Programs", "Inquiries"],
  blurb = "Prisma is a worldwide network of visual artists, filmmakers and storytellers bound not by place, status or labels but by passion and hunger to unlock potential through our unique perspectives.",
  ctaLabel = "Join the lab",
  ctaHref = "#",
  videoSrc = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4",
  posterSrc,
}) {
  return (
    <section className="h-screen w-full">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        {/* autoPlay needs muted to be allowed to start, and playsInline stops
            iOS taking the video fullscreen. */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={posterSrc}
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
        />

        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />

        {/* Darkens top and bottom so the nav and the wordmark hold against
            whatever frame the loop happens to be on. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        <nav className="absolute left-1/2 top-24 z-20 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-b-2xl bg-black px-4 py-2 sm:gap-6 md:gap-12 md:rounded-b-3xl md:px-8 lg:gap-14">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-[10px] text-[#E1E0CC]/80 transition-colors hover:text-[#E1E0CC] sm:text-xs md:text-sm"
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-2 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 items-end gap-4">
            <div className="col-span-12 lg:col-span-8">
              {/* Sized in vw, so the wordmark spans the frame at every width
                  rather than stepping between fixed breakpoint sizes. */}
              <h1
                className="font-medium leading-[0.85] tracking-[-0.07em] text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]"
                style={{ color: CREAM }}
              >
                <WordsPullUp text={wordmark} showAsterisk={showAsterisk} rise={20} trigger="mount" />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-5 pb-6 lg:col-span-4 lg:pb-10">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs sm:text-sm md:text-base"
                style={{ lineHeight: 1.2, color: "rgba(225, 224, 204, 0.7)" }}
              >
                {blurb}
              </motion.p>

              <motion.a
                href={ctaHref}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group inline-flex items-center gap-2 self-start rounded-full py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
                style={{ backgroundColor: CREAM }}
              >
                {ctaLabel}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight className="h-4 w-4" style={{ color: CREAM }} />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
