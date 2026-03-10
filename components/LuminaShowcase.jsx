'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { Layers, Cpu, Globe, Zap, Search, Fingerprint, Sparkles } from 'lucide-react'
import { Instrument_Serif } from 'next/font/google'

const seasonFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
})

// --- 1. DATA: SERVICES ---
const services = [
  {
    id: "01",
    title: "Institutional Software",
    description: "Digital systems that replace manual academic processes — managing attendance, internal assessments, portals, and institutional operations with efficiency and transparency.",
    icon: Globe,
    features: [
      "Attendance & Performance tracking",
      "Academic assessment portals",
      "Seamless institutional operations"
    ]
  },
  {
    id: "02",
    title: "Product & Platform Engineering",
    description: "End-to-end development of scalable platforms and digital products designed to power real-world operations and long-term growth.",
    icon: Cpu,
    features: [
      "Custom platform architecture",
      "Operation-focused development",
      "Scalable digital infrastructure"
    ]
  },
  {
    id: "03",
    title: "Web Architecture",
    description: "High-performance websites and digital platforms engineered to build credibility, improve performance, and support business growth.",
    icon: Zap,
    features: [
      "Performance-first engineering",
      "Business-aligned architectures",
      "Conversion & credibility focus"
    ]
  },
  {
    id: "04",
    title: "AI Systems",
    description: "Practical AI-powered tools and automation systems that reduce repetitive work and bring intelligent decision-making into everyday operations.",
    icon: Sparkles,
    features: [
      "Workflow automation systems",
      "Intelligent decision support",
      "Repetitive task reduction"
    ]
  },
  {
    id: "05",
    title: "Growth Infrastructure",
    description: "Technical and digital foundations — including SEO and online systems — that improve discoverability, credibility, and long-term digital growth.",
    icon: Search,
    features: [
      "Technical discovery systems",
      "Online credibility foundations",
      "Programmatic SEO frameworks"
    ]
  },
  {
    id: "06",
    title: "Social Media & Design",
    description: "Strategic content, visual design, and social media systems that strengthen brand identity and create consistent digital communication.",
    icon: Fingerprint,
    features: [
      "Brand identity systems",
      "Strategic content design",
      "Structured social communication"
    ]
  }
]

// --- 2. LEFT SIDE: ISOMETRIC STACK ---
const IsometricStack = ({ activeIndex }) => {
  const layerCount = activeIndex + 1;
  // Calculate vertical shift: Mobile needs more shift to stay visible.
  // We use CSS variables or a simple calculation to push it down.

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-[1000px] py-4 md:py-0">

      {/* Background Grid - Static, centered, fixed */}
      <div
        className="absolute w-[95%] h-[95%] top-[60px] md:top-[35px] opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at 50% 50%, black 50%, transparent 80%)',
          borderRadius: '2.5rem'
        }}
      />

      {/* Moving Container - Centered vertically in the smaller mobile visual area */}
      <motion.div
        animate={{ y: activeIndex * 10 + 35 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative flex items-center justify-center scale-[0.45] md:scale-[0.8] origin-center"
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
                initial={{ opacity: 0, z: i * 25, y: 150 }} // Larger initial drop
                animate={{ opacity: 1, z: i * 25, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.5,
                  ease: "backOut"
                }}
                className="absolute inset-0 rounded-[2rem] border border-white/40 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-[2px] shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                <div className="absolute inset-0 rounded-[2rem] border-t border-l border-white/50" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bottom Text Label */}

    </div>
  )
}

// --- 3. RIGHT SIDE: CONTENT AREA ---
const ContentPane = ({ service }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-center p-6 md:p-8 min-h-[320px] md:min-h-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={service.id}
          initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex flex-col"
        >
          <h3 className={`text-3xl md:text-4xl text-white mb-4 leading-none ${seasonFont.className}`}>
            {service.title}
          </h3>

          <p className="text-neutral-400 leading-relaxed mb-5 max-w-sm font-normal" style={{ fontFamily: "'Satoshi', 'Matter', sans-serif" }}>
            {service.description}
          </p>

          <div className="space-y-4">
            {service.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-4 group/item">
                <div className="mt-2 flex-shrink-0 relative flex items-center justify-center">
                  <div className="w-3.5 h-[2px] rounded-full bg-gradient-to-r from-white/80 to-white/20 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                </div>
                <div>
                  <h4 className="text-white/90 text-sm font-medium leading-tight" style={{ fontFamily: "'Satoshi', 'Matter', sans-serif" }}>
                    {feature}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 self-start px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-xs text-white uppercase tracking-wider hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// --- 4. MAIN LAYOUT ---
export default function VisionSection() {
  const containerRef = useRef(null)
  const [activeServiceIndex, setActiveServiceIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Map scroll progress (0-1) to service index (0-5)
    const index = Math.min(
      Math.floor(latest * services.length),
      services.length - 1
    )
    setActiveServiceIndex(index)
  })

  return (
    <section ref={containerRef} className="bg-black w-full min-h-[400vh] relative">

      {/* Fixed Background */}
      <div className="fixed top-[10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* STICKY CONTAINER */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-start py-8 md:py-12 overflow-hidden">

        {/* --- FIXED HEADER --- */}
        <div className="relative z-50 text-center pt-12 md:pt-0 mb-8 md:mb-12 mix-blend-difference">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] font-mono tracking-[0.4em] text-neutral-400/80 uppercase block mb-4"
          >
            For Institutions | Businesses | Startups
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-4xl md:text-6xl text-white tracking-wide leading-none ${seasonFont.className}`}
          >
            Defining the <span className="text-neutral-500">Digital Standard.</span>
          </motion.h2>
        </div>

        {/* --- SINGLE STAGE CARD --- */}
        <div className="relative w-full max-w-6xl px-4 flex items-center justify-center">
          {/* Outer Layer Container */}
          <div className="relative w-full max-w-[1050px] rounded-[3rem] border border-white/[0.07] bg-[#0a0a0a] p-3 md:p-4 shadow-[0_0_60px_rgba(255,255,255,0.06)]">
            {/* Inner Card */}
            <div className="relative w-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0a0a0b]/80 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(255,255,255,0.15)] flex flex-col gap-6 md:gap-0 md:flex-row h-auto min-h-[420px] md:h-[480px]">

              {/* Extra Glass Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-0" />

              {/* LEFT: ISOMETRIC STACK */}
              <div className="relative w-full md:w-1/2 h-auto min-h-[160px] md:min-h-0 bg-transparent p-4 md:p-12 overflow-visible z-10">
                <IsometricStack activeIndex={activeServiceIndex} />
              </div>

              {/* RIGHT: CONTENT PANE */}
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