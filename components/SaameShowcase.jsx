"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion"
import Link from "next/link"

// The width the console stage is designed and laid out at. Narrower screens
// get the same layout scaled down rather than a reflowed one.
const STAGE_WIDTH = 1240

// Phones lay the stage out narrower: the same 900px console, but only a strip
// of sky either side instead of desktop's wide margins. Shrinking the full
// 1240px into a phone left the console at under a third of its size; dropping
// the margins makes it about 35% larger with nothing inside it lost.
// 918 = 900 console + frame padding and borders at the phone root size.
const STAGE_WIDTH_NARROW = 918
const NARROW_BELOW = 640

// How much of the dashboard window the frame shows; the rest is cut off at
// the bottom. Measured on the window alone, not the sky above it, so the
// amount of sky can change without hiding more of the dashboard.
const CROP_FRACTION = 0.8

// Measure before paint on the client; plain effect on the server, where layout
// effects do nothing but warn.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

// Feather & Heroicons SVGs
const ChevronRight = ({ className = "w-3.5 h-3.5" }) => (
  <svg width="14" height="14" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

const LayoutIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
  </svg>
)

const HomeIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const InboxIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
)

const TableIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ReportsIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const LearnersIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
)

const ModuleIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
)

const CalendarIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const LimitIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5a1.5 1.5 0 113 0m-3 0V11m3-5.5a1.5 1.5 0 113 0V11" />
  </svg>
)

const CheckListIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
)

const ClockIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const StarIcon = ({ className = "w-3.5 h-3.5", filled = false }) => (
  <svg width="14" height="14" className={className} fill={filled ? "#EAB308" : "none"} viewBox="0 0 24 24" stroke={filled ? "#EAB308" : "currentColor"} strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

const MoreIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
)

const GreenRingIcon = () => (
  <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="9" />
  </svg>
)

/* The console's pages, in the order the real product lists them.
   Every figure below is invented. The real dashboard shows the client's
   live totals and the signed-in administrator's own name and email, none of
   which belongs on a public marketing page. The programmes and the class
   ranking are real product behaviour. */
const NAV_PRIMARY = [
  { name: "Dashboard", icon: LayoutIcon },
  { name: "Students", icon: LearnersIcon },
  { name: "Reports", icon: ReportsIcon },
  { name: "View attendance", icon: TableIcon },
  { name: "Promote", icon: HomeIcon },
]

const NAV_SECONDARY = [
  { name: "AI assistant", icon: ModuleIcon },
  { name: "Teachers", icon: LearnersIcon },
  { name: "Parent status", icon: InboxIcon },
  { name: "Announcements", icon: InboxIcon, badge: "3" },
  { name: "Mentors", icon: LearnersIcon },
]

const STATS = [
  { label: "Total students", value: "482", icon: LearnersIcon },
  { label: "Monthly attendance", value: "81%", icon: ReportsIcon },
  { label: "Active streams", value: "5", icon: TableIcon },
  { label: "Student app usage", value: "63%", icon: InboxIcon },
]

const TREND = [62, 74, 58, 80, 71, 66, 84, 77, 69, 88, 73, 79, 64, 82, 70, 86]

const CLASSES = [
  { name: "MCom, Semester 1", sessions: "84 sessions", pct: 94 },
  { name: "MBA, Semester 1", sessions: "126 sessions", pct: 91 },
  { name: "BCA AI & ML, Semester 1", sessions: "210 sessions", pct: 87 },
  { name: "BCom, Semester 3", sessions: "178 sessions", pct: 85 },
  { name: "BBA, Semester 2", sessions: "241 sessions", pct: 82 },
  { name: "BCom, Semester 1", sessions: "302 sessions", pct: 80 },
  { name: "BCA, Semester 5", sessions: "244 sessions", pct: 78 },
  { name: "BBA, Semester 4", sessions: "196 sessions", pct: 76 },
  { name: "BCom A&F, Semester 3", sessions: "168 sessions", pct: 74 },
]

