'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { Instrument_Serif } from 'next/font/google'

const seasonFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
})

const services = [
  {
    id: "01",
    label: "INSTITUTIONS",
    title: "Systems that run your campus.",
    description: "From attendance and assessment portals to parent-facing mobile apps and AI-powered dashboards. We build the digital backbone of educational institutions. Our flagship SAAME platform, sold commercially to MLA Academy of Higher Learning, is proof this works at production scale.",
  },
  {
    id: "02",
    label: "BUSINESSES & STARTUPS",
    title: "Brand identity and web presence, built to last.",
    description: "Brand strategy, visual identity, Next.js websites, landing pages, UI/UX, and search presence. Designed as a coherent system, not a collection of disconnected deliverables.",
  },
  {
    id: "03",
    label: "ALL CLIENTS",
    title: "The infrastructure behind how you work.",
    description: "AI workflows, chatbots, business process automation, SOP creation, CRM setup, KPI dashboards, and internal systems. The operational layer that lets your team move faster without adding headcount.",
  },
  {
    id: "04",
    label: "ONGOING RETAINER",
    title: "Marketing that compounds.",
    description: "Social media management, content strategy, content creation, reels and short-form video, marketing campaigns, and founder branding. Executed monthly as a retainer, not a one-off project.",
  }
]

const IsometricStack = ({ activeIndex }) => {
  const layerCount = activeIndex + 1;

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-[1000px] py-4 md:py-0">
      <div
        className="absolute w-[95%] h-[95%] top-[60px] md:top-[35px] opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at 50% 50%, black 50%, transparent 80%)',
          borderRadius: '2.5rem'
        }}
      />
      <motion.div
        animate={{ y: activeIndex * 15 + 20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative flex items-center justify-center scale-[0.55] md:scale-[0.8] origin-center"
      >
        <div
          className="relative w-48 h-48"
          style={{
            transform: 'rotateX(60deg) rotateZ(45deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          <AnimatePresence>
            {Array.from({ length: layerCount }).map((_, i) => (
              <motion.div
                key={`layer-${i}`}
                initial={{ opacity: 0, z: i * 30, y: 150 }}
                animate={{ opacity: 1, z: i * 30, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="absolute inset-0 rounded-[2rem] border border-white/50 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-[2px] shadow-[0_0_30px_rgba(255,255,255,0.25),inset_0_0_20px_rgba(255,255,255,0.1)]"
              >
                <div className="absolute inset-0 rounded-[2rem] border-t border-l border-white/50" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

const ContentPane = ({ service }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-center px-6 py-4 pb-8 md:p-8 min-h-[280px] md:min-h-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={service.id}
          initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex flex-col"
        >
          <span className="text-[10px] md:text-[11px] font-mono font-bold text-neutral-500 tracking-[0.2em] uppercase mb-4">
            {service.id} · {service.label}
          </span>
          <h3 className={`text-4xl md:text-5xl text-white mb-5 leading-tight ${seasonFont.className}`}>
            {service.title}
          </h3>
          <p className="text-neutral-400 leading-relaxed max-w-md text-[14px] sm:text-[15px] md:text-[17px] font-normal" style={{ fontFamily: "'Satoshi', 'Matter', sans-serif" }}>
            {service.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function ServicesSection() {
  const containerRef = useRef(null)
  const [activeServiceIndex, setActiveServiceIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(
      Math.floor(latest * services.length),
      services.length - 1
    )
    setActiveServiceIndex(index)
  })

  return (
    <section ref={containerRef} id="services" className="bg-black w-full min-h-[300vh] relative">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center md:justify-start overflow-hidden">
        
        <div className="relative z-50 text-center pt-20 md:pt-24 lg:pt-28 mb-2 md:mb-4 mix-blend-difference">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] font-mono tracking-[0.4em] text-neutral-400/80 uppercase block mb-4"
          >
            FOR INSTITUTIONS · BUSINESSES · STARTUPS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-4xl md:text-6xl text-white tracking-wide leading-none ${seasonFont.className}`}
          >
            What We <span className="text-neutral-500">Build.</span>
          </motion.h2>
        </div>

        <div className="relative w-full max-w-6xl px-4 flex items-center justify-center">
          <div className="relative w-full max-w-[1000px] rounded-[3rem] border border-white/[0.07] bg-[#0a0a0a] p-3 md:p-4 shadow-[0_0_60px_rgba(255,255,255,0.06)]">
            <div className="relative w-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0a0a0b]/80 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(255,255,255,0.15)] flex flex-col gap-6 md:gap-0 md:flex-row h-auto min-h-[420px] md:h-[440px]">
              
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-0" />

              <div className="relative w-full md:w-1/2 h-auto min-h-[200px] md:min-h-0 bg-transparent p-4 md:p-10 overflow-visible z-10 flex items-center justify-center scale-95">
                <IsometricStack activeIndex={activeServiceIndex} />
              </div>

              <div className="relative w-full md:w-1/2 bg-transparent z-10">
                <ContentPane service={services[activeServiceIndex]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

