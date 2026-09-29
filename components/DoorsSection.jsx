"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { doors } from "@/data/doorsData"
import DoorIllustration from "@/components/DoorIllustrations"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function DoorsSection() {
  return (
    <section
      id="services"
      className="relative w-full pt-14 pb-6 md:pt-20 md:pb-6 text-ozl-ink overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #ECEFF4 9%, #ECEFF4 100%)",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6 text-center md:mb-8">
          <h2 className="ozl-heading-fade text-3xl sm:text-5xl md:text-6xl leading-[1.1] tracking-wide font-[family-name:var(--font-instrument-serif)]">
            Three things we do{" "}
            <span className="italic">for you.</span>
          </h2>

          <p className="mx-auto mt-4 sm:mt-6 max-w-md text-sm sm:text-[15px] leading-relaxed font-light text-ozl-muted">
            Start with the one closest to your problem.
          </p>
        </motion.div>

        {/* The three service doors */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7 items-stretch">
          {doors.map((door) => (
            <motion.div
              key={door.href}
              variants={itemVariants}
              className="h-full"
            >
              <Link
                href={door.href}
                className="group relative flex h-full flex-col rounded-[32px] sm:rounded-[34px] p-1.5 sm:p-2
                transition-shadow duration-500 ease-ozl"
                // The frame is the ONLY element with backdrop-filter. A second
                // blur on the panel inside would re-blur already-blurred pixels
                // for no visible gain and double the compositing cost.
                style={{
                  background: "rgba(255,255,255,0.28)",
                  border: "1px solid rgba(255,255,255,0.65)",
                  backdropFilter: "blur(18px) saturate(140%)",
                  WebkitBackdropFilter: "blur(18px) saturate(140%)",
                  boxShadow: ["0 12px 28px -14px rgba(51,65,85,0.18)", "inset 0 1px 0 rgba(255,255,255,0.9)"].join(", "),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = ["0 20px 40px -16px rgba(51,65,85,0.24)", "inset 0 1px 0 rgba(255,255,255,1)"].join(", ")
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = ["0 12px 28px -14px rgba(51,65,85,0.18)", "inset 0 1px 0 rgba(255,255,255,0.9)"].join(", ")
                }}
              >
                <div
                  className="relative flex h-full flex-col overflow-hidden rounded-[26px] p-6 sm:p-7 md:p-8"
                  style={{
                    // Translucent, brighter top-left, so the colour behind
                    // shows through most toward the foot of the card.
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.22) 100%)",
                    border: "1px solid rgba(255,255,255,0.85)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,1)",
                  }}
                >
                {/* Shine: a skewed streak parked off the left edge. The
                    transition is only switched on while hovered, so it sweeps
                    across on the way in and snaps back unseen on the way out --
                    with it always on, the streak would sweep backwards every
                    time the pointer left. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 z-0 w-[45%] -translate-x-[160%] skew-x-[-18deg]
                  group-hover:translate-x-[330%] group-hover:transition-transform group-hover:duration-1000 group-hover:ease-out"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%)",
                  }}
                />
                <div className="relative z-10 flex h-full flex-col">
                  <DoorIllustration id={door.id} />

                  <h3 className="mb-4 text-2xl md:text-3xl leading-tight tracking-wide text-[#0E1A33] font-[family-name:var(--font-instrument-serif)]">
                    {door.label}
                  </h3>

                  <p className="mb-5 text-[15px] leading-relaxed font-light text-[#33415C]">
                    {door.description}
                  </p>

                  <p className="text-[13px] leading-relaxed font-light text-[#6E809F]">
                    {door.audience}
                  </p>

                  <span className="mt-auto pt-6 text-[13px] font-medium tracking-wide text-[#42557A] transition-colors duration-500 group-hover:text-ozl-violet">
                    {door.cta}{" "}
                    <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>


      </motion.div>

      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />
    </section>
  )
}
