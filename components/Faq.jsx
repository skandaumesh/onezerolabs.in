"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { FAQS } from "@/data/faqData"

/* Homepage FAQ, between the testimonials and the closing CTA. Questions
   and answers live in data/faqData.js. */

const EASE = [0.22, 1, 0.36, 1]

const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const rise = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

function FaqItem({ item, open, onToggle, id }) {
  return (
    <div className="border-b border-[#0E1A33]/[0.08]">
      <h3>
        <button
          id={`${id}-q`}
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left md:py-6"
        >
          <span
            className={`text-[16px] font-medium tracking-tight transition-colors duration-300 md:text-[18px] ${
              open ? "text-[#0E1A33]" : "text-[#1F2A44] group-hover:text-[#0E1A33]"
            }`}
          >
            {item.q}
          </span>
          {/* A plus in a small ring. It turns 45° into a cross and the ring
              fills dark while its answer is open. */}
          <span
            aria-hidden
            className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-ozl ${
              open
                ? "rotate-45 border-[#1E293B] bg-[#1E293B] shadow-[0_6px_14px_-6px_rgba(15,23,42,0.45)]"
                : "border-[#0E1A33]/15 bg-white group-hover:border-[#0E1A33]/35"
            }`}
          >
            <span className={`absolute h-px w-3 ${open ? "bg-white" : "bg-[#0E1A33]/70"}`} />
            <span className={`absolute h-3 w-px ${open ? "bg-white" : "bg-[#0E1A33]/70"}`} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-[580px] pb-6 pr-12 text-[15px] font-light leading-relaxed text-[#33415C] md:pb-7 md:text-[15.5px]">
              {item.a}
              {item.link && (
                <>
                  {" "}
                  <Link
                    href={item.link.href}
                    className="whitespace-nowrap font-medium text-[#42557A] transition-colors duration-300 hover:text-ozl-violet"
                  >
                    {item.link.label} →
                  </Link>
                </>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Faq() {
  const baseId = useId()
  // One answer open at a time, starting with the first so the list reads as
  // expandable at a glance.
  const [openIndex, setOpenIndex] = useState(0)

  return (
    // White, continuing from the foot of the testimonials' grey band.
    <section id="faq" className="relative w-full bg-ozl-base pb-12 pt-8 text-ozl-ink md:pb-20 md:pt-12">
      <MotionConfig reducedMotion="user">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:px-8 lg:gap-24">
          {/* Left: heading and a way out, held in place on desktop while the
              questions scroll past. Centred on phones, where it stacks. */}
          <div>
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              className="text-center md:sticky md:top-32 md:text-left"
            >
              <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.4em] text-ozl-muted sm:mb-4">
                FAQ
              </span>
              <h2 className="ozl-heading-fade text-3xl leading-[1.1] tracking-wide font-[family-name:var(--font-instrument-serif)] md:text-5xl lg:text-[56px]">
                Questions, <span className="italic">answered.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-sm text-[15px] font-light leading-relaxed text-[#33415C] md:mx-0 md:mt-6">
                The things people usually ask before working with us. Anything
                else, ask us directly.
              </p>
              <Link
                href="/contact"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-medium text-ozl-ink shadow-[inset_0_1.5px_2.5px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.05)] transition-all duration-200 hover:bg-gray-50 hover:shadow-[inset_0_1.5px_3.5px_rgba(0,0,0,0.12),0_4px_10px_rgba(0,0,0,0.08)] [touch-action:manipulation]"
              >
                Contact us
              </Link>
            </motion.div>
          </div>

          {/* Right: one list, separated by hairlines rather than boxed. */}
          <motion.div
            variants={list}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="border-t border-[#0E1A33]/[0.08]"
          >
            {FAQS.map((item, i) => (
              <motion.div key={item.q} variants={rise}>
                <FaqItem
                  item={item}
                  id={`${baseId}-${i}`}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </MotionConfig>
    </section>
  )
}
