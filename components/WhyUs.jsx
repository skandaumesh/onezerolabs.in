"use client"

import { MotionConfig, motion } from "framer-motion"

/**
 * Six reasons to work with OneZeroLabs, sitting between How We Work and the
 * testimonials.
 *
 * Cards use the same glass as the service cards and the How We Work stage --
 * translucent frame, translucent white panel -- so the grey band reads as one
 * set. No numbers and no icons: the service cards had their numbering removed,
 * and the titles carry each point on their own.
 */

const POINTS = [
  {
    title: "We build it. We run it.",
    body: "Most studios ship and leave. We stay — maintenance, updates, and support. The systems we build are ones we still run today.",
  },
  {
    title: "Proven in production.",
    body: "SAAME runs a college's attendance and academic operations every working day: 762 students, 38 teachers, 8,582 classes marked.",
  },
  {
    title: "Technology and marketing from one team.",
    body: "The website and the content that fills it come from the same people. No coordinating between a developer and an agency.",
  },
  {
    title: "You work with the people who build it.",
    body: "No account managers. No handoffs. You talk directly to the engineer writing the code.",
  },
  {
    title: "You own what we build.",
    body: "Your code, your data, no platform lock-in and no forced subscriptions.",
  },
  {
    title: "Built for people who aren't technical.",
    body: "Teachers, office staff, parents — the systems we build are used daily by people who never think about the technology.",
  },
]

const EASE = [0.22, 1, 0.36, 1]

const heading = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
}

// Rise, sharpen out of a blur, and settle up to full size. Each card watches the
// viewport itself rather than the whole grid, so on a phone every card reveals
// as it scrolls in instead of all six firing while five are still off screen.
const card = {
  hidden: { opacity: 0, y: 56, scale: 0.94, filter: "blur(10px)" },
  visible: (col) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE, delay: col * 0.12 },
  }),
}

export default function WhyUs() {
  return (
    // Solid grey: part of the band that runs from the service cards down to the
    // testimonials, which does its own fade back to white.
    <section id="why-us" className="relative w-full py-12 text-ozl-ink md:py-20" style={{ background: "#ECEFF4" }}>
      <MotionConfig reducedMotion="user">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <motion.div
          variants={heading}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="mb-8 text-center md:mb-12"
        >
          <h2 className="ozl-heading-fade text-3xl leading-[1.1] tracking-wide font-[family-name:var(--font-instrument-serif)] sm:text-5xl md:text-6xl">
            Why work with <span className="italic">us.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              variants={card}
              custom={i % 3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="h-full"
            >
            <motion.div
              // The lift goes through framer, not a Tailwind hover class: framer
              // owns this element's transform for the entrance animation, so a
              // `hover:-translate-y-*` class here would simply be overwritten.
              whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
              className="group h-full rounded-[32px] border border-white/65 p-1.5 sm:rounded-[34px] sm:p-2
              shadow-[0_12px_28px_-14px_rgba(51,65,85,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]
              transition-[box-shadow,border-color] duration-500 ease-ozl
              hover:border-white hover:shadow-[0_24px_44px_-18px_rgba(51,65,85,0.28),inset_0_1px_0_rgba(255,255,255,1)]"
              style={{ background: "rgba(255,255,255,0.28)" }}
            >
              <div
                className="relative h-full overflow-hidden rounded-[26px] p-6 sm:p-7"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.22) 100%)",
                  border: "1px solid rgba(255,255,255,0.85)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,1)",
                }}
              >
                {/* Same light sweep as the service cards. It only animates on
                    the way in, then snaps back unseen when the pointer leaves. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-[45%] -translate-x-[160%] skew-x-[-18deg]
                  group-hover:translate-x-[330%] group-hover:transition-transform group-hover:duration-1000 group-hover:ease-out
                  motion-reduce:hidden"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%)",
                  }}
                />

                <div className="relative">
                  <h3 className="text-[22px] leading-tight tracking-wide text-[#0E1A33] font-[family-name:var(--font-instrument-serif)] md:text-[24px]">
                    {point.title}
                  </h3>
                  {/* Hairline that draws out and picks up colour on hover. */}
                  <span
                    aria-hidden
                    className="mb-3 mt-3 block h-px w-8 bg-[#0E1A33]/15 transition-all duration-500 ease-ozl
                    group-hover:w-16 group-hover:bg-ozl-violet/60"
                  />
                  <p className="text-[14.5px] font-light leading-relaxed text-[#33415C]">{point.body}</p>
                </div>
              </div>
            </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      </MotionConfig>
    </section>
  )
}
