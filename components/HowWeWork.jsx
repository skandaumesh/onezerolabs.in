"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useMotionValueEvent, useTransform, AnimatePresence } from "framer-motion"

const steps = [
  {
    id: "01",
    label: "FULL OWNERSHIP",
    title: "Everything is yours.",
    description:
      "If we ever stop working together, the code, the data, the domain and the accounts go with you. Nothing breaks, nothing is proprietary, and nothing gets held hostage.",
    features: [
      "Source code and repositories transfer to you in full",
      "No proprietary frameworks or vendor lock-in",
      "Documented handover, including infrastructure and accounts",
    ],
  },
  {
    id: "02",
    label: "DIRECT ACCESS",
    title: "You talk to the person building it.",
    description:
      "No account managers, no middle-man handoffs, and no explaining your vision twice. Direct, asynchronous or real-time communication with your lead engineer.",
    features: [
      "You work directly with the engineer writing the code",
      "A shared channel for day-to-day decisions",
      "No account-management layer between you and the work",
    ],
  },
  {
    id: "03",
    label: "POST-LAUNCH",
    title: "We don't disappear after launch.",
    description:
      "Most studios deliver and leave. We stay on for updates, fixes, content, and the ongoing maintenance that keeps your system useful and performing at high speed.",
    features: [
      "Scheduled maintenance, dependency and security updates",
      "Feature development continues after the initial release",
      "Response times defined and agreed in writing",
    ],
  },
  {
    id: "04",
    label: "BUILT TO LAST",
    title: "Built to still work in three years.",
    description:
      "We design the architecture properly before writing code, so adding new features next year doesn't mean rebuilding what you already have.",
    features: [
      "Architecture agreed before implementation begins",
      "Modular, documented code against current standards",
      "New features extend the system rather than replace it",
    ],
  },
]

/* 3D Isometric Stack Visual. One plane per step completed, so the stack builds
   as you scroll -- the visual is the progress indicator. */
