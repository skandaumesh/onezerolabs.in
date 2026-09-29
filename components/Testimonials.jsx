"use client"

import { MotionConfig, motion } from "framer-motion"
import { useState } from "react"
import Image from "next/image"

/* What clients say, between Why Us and the FAQ.

   Compact glass cards, three across on desktop: the client at the top, the
   quote (first five lines, "Read more" for the rest), the person at the foot.
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
    image: "/praasa.jpeg",
    imagePosition: "50% 20%",
  },
  {
    company: "MLA Academy of Higher Learning",
    sector: "Higher education · Bengaluru",
    logo: { src: "/clients/svg/mla.svg", w: 1077, h: 1053 },
    quote:
      "The AI-Powered Academic Management Platform developed by OneZeroLabs has brought a remarkable improvement in the way attendance is managed within the department and the institution. The system is simple, efficient, and well-designed to meet the practical needs of faculty members. It has helped reduce manual effort, improved accuracy in attendance tracking, and made the overall process much more organized and reliable.",
    author: "Ms. Kamala S",
    role: "HOD & Assistant Professor, Dept. of Computer Applications",
    image: "/kamala.png",
    imagePosition: "45% 30%",
  },
  {
    company: "Vetaas Education Foundation",
    sector: "Education partner",
    logo: { src: "/clients/svg/vetaas.svg", w: 808, h: 860 },
    quote:
      "ONEZEROLABS brings a refreshing blend of technical expertise and problem-solving mindset. Their team is proactive, responsive, and genuinely invested in building solutions that work in real environments. Their ability to translate complex requirements into intuitive, scalable systems is truly commendable. It's exciting to see young innovators building technology with such clarity, purpose, and a deep understanding of what institutions actually need.",
    author: "Vetaas Education Foundation",
    role: "Education partner",
  },
]

const EASE = [0.22, 1, 0.36, 1]

const cardIn = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE, delay: i * 0.1 },
  }),
}

function TestimonialCard({ t, expanded, onToggle }) {
  return (
    // The lift goes through framer: the wrapper animates this card's entrance,
    // so a hover translate class here would be overwritten.
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
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white bg-white shadow-[0_6px_16px_-10px_rgba(15,23,42,0.3)]">
              <img
                src={t.logo.src}
                alt={`${t.company} logo`}
                width={t.logo.w}
                height={t.logo.h}
                className="h-7 w-auto"
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

          {/* Quote: five lines, then "Read more" */}
          <blockquote
            className={`mt-4 text-[14.5px] leading-[1.65] text-[#33415C] ${expanded ? "" : "line-clamp-5"}`}
          >
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="mb-5 mt-1.5 w-fit cursor-pointer text-[13px] font-medium text-[#42557A] transition-colors hover:text-ozl-violet"
          >
            {expanded ? "Show less" : "Read more"}
          </button>

          {/* Person */}
          <figcaption className="mt-auto flex items-center gap-2.5 border-t border-[#0E1A33]/[0.07] pt-4">
            {t.image && (
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-[0_4px_12px_-6px_rgba(15,23,42,0.4)]">
                <Image
                  src={t.image}
                  alt={t.author}
                  fill
                  sizes="36px"
                  className="object-cover"
                  style={{ objectPosition: t.imagePosition }}
                />
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-[13.5px] font-medium text-[#0E1A33]">{t.author}</span>
              <span className="block truncate text-[12px] text-[#6E809F]">{t.role}</span>
            </span>
          </figcaption>
        </div>
      </div>
    </motion.figure>
  )
}

export default function Testimonials() {
  // One quote open at a time. Cards aren't stretched to the row's height --
  // collapsed they are already equal (same structure, quotes clamped to five
  // lines) -- so an opened card grows on its own without leaving gaps in the
  // others.
  const [expanded, setExpanded] = useState(null)

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
        <div className="mx-auto w-full max-w-[1150px] px-4 md:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center md:mb-12"
          >
            <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.4em] text-ozl-muted sm:mb-4">
              Testimonials
            </span>
            <h2 className="ozl-heading-fade text-3xl leading-[1.1] tracking-wide font-[family-name:var(--font-instrument-serif)] md:text-5xl lg:text-6xl">
              What our clients <span className="italic">say.</span>
            </h2>
          </motion.div>

          <div
            className="mx-auto grid max-w-xl grid-cols-1 items-start gap-4 lg:max-w-none lg:grid-cols-3 lg:gap-5"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.company}
                variants={cardIn}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                <TestimonialCard
                  t={t}
                  expanded={expanded === i}
                  onToggle={() => setExpanded(expanded === i ? null : i)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </MotionConfig>
    </section>
  )
}