const GRAIN =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.32' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const EASE = [0.22, 1, 0.36, 1]

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/* The console's reveal, played once when the frame scrolls in. The frame
   drives it: every piece below takes the frame's "visible" and waits its own
   delay (passed as `custom`), so the order reads frame, window, sidebar,
   greeting, stats, then the cards under them.

   Opacity and translation only. Scale is off-limits here -- see the note on
   the frame's entrance. */

const frameReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

// The app window rises up through the sky into place.
const windowReveal = {
  hidden: { opacity: 0, y: 90 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE, delay: 0.15 } },
}

const rise = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } }),
}

const slideIn = {
  hidden: { opacity: 0, x: -24 },
  visible: (delay = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE, delay } }),
}

// Chart bars grow from the baseline. Height rather than scaleY, so they are
// laid out at every step and stay sharp.
const bar = {
  hidden: { height: "0%" },
  visible: ({ value, delay }) => ({ height: `${value}%`, transition: { duration: 0.7, ease: EASE, delay } }),
}

/* A figure that counts up from zero once `start` turns true. "81%" counts
   81 and keeps the "%". The count lives in a motion value that framer writes
   straight to the text node, so it doesn't re-render the console each frame.
   The server renders the final figure, and reduced motion keeps it there. */
function CountUp({ value, start, delay = 0 }) {
  const match = /^(\d+)(.*)$/.exec(value)
  const target = match ? Number(match[1]) : 0
  const suffix = match ? match[2] : ""
  const count = useMotionValue(target)
  const text = useTransform(count, (v) => `${Math.round(v)}${suffix}`)
  const reduce = useReducedMotion()

  // Wind back to zero before the first paint; the console is still hidden.
  useIsoLayoutEffect(() => {
    if (match && !reduce) count.set(0)
  }, [])

  useEffect(() => {
    if (!match || !start || reduce) return
    const controls = animate(count, target, { duration: 1.3, ease: EASE, delay })
    return () => controls.stop()
  }, [start])

  if (!match) return value
  return <motion.span>{text}</motion.span>
}

