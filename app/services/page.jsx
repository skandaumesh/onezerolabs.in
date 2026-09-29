'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import CtaSection from '@/components/CtaSection'
import { Band, BODY, GlassCard, HEADING, INK, MUTED } from '@/components/ui/light-kit'
import JsonLd from '@/components/JsonLd'
import { servicesIndexSchema } from '@/lib/schemas'

// ── SERVICE DATA ──
const services = [
  {
    title: 'Institutional Software',
    description:
      'Digital systems that replace manual academic processes: managing attendance, assessments, portals, and institutional operations.',
  },
  {
    title: 'Product & Platform Engineering',
    description:
      'End-to-end development of scalable platforms and digital products designed to power real-world operations.',
  },
  {
    title: 'Web Architecture',
    description:
      'High-performance websites and digital platforms engineered to build credibility and support business growth.',
  },
  {
    title: 'AI Systems',
    description:
      'Practical AI-powered tools and automation that reduce repetitive work and enable intelligent decision-making.',
  },
  {
    title: 'Growth Infrastructure',
    description:
      'Technical foundations including SEO and online systems that improve discoverability and long-term digital growth.',
  },
  {
    title: 'Social Media Management',
    description:
      'Strategic social media planning, content scheduling, and community engagement that builds brand presence.',
  },
  {
    title: 'Graphics Designing',
    description:
      'Visual design and creative assets, from logos and marketing materials to UI elements and presentation decks.',
  },
]

// ── SERVICE CARD ──
// Title, a hairline, then the description -- the homepage's why-us card.
function ServiceCard({ service, index }) {
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
      <GlassCard interactive className="h-full" innerClassName="flex min-h-[240px] flex-col p-7 md:p-8">
        <h3 className={`font-[family-name:var(--font-instrument-serif)] text-[24px] leading-[1.2] tracking-wide md:text-[26px] ${INK}`}>
          {service.title}
        </h3>
        <span
          aria-hidden
          className="mb-4 mt-4 block h-px w-8 bg-[#0E1A33]/15 transition-all duration-500 ease-ozl group-hover:w-16 group-hover:bg-ozl-violet/60"
        />
        <p className={`mt-auto max-w-[300px] text-[14px] font-light leading-[1.65] md:text-[15px] ${BODY}`}>
          {service.description}
        </p>
      </GlassCard>
    </motion.div>
  )
}

// ── MAIN PAGE ──
export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-ozl-base text-ozl-ink">
      <JsonLd data={servicesIndexSchema} />
      {/* ─── HEADING ─── */}
      <Band className="px-4 pb-10 pt-32 md:px-8 md:pb-14 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-[1200px] text-center"
        >
          <h1 className={`${HEADING} text-4xl md:text-5xl lg:text-6xl`}>
            Our <span className="italic">Services</span>
          </h1>
          <p className={`mx-auto mt-5 max-w-[480px] text-[14px] font-light leading-relaxed md:mt-6 md:text-[15px] ${MUTED}`}>
            Engineered solutions for institutions, startups, and growing businesses.
          </p>
        </motion.div>
      </Band>

      {/* ─── SERVICES GRID ─── */}
      <Band tone="grey" fadeTop fadeBottom className="px-4 pb-24 pt-10 md:px-8 md:pb-32 md:pt-14">
        <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {services.slice(0, 6).map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
        {/* 7th card centered */}
        <div className="relative z-10 mx-auto mt-5 flex max-w-[1200px] justify-center md:mt-6">
          <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-16px)]">
            <ServiceCard service={services[6]} index={6} />
          </div>
        </div>
      </Band>

      {/* ─── CLOSE ─── */}
      <CtaSection title="Ready to build?" />
    </main>
  )
}