const IsometricStack = ({ activeIndex }) => {
  const layerCount = activeIndex + 1

  return (
    <div className="relative flex h-full w-full items-center justify-center py-6 md:py-0">
      {/* Grid plane behind the stack. It was drawing at roughly 0.03 effective
          alpha -- a 0.08 line multiplied by opacity-[0.35] -- which is below
          what renders on a near-white panel. The line now carries its own
          weight and the wrapper opacity is gone, so there is one number
          controlling visibility instead of two fighting.

          The mask is widened too: at black 40% the grid had already faded out
          before it reached the layers it is supposed to sit behind. */}
      <div
        className="pointer-events-none absolute h-[78%] w-[78%]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(14,26,51,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(14,26,51,0.07) 1px, transparent 1px)",
          // The stack is drawn at scale 0.55/0.75 but the grid is not, so a cell
          // that looks fine in isolation is proportionally huge next to the
          // object it sits behind. Sized against the SCALED stack, not the pane.
          backgroundSize: "15px 15px",
          backgroundPosition: "center center",
          maskImage: "radial-gradient(circle at 50% 50%, black 44%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 44%, transparent 78%)",
        }}
      />

      <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-blue-500/14 blur-[70px]" />
      <div className="pointer-events-none absolute h-44 w-44 rounded-full bg-cyan-400/10 blur-[50px]" />

      {/* Scale lives on a plain wrapper, NOT on the animated element. Framer
          writes the whole `transform` property, so a Tailwind `scale-*` class on
          the same node is silently overwritten -- the responsive sizing was
          being discarded. */}
      <div className="relative flex origin-center scale-[0.55] items-center justify-center md:scale-[0.75]">
        <motion.div
          animate={{ y: activeIndex * 12 + 15 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
        >
          <div
            className="relative h-48 w-48"
            style={{
              // Without a perspective the z offsets below collapse and the
              // layers have no depth to separate them.
              perspective: "900px",
              transform: "rotateX(60deg) rotateZ(45deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <AnimatePresence>
              {Array.from({ length: layerCount }).map((_, i) => {
                const isTop = i === layerCount - 1
                return (
                  <motion.div
                    key={`layer-${i}`}
                    initial={{ opacity: 0, y: 110 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={`absolute inset-0 rounded-[2rem] border ${
                      isTop
                        ? "border-blue-400/70 bg-gradient-to-br from-blue-500/20 via-blue-600/13 to-[#0E1A33]/16"
                        : "border-blue-500/35 bg-gradient-to-br from-blue-500/13 via-[#0E1A33]/12 to-[#0E1A33]/[0.05]"
                    }`}
                    style={{
                      // z is fixed per layer, so it is set here rather than
                      // animated -- it never changes, and declaring it in
                      // animate made framer interpolate a constant every frame.
                      translateZ: i * 30,
                      willChange: "transform, opacity",
                      boxShadow: isTop
                        ? "0 0 30px rgba(59,130,246,0.3), 0 0 13px rgba(37,99,235,0.2), inset 0 0 18px rgba(147,197,253,0.26)"
                        : "0 0 18px rgba(59,130,246,0.14), inset 0 0 13px rgba(59,130,246,0.1)",
                    }}
                  >
                    <div
                      className={`absolute inset-0 rounded-[2rem] border-l border-t ${
                        isTop ? "border-blue-200" : "border-blue-400/45"
                      }`}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* One segment per step, filling continuously with the scroll so the section
   reads as moving with you rather than jumping between states. Each segment
   is also a way to jump to its step. */
const StepProgress = ({ progress, activeIndex, onSelect }) => (
  <div className="mb-5 flex gap-1.5 md:mb-6">
    {steps.map((step, i) => (
      <StepSegment
        key={step.id}
        step={step}
        index={i}
        progress={progress}
        active={i === activeIndex}
        onSelect={onSelect}
      />
    ))}
  </div>
)

const StepSegment = ({ step, index, progress, active, onSelect }) => {
  const fill = useTransform(progress, [index / steps.length, (index + 1) / steps.length], [0, 1])
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`Step ${index + 1}: ${step.label.toLowerCase()}`}
      aria-current={active ? "step" : undefined}
      // min-h-0 / min-w-0 opt out of the 44px phone tap-target rule in
      // globals.css, which would turn each segment into a tall box; the
      // button is still 24px tall around the 3px bar.
      className="group relative flex h-6 min-h-0 min-w-0 flex-1 cursor-pointer items-center"
    >
      <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-[#0E1A33]/10 transition-colors group-hover:bg-[#0E1A33]/20">
        <motion.span className="absolute inset-0 origin-left rounded-full bg-[#1E293B]" style={{ scaleX: fill }} />
      </span>
    </button>
  )
}

/* Content pane. Every step is laid out in the same grid cell and only the
   active one is visible, so switching is a crossfade: nothing mounts or
   unmounts mid-scroll, and the pane keeps the height of the longest step --
   before, the height changed with each step and on phones the stack above it
   jumped every time. Opacity and a short rise only; the blur filter this used
   was costly to animate and lagged behind a fast scroll. */
const ContentPane = ({ activeIndex, progress, onSelect }) => {
  return (
    <div className="relative flex h-full w-full flex-col justify-center px-5 py-6 pb-8 md:p-8 lg:p-10">
      <StepProgress progress={progress} activeIndex={activeIndex} onSelect={onSelect} />
      <div className="grid">
        {steps.map((step, i) => {
          const on = i === activeIndex
          return (
            <motion.div
              key={step.id}
              aria-hidden={!on}
              initial={false}
              animate={{ opacity: on ? 1 : 0, y: on ? 0 : i < activeIndex ? -14 : 14 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col [grid-area:1/1] ${on ? "" : "pointer-events-none"}`}
            >
              <span className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E809F] md:text-[11px]">
                {step.id} · {step.label}
              </span>

              <h3 className="mb-5 text-3xl leading-tight tracking-wide text-[#0E1A33] font-[family-name:var(--font-instrument-serif)] sm:text-4xl md:text-[44px]">
                {step.title}
              </h3>

              <p className="mb-6 max-w-md text-[14px] font-light leading-relaxed text-[#33415C] sm:text-[15px] md:text-[16px]">
                {step.description}
              </p>

              {/* Plain markers rather than the icon discs that used to be here --
                  twelve check icons per section was more furniture than the list
                  needed. */}
              <ul className="space-y-2.5">
                {step.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#2563EB]/60"
                    />
                    <span className="text-[13px] font-medium leading-snug text-[#33415C] sm:text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function HowWeWork() {
  const containerRef = useRef(null)
  const [activeTab, setActiveTab] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(Math.max(Math.floor(latest * steps.length), 0), steps.length - 1)
    setActiveTab((prev) => (prev === next ? prev : next))
  })

  // Scroll to the middle of a step's stretch of the section. Through Lenis
  // when it is running (components/SmoothScroll.jsx), so the jump uses the
  // same easing as wheel scrolling instead of fighting it.
  const goToStep = (index) => {
    const el = containerRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const range = el.offsetHeight - window.innerHeight
    const target = top + (range * (index + 0.5)) / steps.length
    if (window.lenis) window.lenis.scrollTo(target, { duration: 1.1 })
    else window.scrollTo({ top: target, behavior: "smooth" })
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-[340vh] w-full"
      style={{
        // Part of one continuous grey band: service cards above, testimonials
        // below. The fade back to white happens at the foot of testimonials.
        background: "#ECEFF4",
      }}
    >
      {/* Content pinned from the top rather than centred. Centring in a full
          screen height left a band of empty space above the heading as the
          section scrolled in -- as tall as half the leftover viewport. The top
          offset clears the fixed navbar while the stage is pinned. */}
      {/* On phones the card grows to fill the pinned screen (the max-md:
          classes below), rather than stopping at its content height and
          leaving an empty band under it. `svh` is the screen height with the
          browser's toolbars showing, so the foot of the card isn't hidden
          behind them. */}
      <div className="sticky top-0 flex h-svh w-full flex-col items-center justify-start overflow-hidden pt-24 md:pt-28">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 max-md:flex max-md:min-h-0 max-md:flex-1 max-md:flex-col max-md:pb-6">
          {/* Header */}
          <div className="mb-6 text-center md:mb-10">
            <h2 className="ozl-heading-fade text-3xl leading-[1.1] tracking-wide font-[family-name:var(--font-instrument-serif)] sm:text-5xl md:text-6xl">
              How we <span className="italic">work.</span>
            </h2>
          </div>

          {/* Main Stage Card -- the same glass as the service cards above:
              a translucent frame that is the only element blurring what is
              behind it, holding a translucent white panel. Frame padding and
              the radius step match theirs (6px / 8px), so the two sections
              read as one set of cards. */}
          <div
            // min-h-0 lets the card shrink to the screen on short phones; by
            // default a flex item won't go below its content's height, and
            // the stack's unscaled layout box (192px, drawn at 0.55) props
            // that up well past what is visible.
            className="relative mx-auto w-full max-w-[1000px] rounded-[32px] p-1.5 sm:rounded-[3rem] sm:p-2 max-md:flex max-md:min-h-0 max-md:flex-1 max-md:flex-col"
            // No backdrop-filter: this card is pinned while the section scrolls
            // behind it, so a blur has to be recomputed every frame -- the
            // main cost of scrolling here on phones -- and over the flat grey
            // band it made no visible difference.
            style={{
              background: "rgba(255,255,255,0.28)",
              border: "1px solid rgba(255,255,255,0.65)",
              boxShadow: ["0 12px 28px -14px rgba(51,65,85,0.18)", "inset 0 1px 0 rgba(255,255,255,0.9)"].join(", "),
            }}
          >
            <div
              className="relative flex h-auto min-h-[420px] w-full flex-col overflow-hidden rounded-[26px] sm:rounded-[2.5rem] md:h-[440px] md:flex-row max-md:flex-1"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.22) 100%)",
                border: "1px solid rgba(255,255,255,0.85)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,1)",
              }}
            >
              {/* Left: 3D Visual */}
              {/* On phones this is the part that takes up the extra height --
                  and the part that gives it back on short screens, down to
                  100px, so the text below still fits the pinned screen. */}
              <div className="relative z-10 flex h-auto min-h-[100px] w-full items-center justify-center overflow-visible md:min-h-0 md:w-[42%] max-md:flex-1">
                <IsometricStack activeIndex={activeTab} />
              </div>

              {/* Right: Content */}
              <div className="relative z-10 w-full md:w-[58%]">
                <ContentPane activeIndex={activeTab} progress={scrollYProgress} onSelect={goToStep} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
