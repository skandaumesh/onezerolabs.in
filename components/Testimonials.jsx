"use client"

import { MotionConfig, motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import Image from "next/image"

/* What clients say, between Why Us and the FAQ.

   One row of glass cards drifting left in an endless loop: the client at the
   top, the full quote, the person at the foot. The row stops under the mouse,
   follows a finger on touch screens, and has a pause button for keyboards.
   Quotes are the clients' own words, kept verbatim. */

const testimonials = [
  {
    company: "Praasa Consultancy",
    sector: "Research consultancy",
    logo: { src: "/clients/svg/praasa.svg", w: 935, h: 840 },
    quote:
      "Collaborating with One Zero Labs to build the Praasa Consultancy website was a phenomenal experience. They translated our mission into a professional, user-friendly platform where researchers can easily access our services. Skanda's technical expertise and attention to detail ensured every feature works flawlessly. The communication was prompt and transparent throughout. I highly recommend them to anyone looking for a talented team that brings a vision to life.",
    author: "Dr. Sandesh Bhat",
    role: "Founder, Praasa Consultancy",
    image: "/testimonials/praasa.webp",
  },
  {
    company: "MLA Academy of Higher Learning",
    sector: "Higher education · Bengaluru",
    logo: { src: "/clients/svg/mla.svg", w: 1077, h: 1053 },
    quote:
      "The AI-Powered Academic Management Platform developed by OneZeroLabs has brought a remarkable improvement in the way attendance is managed within the department and the institution. The system is simple, efficient, and well-designed to meet the practical needs of faculty members. It has helped reduce manual effort, improved accuracy in attendance tracking, and made the overall process much more organized and reliable.",
    author: "Ms. Kamala S",
    role: "HOD & Assistant Professor, Dept. of Computer Applications",
    image: "/testimonials/kamala.webp",
  },
  {
    company: "Vetaas Education Foundation",
    sector: "Education partner",
    logo: { src: "/clients/svg/vetaas.svg", w: 808, h: 860 },
    quote:
      "ONEZEROLABS brings a refreshing blend of technical expertise and problem-solving mindset. Their team is proactive, responsive, and genuinely invested in building solutions that work in real environments. Their ability to translate complex requirements into intuitive, scalable systems is truly commendable. It's exciting to see young innovators building technology with such clarity, purpose, and a deep understanding of what institutions actually need.",
    author: "Kirti Krishna Ratnoo",
    role: "Founder, Vetaas Education Foundation",
    image: "/testimonials/kirti.webp",
  },
  {
    company: "VAAYU Chest & Sleep Specialists",
    sector: "Healthcare · Bengaluru",
    logo: { src: "/clients/svg/vaayu.svg", w: 1125, h: 1105 },
    quote:
      "OneZero labs is run by 2 very young and enthusiastic people. Skanda and Tanisha. We've worked with them for a few of our projects related to website design, app building, payment solutions and social media management and data analytics and we are nothing but praise. Skanda's proactive approach and out of the box solutions to make life easier in the long term are much appreciated and we keep coming back for any of our tech needs.",
    author: "Dr. Sameer Bansal",
    role: "Senior Consultant & Clinical Head, VAAYU Chest & Sleep Specialists",
    image: "/testimonials/sameer.webp",
  },
]

const EASE = [0.22, 1, 0.36, 1]

// Sets of cards in the track. The loop slides by one set, so the sets after
// the first have to cover the widest screen: two more is ~3,300px.
const COPIES = 3

// Drift in px per second. Slower on phones, where one card fills the screen
// and has to stay on it long enough to be read.
const SPEED = 30
const SPEED_PHONE = 22

// How long the row waits after a finger lets go before drifting again.
const TOUCH_HOLD_MS = 2500

function TestimonialCard({ t }) {
  return (
    // The lift goes through framer: a hover translate class would be
    // overwritten by framer's own transform on this element.
    <motion.figure
      whileHover={{ y: -4, transition: { duration: 0.35, ease: EASE } }}
      className="group h-full rounded-[28px] border border-white/65 bg-white/[0.28] p-1.5 shadow-[0_10px_24px_-14px_rgba(51,65,85,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] transition-[box-shadow,border-color] duration-500 ease-ozl hover:border-white hover:shadow-[0_20px_38px_-18px_rgba(51,65,85,0.26),inset_0_1px_0_rgba(255,255,255,1)]"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[22px] border border-white/85 bg-[linear-gradient(145deg,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0.32)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,1)] sm:p-6">
        {/* Light sweep on hover, as on the service and Why Us cards. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[45%] -translate-x-[160%] skew-x-[-18deg] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.75)_50%,rgba(255,255,255,0)_100%)] group-hover:translate-x-[330%] group-hover:transition-transform group-hover:duration-1000 group-hover:ease-out motion-reduce:hidden"
        />

        <div className="relative flex h-full flex-col">
          {/* Client */}
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white bg-white shadow-[0_6px_16px_-10px_rgba(15,23,42,0.3)]">
              <img
                src={t.logo.src}
                alt={`${t.company} logo`}
                width={t.logo.w}
                height={t.logo.h}
                className="h-8 w-auto"
                draggable={false}
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[14.5px] font-semibold tracking-tight text-[#0E1A33]">
                {t.company}
              </span>
              <span className="block text-[12px] text-[#6E809F]">{t.sector}</span>
            </span>
          </div>

          <blockquote className="mb-5 mt-4 text-[14.5px] leading-[1.65] text-[#33415C]">
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          {/* Person. Tall enough for a two-line role, so the divider sits at
              the same height on every card in the row. */}
          <figcaption className="mt-auto flex min-h-[71px] items-center gap-3 border-t border-[#0E1A33]/[0.07] pt-4">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-[0_4px_12px_-6px_rgba(15,23,42,0.4)]">
              <Image
                src={t.image}
                alt={t.author}
                fill
                sizes="44px"
                className="object-cover"
                draggable={false}
              />
            </span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-medium text-[#0E1A33]">{t.author}</span>
              <span className="block text-[12px] leading-snug text-[#6E809F]">{t.role}</span>
            </span>
          </figcaption>
        </div>
      </div>
    </motion.figure>
  )
}

export default function Testimonials() {
  const reduceMotion = useReducedMotion()
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  // The drift runs from requestAnimationFrame rather than a CSS keyframe so
  // the row can follow a finger and so each frame lands on a whole device
  // pixel: a row parked between pixels (wherever hover happens to stop it)
  // renders its text and photos soft.
  useEffect(() => {
    if (reduceMotion) return
    const viewport = viewportRef.current
    const track = trackRef.current

    let offset = 0 // how far the row has drifted into the first set, px
    let period = 0 // width of one set, trailing margin included
    let last = 0
    let raf = 0
    let hovered = false
    let drag = null // a finger on the row: { id, x, from }
    let holdUntil = 0

    const paint = () => {
      if (!period) return
      offset = ((offset % period) + period) % period
      const dpr = window.devicePixelRatio || 1
      track.style.transform = `translate3d(${-Math.round(offset * dpr) / dpr}px, 0, 0)`
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      // Capped so the first frame after a stall doesn't jump the row.
      const dt = last ? Math.min(now - last, 50) / 1000 : 0
      last = now
      if (pausedRef.current || hovered || drag || now < holdUntil) return
      offset += (window.innerWidth < 640 ? SPEED_PHONE : SPEED) * dt
      paint()
    }
    const start = () => {
      if (raf) return
      last = 0
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const resize = new ResizeObserver(() => {
      period = track.offsetWidth / COPIES
      paint()
    })
    resize.observe(track)
    // Only drift while the row is on screen.
    const onScreen = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop()
    )
    onScreen.observe(viewport)

    const onEnter = (e) => {
      if (e.pointerType === "mouse") hovered = true
    }
    const onLeave = (e) => {
      if (e.pointerType === "mouse") hovered = false
    }
    // Touch drags the row, so a quote that drifted off can be pulled back.
    // touch-pan-y on the viewport leaves vertical swipes to the page.
    const onDown = (e) => {
      if (e.pointerType === "mouse") return
      drag = { id: e.pointerId, x: e.clientX, from: offset }
    }
    const onMove = (e) => {
      if (drag?.id !== e.pointerId) return
      offset = drag.from - (e.clientX - drag.x)
      paint()
    }
    const onUp = (e) => {
      if (drag?.id !== e.pointerId) return
      drag = null
      holdUntil = performance.now() + TOUCH_HOLD_MS
    }

    viewport.addEventListener("pointerenter", onEnter)
    viewport.addEventListener("pointerleave", onLeave)
    viewport.addEventListener("pointerdown", onDown)
    viewport.addEventListener("pointermove", onMove)
    viewport.addEventListener("pointerup", onUp)
    viewport.addEventListener("pointercancel", onUp)
    return () => {
      stop()
      resize.disconnect()
      onScreen.disconnect()
      viewport.removeEventListener("pointerenter", onEnter)
      viewport.removeEventListener("pointerleave", onLeave)
      viewport.removeEventListener("pointerdown", onDown)
      viewport.removeEventListener("pointermove", onMove)
      viewport.removeEventListener("pointerup", onUp)
      viewport.removeEventListener("pointercancel", onUp)
      track.style.transform = ""
    }
  }, [reduceMotion])

  return (
    <section
      className="relative w-full py-12 text-ozl-ink md:py-20"
      style={{
        // End of the grey band that starts at the service cards: grey from the
        // top, fading to white at the foot to meet the white section below.
        background: "linear-gradient(180deg, #ECEFF4 0%, #ECEFF4 calc(100% - 140px), #FFFFFF 100%)",
      }}
    >
      <MotionConfig reducedMotion="user">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-2 w-full max-w-[1150px] px-4 text-center md:mb-6 md:px-8"
        >
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.4em] text-ozl-muted sm:mb-4">
            Testimonials
          </span>
          <h2 className="ozl-heading-fade text-3xl leading-[1.1] tracking-wide font-[family-name:var(--font-instrument-serif)] md:text-5xl lg:text-6xl">
            What our clients <span className="italic">say.</span>
          </h2>
        </motion.div>

        {/* The row fades in as a whole; per-card entrances would replay on
            each copy as it drifts into view. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          {/* Vertical padding keeps the hover lift and shadows clear of the
              clip; the mask fades cards in and out at the screen edges. */}
          <div
            ref={viewportRef}
            className={`touch-pan-y px-4 py-6 [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] md:px-8 ${
              reduceMotion ? "overflow-x-auto" : "overflow-hidden"
            }`}
          >
            {/* Cards are spaced by a right margin, not a gap, so one set's
                width (track / COPIES) includes the space after its last card
                and the loop joins without a seam. Stretched to the tallest
                card so every footer sits on the same line. */}
            <div ref={trackRef} className="flex w-max items-stretch">
              {Array.from({ length: reduceMotion ? 1 : COPIES }, (_, copy) =>
                testimonials.map((t) => (
                  <div
                    key={`${copy}-${t.company}`}
                    aria-hidden={copy > 0 || undefined}
                    className="mr-4 w-[300px] shrink-0 sm:w-[360px] lg:mr-5 lg:w-[400px]"
                  >
                    <TestimonialCard t={t} />
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {!reduceMotion && (
          <div className="mt-1 flex justify-center">
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? "Play testimonials" : "Pause testimonials"}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/80 bg-white/50 text-[#42557A] shadow-[0_6px_16px_-10px_rgba(15,23,42,0.3)] transition-colors hover:text-ozl-violet"
            >
              {paused ? <Play size={14} strokeWidth={2.2} /> : <Pause size={14} strokeWidth={2.2} />}
            </button>
          </div>
        )}
      </MotionConfig>
    </section>
  )
}