export default function SaameShowcase() {
  const [activeNav, setActiveNav] = useState("Dashboard")
  const [trendRange, setTrendRange] = useState("Month")
  const [ranking, setRanking] = useState("Best")
  const [actionToast, setActionToast] = useState(null)

  // One trigger for the whole console reveal, so the frame, the pieces inside
  // it and the counting figures all start together.
  const frameRef = useRef(null)
  const shown = useInView(frameRef, { once: true, amount: 0.3 })

  // Fit the fixed-width stage to the room available: `width` is the layout
  // width it uses, `scale` shrinks it, and `height` is what it measures once
  // shrunk -- the box around it is set to that, so it takes only the room the
  // stage visibly fills.
  const stageBoxRef = useRef(null)
  const stageRef = useRef(null)
  const [stageFit, setStageFit] = useState({ width: STAGE_WIDTH, scale: 1, height: null })

  // The frame shows the sky plus CROP_FRACTION of the dashboard window.
  // Measured, not fixed: phones run a 14px root size (globals.css), so
  // everything sized in rem -- most of the console -- is shorter there.
  const cropRef = useRef(null)
  const consoleRef = useRef(null)
  const [cropHeight, setCropHeight] = useState(610)

  useIsoLayoutEffect(() => {
    const box = stageBoxRef.current
    const stage = stageRef.current
    if (!box || !stage) return

    const fit = () => {
      const consoleEl = consoleRef.current
      if (consoleEl) {
        // The console wrapper's top padding is the sky; the rest of it is the
        // window. Layout sizes, so the stage's scale transform doesn't enter
        // into it.
        const sky = parseFloat(getComputedStyle(consoleEl).paddingTop)
        const windowHeight = consoleEl.offsetHeight - sky
        const height = Math.round(consoleEl.offsetTop + sky + windowHeight * CROP_FRACTION)
        setCropHeight((prev) => (prev === height ? prev : height))
      }

      const room = box.clientWidth
      const width = room < NARROW_BELOW ? STAGE_WIDTH_NARROW : STAGE_WIDTH
      const scale = Math.min(1, room / width)
      // offsetHeight is the untransformed height, so this stays correct
      // however many times it runs.
      const height = scale < 1 ? stage.offsetHeight * scale : null
      setStageFit((prev) =>
        prev.width === width && prev.scale === scale && Math.abs((prev.height ?? 0) - (height ?? 0)) < 0.5
          ? prev
          : { width, scale, height }
      )
    }

    fit()
    // The box tracks the viewport; the stage itself can change height once
    // the fonts arrive.
    const observer = new ResizeObserver(fit)
    observer.observe(box)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  const triggerToast = (msg) => {
    setActionToast(msg)
    setTimeout(() => setActionToast(null), 2400)
  }

  return (
    <section
      id="saame"
      className="relative w-full overflow-hidden bg-ozl-base px-3 py-10 sm:px-6 md:px-8 md:py-16 text-ozl-ink"
    >
      {/* Reduced motion: movement is dropped and only the fades remain. */}
      <MotionConfig reducedMotion="user">

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ staggerChildren: 0.1 }}
        className="relative z-10 mx-auto w-full max-w-[1700px]"
      >
        {/* Intro Header */}
        <motion.div
          variants={fade}
          // Centred on phones, where it stacks; split heading-left, copy-right
          // once there is room for both on one row.
          className="mx-auto mb-6 flex w-full max-w-6xl flex-col items-center gap-3 text-center md:mb-12 md:flex-row md:items-end md:justify-between md:text-left"
        >
          <div className="max-w-2xl">
            {/* sm:leading-[1.1] restates the line height: sm:text-4xl brings
                its own fixed 2.5rem, which outranked leading-[1.1] from sm up
                and left 56px type on a 40px line -- the "g" hung below the
                box, where the heading fade doesn't paint, and was cut off. */}
            <h2 className="ozl-heading-fade text-3xl leading-[1.1] tracking-tight font-[family-name:var(--font-eb-garamond)] sm:text-4xl sm:leading-[1.1] md:text-[3.5rem]">
              The system a college{" "}
              <span className="italic">runs on.</span>
            </h2>
          </div>
          <p className="max-w-sm text-xs sm:text-[15px] leading-relaxed text-ozl-ink/70">
            Attendance, mentoring, reports and parent notifications in one place, with an
            app each for teaching staff, the office and students.
          </p>
        </motion.div>

        {/* Toast Alert */}
        <AnimatePresence>
          {actionToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-6 right-6 z-50 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-medium text-white shadow-2xl flex items-center gap-2 border border-white/10"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {actionToast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FROSTED GLASS CONSOLE STAGE
            Laid out at a fixed width (STAGE_WIDTH, or STAGE_WIDTH_NARROW on
            phones) and scaled down to whatever room there is, so a phone shows
            the same console as desktop -- sidebar, four stats in a row -- only
            smaller. That is why nothing inside carries sm:/md:/lg: variants:
            they respond to the viewport, not to the stage's own width.

            The scale is a fixed transform, set once per resize, which Chrome
            rasters at the final size. It is never animated -- see the note on
            the entrance below. */}
        {/* The box's height is set to the stage's shrunk height. This used to
            be a negative margin on the stage, which collapsed through to this
            box instead -- the box stayed the stage's full unscaled height, an
            invisible layer over the buttons below it, and on phones "Talk to
            us" couldn't be tapped. */}
        <div
          ref={stageBoxRef}
          className="relative mx-auto w-full max-w-[1240px]"
          style={stageFit.height ? { height: stageFit.height } : undefined}
        >
        <div
          ref={stageRef}
          // Opt out of the phone tap-target rule in globals.css (44px minimum
          // on every button). Here it only stretched the console's small
          // buttons into tall boxes -- the stage is a scaled-down preview.
          className="relative origin-top-left [&_button]:min-h-0 [&_button]:min-w-0"
          style={{
            width: stageFit.width,
            transform: `scale(${stageFit.scale})`,
          }}
        >
        {/* Fade and rise only. This used to tilt in (rotateX) and grow from
            0.95 scale, driven from JS every frame. Chrome reacts to a layer
            whose scale keeps changing by fixing its raster resolution, and it
            never re-rasters afterwards -- the whole console stayed drawn at the
            reduced size and stretched up, so its text was visibly blurry next
            to the sharp heading above it. Translation doesn't touch raster
            scale, so a rise keeps it crisp. */}
        <motion.div
          ref={frameRef}
          variants={frameReveal}
          initial="hidden"
          animate={shown ? "visible" : "hidden"}
          className="relative z-10 mx-auto w-full rounded-[32px] border border-white/60 bg-white/[0.26] p-2 shadow-[0_20px_56px_-28px_rgba(15,23,42,0.22),inset_0_1px_0_0_rgba(255,255,255,0.95),inset_0_0_24px_2px_rgba(255,255,255,0.55)] backdrop-blur-md"
        >
        {/* Cropped at the bottom: the console runs off the frame's lower edge.
            The height is the sky plus CROP_FRACTION of the window -- see cropHeight. */}
        <div
          ref={cropRef}
          className="relative w-full overflow-hidden rounded-[26px] border border-white/45 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.28)]"
          style={{ height: cropHeight }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 rounded-[26px]"
            style={{
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.35), inset 0 0 60px 8px rgba(255,255,255,0.5), inset 0 -30px 60px -30px rgba(255,255,255,0.45)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/productbg.png')" }}
          />
          <div
            aria-hidden
            className="absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(170deg, rgba(255,255,255,0.3) 0%, rgba(246,250,255,0.18) 45%, rgba(236,243,252,0.34) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.06] mix-blend-overlay"
            style={{ backgroundImage: GRAIN, backgroundSize: "240px 240px" }}
          />

          {/* Glow on the field */}
          <motion.div
            aria-hidden
            animate={{ opacity: [0.65, 0.92, 0.65], scale: [1, 1.05, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute left-1/2 top-[34%] z-0 h-[520px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,248,240,0.4) 42%, transparent 72%)",
              filter: "blur(80px)",
            }}
          />

          {/* Console inner wrapper */}
          {/* A deeper band of sky above the console on the narrow phone stage.
              With desktop's side margins gone, the sky is only visible up
              here, so it carries the whole backdrop -- and the window has
              further to rise through it as it reveals. */}
          <div
            ref={consoleRef}
            className={`relative z-10 mx-auto w-full max-w-[900px] px-6 ${
              stageFit.width === STAGE_WIDTH_NARROW ? "pt-64" : "pt-20"
            }`}
          >
          <motion.div variants={windowReveal} className="rounded-t-[22px] border border-b-0 border-white/[0.6] bg-white/[0.2] p-3.5 shadow-[0_10px_34px_-12px_rgba(24,18,30,0.28),0_-2px_40px_-6px_rgba(255,255,255,0.7),inset_0_1px_0_0_rgba(255,255,255,0.85)] backdrop-blur-xl">
          <div className="mb-3.5 flex items-center justify-between px-1 py-0.5">
            {/* Left Header Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/70 px-2.5 py-1 text-xs font-semibold text-neutral-800 shadow-sm backdrop-blur-md">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white shadow-xs">
                  S
                </span>
                <span>SAAME</span>
              </div>

              <button
                onClick={() => triggerToast("Collapsed the navigation")}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/40 backdrop-blur-md border border-white/50 text-neutral-700 hover:bg-white/70 transition-all cursor-pointer"
                title="Sidebar view toggle"
              >
                <LayoutIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Right Action Button */}
            <button
              onClick={() => triggerToast("Building the attendance export...")}
              className="flex items-center gap-1 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-neutral-800 transition-all cursor-pointer active:scale-95"
            >
              Export report
            </button>
          </div>

          {/* MAIN INNER CONTENT SPLIT */}
          <div className="flex flex-row items-stretch gap-5">

            {/* FLOATING LEFT SIDEBAR CARD */}
            <motion.div variants={slideIn} custom={0.4} className="flex w-52 shrink-0 rounded-2xl bg-white/[0.42] backdrop-blur-2xl p-4 shadow-[0_10px_34px_-8px_rgba(24,18,30,0.18)] border border-white/[0.85] ring-1 ring-black/[0.04] flex-col">
              <nav className="space-y-0.5">
                {NAV_PRIMARY.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveNav(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                      activeNav === item.name
                        ? "bg-white/[0.75] text-neutral-900 font-semibold shadow-xs"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 text-neutral-500" />
                      <span>{item.name}</span>
                    </span>
                    {item.badge && (
                      <span className="h-5 min-w-5 px-1.5 rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-600 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}

                <div className="pt-2 mt-2 border-t border-neutral-100">
                  {NAV_SECONDARY.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setActiveNav(item.name)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                        activeNav === item.name
                          ? "bg-white/[0.75] text-neutral-900 font-semibold shadow-xs"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
                    >
                      <item.icon className="w-4 h-4 text-neutral-500" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              </nav>

              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  Quick stats
                </p>
                <div className="space-y-1.5 px-1">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center justify-center">P</span>
                    <span className="text-[11px] font-medium text-neutral-600">128 present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold flex items-center justify-center">A</span>
                    <span className="text-[11px] font-medium text-neutral-600">17 absent</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-2.5 px-1">
                  <span className="h-7 w-7 shrink-0 rounded-full bg-neutral-900 text-[10px] font-bold text-white flex items-center justify-center">
                    OA
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-neutral-800">Office admin</p>
                    <p className="truncate text-[10px] text-neutral-400">Administrator</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FLOATING MAIN CONTENT CARD */}
            <div className="flex-1 min-w-0 rounded-2xl bg-white/[0.52] backdrop-blur-2xl p-6 shadow-[0_10px_34px_-8px_rgba(24,18,30,0.18)] border border-white/[0.85] ring-1 ring-black/[0.04]">
              {/* Greeting */}
              <motion.div variants={rise} custom={0.45} className="flex items-start justify-between pb-4">
                <div>
                  <h3 className="text-3xl font-medium tracking-tight text-neutral-900 font-[family-name:var(--font-eb-garamond)]">
                    Welcome back
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-neutral-400">
                    Tuesday, 22 September 2026
                  </p>
                </div>
                <button
                  onClick={() => triggerToast("Switched the trend to this year")}
                  className="rounded-lg border border-neutral-200/90 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer"
                >
                  This month
                </button>
              </motion.div>

              {/* Stat cards */}
              <div className="grid grid-cols-4 gap-3">
                {STATS.map((s, i) => (
                  <motion.div variants={rise} custom={0.55 + i * 0.08}
                    key={s.label}
                    className="rounded-xl border border-white/[0.9] bg-white/[0.34] ring-1 ring-black/[0.03] backdrop-blur-md p-3.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium leading-tight text-neutral-500 truncate">{s.label}</p>
                        <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900"><CountUp value={s.value} start={shown} delay={0.6 + i * 0.08} /></p>
                      </div>
                      <span className="h-8 w-8 shrink-0 rounded-lg bg-neutral-50 text-neutral-500 flex items-center justify-center">
                        <s.icon className="w-4 h-4" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trend + today */}
              <div className="mt-4 grid grid-cols-12 gap-4 items-start">
                <div className="col-span-8 space-y-4">
                  <motion.div variants={rise} custom={0.8} className="rounded-xl border border-white/[0.9] bg-white/[0.34] ring-1 ring-black/[0.03] backdrop-blur-md p-4 shadow-xs">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-neutral-800">Attendance trend</p>
                      <div className="flex gap-0.5 rounded-lg bg-white/[0.45] p-0.5">
                        {["Week", "Month", "Year"].map((t) => (
                          <button
                            key={t}
                            onClick={() => { setTrendRange(t); triggerToast(`Trend switched to ${t.toLowerCase()}`) }}
                            className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-all cursor-pointer ${
                              trendRange === t ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-800"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex h-36 items-end gap-1.5 border-l border-b border-neutral-100 pl-2 pb-1">
                      {TREND.map((v, i) => (
                        <motion.div
                          key={i}
                          variants={bar}
                          custom={{ value: v, delay: 0.95 + i * 0.035 }}
                          title={`${v}%`}
                          // Opacity only: a transition on height would fight
                          // the grow animation.
                          className={`flex-1 rounded-t-sm transition-opacity hover:opacity-80 ${
                            i % 3 === 1 ? "bg-[#F5C86B]" : "bg-[#F19AA6]"
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Today's overview */}
                  <motion.div variants={rise} custom={1} className="rounded-xl border border-white/[0.9] bg-white/[0.34] ring-1 ring-black/[0.03] backdrop-blur-md p-4 shadow-xs">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-neutral-800">Today&apos;s overview</p>
                      <button
                        onClick={() => triggerToast("Opening every class marked today")}
                        className="text-[11px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                      >
                        View all
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-lg bg-white/[0.45] p-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
                            <ClockIcon className="w-3.5 h-3.5 text-neutral-400" />
                            3 classes marked
                          </span>
                          <span className="text-[11px] font-semibold text-neutral-400">3</span>
                        </div>
                        <p className="mt-1.5 text-[13px] font-semibold text-neutral-800">
                          128 present, 17 absent
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="col-span-4 space-y-3">
                  <motion.div variants={rise} custom={0.9} className="rounded-xl border border-white/[0.9] bg-white/[0.34] ring-1 ring-black/[0.03] backdrop-blur-md p-4 shadow-xs">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-neutral-800">Today</p>
                      <span className="text-[11px] text-neutral-400">3 classes</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 rounded-lg bg-emerald-50 py-2 text-center">
                        <p className="text-xl font-bold leading-none text-emerald-700"><CountUp value="128" start={shown} delay={1} /></p>
                        <p className="mt-1 text-[9px] font-semibold tracking-wide text-emerald-700/70">PRESENT</p>
                      </div>
                      <div className="flex-1 rounded-lg bg-rose-50 py-2 text-center">
                        <p className="text-xl font-bold leading-none text-rose-600"><CountUp value="17" start={shown} delay={1.05} /></p>
                        <p className="mt-1 text-[9px] font-semibold tracking-wide text-rose-600/70">ABSENT</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Class list -- top 3 */}
                  <motion.div variants={rise} custom={1} className="rounded-xl border border-white/[0.9] bg-white/[0.34] ring-1 ring-black/[0.03] backdrop-blur-md p-4 shadow-xs">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-neutral-800">
                        Top classes
                      </p>
                      <div className="flex gap-0.5 rounded-lg bg-white/[0.45] p-0.5">
                        {["Best", "Worst"].map((t) => (
                          <button
                            key={t}
                            onClick={() => { setRanking(t); triggerToast(`Ranking by ${t.toLowerCase()}`) }}
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium transition-all cursor-pointer ${
                              ranking === t ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-800"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {(ranking === "Best" ? CLASSES : [...CLASSES].reverse()).slice(0, 3).map((c, i) => (
                        <div key={c.name} className="flex items-center gap-2">
                          <span className="h-5 w-5 shrink-0 rounded-full bg-amber-50 text-[10px] font-bold text-amber-700 flex items-center justify-center">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-semibold text-neutral-800">{c.name}</p>
                          </div>
                          <span className={`shrink-0 text-[11px] font-bold ${c.pct >= 85 ? "text-emerald-600" : "text-amber-600"}`}>
                            {c.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

          </div>

          </motion.div>
          </div>
          </div>
        </motion.div>
        </div>
        </div>

        {/* Footer Actions */}
        <motion.div variants={fade} className="mx-auto mt-6 sm:mt-12 w-full max-w-6xl md:mt-14">
          <div className="flex flex-col items-center gap-4 border-t border-ozl-glassBorder pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p className="max-w-md text-xs sm:text-[15px] leading-relaxed text-ozl-ink/70">
              This is one screen of the office console. The teacher app, student app
              and rest of the console are on the product page.
            </p>
            <div className="flex shrink-0 gap-2.5">
              <Link
                href="/products/saame"
                className="flex min-h-[40px] sm:min-h-[44px] items-center justify-center gap-2 rounded-full bg-[linear-gradient(to_bottom,#2B3245_0%,#111827_100%)] px-5 text-xs sm:text-sm font-medium text-white shadow-md transition-all hover:brightness-110"
              >
                Explore SAAME
              </Link>
              <Link
                href="/contact"
                className="flex min-h-[40px] sm:min-h-[44px] items-center justify-center rounded-full border border-ozl-glassBorder bg-white px-5 text-xs sm:text-sm font-medium text-ozl-ink transition-all hover:bg-white/90"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </MotionConfig>
    </section>
  )
}
