'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Instrument_Serif, Inter } from 'next/font/google'
import Link from 'next/link'
import NavbarResponsive from '@/components/Navbar'
import { solutionsData } from '@/data/solutionsData'

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
})

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  adjustFontFallback: false,
})

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
      className="group"
    >
      <Link href={`/solutions/${solution.slug}`} aria-label={`${solution.title} solutions`}>
        <div className="relative w-full p-2 rounded-[32px] bg-[#0c0c0e] border border-white/10 transition-all duration-500 hover:border-white/[0.2] hover:shadow-[0_0_30px_rgba(255,255,255,0.06)] group/card">
          <div className="relative w-full h-full min-h-[280px] rounded-[24px] overflow-hidden bg-black border border-white/[0.05] p-8 text-left z-10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] flex flex-col">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.05)_0%,transparent_60%)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-600 pointer-events-none" />

            <div className="relative z-20 flex flex-col h-full w-full">
              <div className="text-white/20 font-mono text-sm mb-6 flex items-center gap-4">
                <span>{(index + 1).toString().padStart(2, '0')}</span>
                <div className="h-[1px] w-12 bg-white/10 group-hover/card:w-20 group-hover/card:bg-white/20 transition-all duration-500" />
              </div>

              <h3 className={`text-[24px] md:text-[26px] text-white leading-[1.2] tracking-wide mb-4 ${serif.className}`}>
                {solution.title}
              </h3>

              <p className="text-white/60 text-[13px] md:text-[14px] leading-[1.6] font-light max-w-[280px] group-hover/card:text-white/80 transition-colors duration-400">
                {solution.description}
              </p>

              <div className="mt-auto pt-6 inline-flex items-center gap-2 text-white/40 text-[13px] tracking-wide group-hover/card:text-white/80 transition-colors duration-400">
                Explore
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function SolutionsPage() {
  return (
    <main className={`bg-[#050505] text-white min-h-screen selection:bg-white/20 ${sans.className}`}>
      <NavbarResponsive />

      <div className="pt-32 md:pt-40" />

      <section className="relative w-full px-4 md:px-8 pb-32 md:pb-40 overflow-hidden">
        <div className="absolute top-[5%] left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none blur-[60px]" />
        <div className="absolute top-[40%] right-[5%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.025)_0%,transparent_70%)] pointer-events-none blur-[60px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-[1200px] mx-auto text-center mb-6 md:mb-8"
        >
          <h1 className={`text-4xl md:text-5xl lg:text-6xl text-white tracking-wide leading-[1.1] ${serif.className}`}>
            Our <span className="italic text-white/40">Solutions</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 max-w-[520px] mx-auto text-center text-neutral-500 text-[14px] md:text-[15px] font-light leading-relaxed mb-6"
        >
          Tailored digital infrastructure for every kind of organization we partner with.
        </motion.p>

        <div className="relative z-10 flex justify-center mb-14 md:mb-18">
          <div className="w-[80px] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {solutions.map((solution, index) => (
            <SolutionCard key={solution.slug} solution={solution} index={index} />
          ))}
        </div>
      </section>

      <section className="relative z-10 overflow-hidden border-t border-white/[0.04] min-h-[40vh] flex flex-col items-center justify-center">
        <div className="max-w-[900px] mx-auto px-6 py-24 md:py-32 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`text-4xl sm:text-5xl md:text-6xl text-white leading-[0.95] tracking-wide mb-8 ${serif.className}`}
          >
            Don't see your <span className="italic text-white/35">industry?</span>
          </motion.h2>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] text-white text-sm font-medium tracking-wide rounded-full hover:bg-white/[0.07] transition-all duration-500"
          >
            Talk to us
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <ArrowUpRight size={16} />
            </div>
          </Link>
        </div>
      </section>
    </main>
  )
}
