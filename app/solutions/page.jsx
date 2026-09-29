'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import CtaSection from '@/components/CtaSection'
import { solutionsData } from '@/data/solutionsData'
import { Band, BODY, GlassCard, HEADING, INK, MUTED } from '@/components/ui/light-kit'
import JsonLd from '@/components/JsonLd'
import { solutionsIndexSchema } from '@/lib/schemas'

const solutions = Object.entries(solutionsData).map(([slug, data]) => ({
  slug,
  title: data.title,
  description: data.hero?.subheadline || data.hero?.headline || '',
}))

function SolutionCard({ solution, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <GlassCard
        as={Link}
        href={`/solutions/${solution.slug}`}
        aria-label={`${solution.title} solutions`}
        interactive
        className="h-full"
        innerClassName="flex min-h-[260px] flex-col p-7 md:p-8"
      >
        <h3 className={`font-[family-name:var(--font-instrument-serif)] text-[24px] leading-[1.2] tracking-wide md:text-[26px] ${INK}`}>
          {solution.title}
        </h3>
        <span
          aria-hidden
          className="mb-4 mt-4 block h-px w-8 bg-[#0E1A33]/15 transition-all duration-500 ease-ozl group-hover:w-16 group-hover:bg-ozl-violet/60"
        />
        <p className={`max-w-[300px] text-[14px] font-light leading-[1.65] md:text-[15px] ${BODY}`}>
          {solution.description}
        </p>

        <span className="mt-auto pt-6 text-[13px] font-medium tracking-wide text-[#42557A] transition-colors duration-500 group-hover:text-ozl-violet">
          Explore{" "}
          <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
        </span>
      </GlassCard>
    </motion.div>
  )
}

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-ozl-base text-ozl-ink">
      <JsonLd data={solutionsIndexSchema} />
      <Band className="px-4 pb-10 pt-32 md:px-8 md:pb-14 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-[1200px] text-center"
        >
          <h1 className={`${HEADING} text-4xl md:text-5xl lg:text-6xl`}>
            Our <span className="italic">Solutions</span>
          </h1>
          <p className={`mx-auto mt-5 max-w-[520px] text-[14px] font-light leading-relaxed md:mt-6 md:text-[15px] ${MUTED}`}>
            Tailored digital infrastructure for every kind of organization we partner with.
          </p>
        </motion.div>
      </Band>

      <Band tone="grey" fadeTop fadeBottom className="px-4 pb-24 pt-10 md:px-8 md:pb-32 md:pt-14">
        <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {solutions.map((solution, index) => (
            <SolutionCard key={solution.slug} solution={solution} index={index} />
          ))}
        </div>
      </Band>

      <CtaSection title="Don’t see your industry?" primaryLabel="Talk to us" />
    </main>
  )
}
