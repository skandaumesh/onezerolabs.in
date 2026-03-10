"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Instrument_Serif } from 'next/font/google'

const seasonFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
})

export default function VisionSection() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Gentle parallax effect for the whole block
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  const features = [
    {
      title: 'Sovereign by design',
      description: 'Build, deploy, and run full-stack systems with complete control, crafted entirely for your institution.'
    },
    {
      title: 'State of the art Architecture',
      description: "Industry-leading frameworks built for scale, speed, and real-world operational context."
    },
    {
      title: 'Human at the core',
      description: 'Forward deployed engineers work alongside your teams to deliver production-ready software.'
    }
  ]

  // Staggered Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.5
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full pt-6 md:pt-8 pb-20 md:pb-32 bg-black text-white px-6 md:px-12 lg:px-24 flex flex-col items-center overflow-hidden"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[1050px] w-full relative z-10 flex flex-col items-center"
      >
        {/* Centered Top Heading */}
        <motion.h2
          variants={itemVariants}
          className={`text-3xl md:text-4xl lg:text-5xl tracking-wide mb-8 md:mb-12 text-center text-white/90 ${seasonFont.className}`}
        >
          Powering the digital-first future
        </motion.h2>

        {/* The Main Rounded Card Container */}
        <motion.div
          variants={itemVariants}
          className="w-full bg-[#08080A] border border-white/20 rounded-[2.5rem] p-3 md:p-4 flex flex-col lg:flex-row gap-6 md:gap-10 items-center shadow-[0_0_40px_rgba(255,255,255,0.15)] relative overflow-hidden group"
        >
          {/* LEFT COLUMN: The Visual Object Container (replicating the rounded visual box) */}
          <div className="w-full lg:w-[45%] aspect-square rounded-[2rem] bg-[linear-gradient(to_bottom_right,#1c1c1c_0%,#09090C_100%)] relative overflow-hidden flex flex-col items-center justify-center border border-white/10 shadow-[inner_0_0_20px_rgba(255,255,255,0.05)]">
            {/* Subtle glow effect behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-white rounded-full blur-[80px] opacity-[0.08]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-white rounded-full blur-[40px] opacity-[0.12]" />

            {/* Clouds / Bottom shapes mimicking the reference visual */}
            <div className="absolute bottom-0 w-full h-[60%] flex items-end justify-center pointer-events-none opacity-50">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute bottom-[-10%] w-[60%] h-[80%] bg-white/10 blur-[40px] rounded-t-full" />
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 1 }} className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-white/5 blur-[30px] rounded-t-full" />
              <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }} className="absolute bottom-[-25%] right-[-10%] w-[60%] h-[80%] bg-white/10 blur-[30px] rounded-t-full" />
            </div>

            {/* Inner Rotating Abstract Mandala/Lotus */}
            <motion.div
              animate={{
                rotateZ: [0, 360],
              }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center relative z-10 mb-16 mt-4"
            >
              {/* The 4 overlapping capsules/petals */}
              <div className="absolute w-20 h-36 md:w-28 md:h-48 border-[1.5px] border-white/50 rounded-[50%] rotate-0 shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
              <div className="absolute w-20 h-36 md:w-28 md:h-48 border-[1.5px] border-white/50 rounded-[50%] rotate-[45deg] shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
              <div className="absolute w-20 h-36 md:w-28 md:h-48 border-[1.5px] border-white/50 rounded-[50%] rotate-[90deg] shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
              <div className="absolute w-20 h-36 md:w-28 md:h-48 border-[1.5px] border-white/50 rounded-[50%] rotate-[135deg] shadow-[0_0_15px_rgba(255,255,255,0.05)]" />

              {/* Inner ring overlay */}
              <div className="absolute w-24 h-24 md:w-32 md:h-32 border-[1.5px] border-white/40 rounded-full" />

              {/* Center diamond */}
              <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-[2px] shadow-[0_0_20px_rgba(255,255,255,1)] rotate-45 relative z-10" />
            </motion.div>
          </div>

          {/* RIGHT COLUMN: The Features List */}
          <div className="w-full lg:w-[50%] flex flex-col gap-10 md:gap-14 py-4 pr-0 lg:pr-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex items-start gap-6 w-full group"
              >
                <div className="mt-3 flex-shrink-0 relative flex items-center justify-center">
                  <div className="w-4 h-[2px] rounded-full bg-gradient-to-r from-white/80 to-white/20 shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-shadow" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[22px] md:text-[24px] font-semibold text-white tracking-tight" style={{ fontFamily: "'Satoshi', 'Matter', sans-serif" }}>
                    {feature.title}
                  </h3>
                  <p className="text-[15px] md:text-[16px] text-[#A1A1AA] leading-[1.6] max-w-none font-normal" style={{ fontFamily: "'Satoshi', 'Matter', sans-serif" }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </motion.div>

      {/* Subtle Background Overlay for the section */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)] pointer-events-none" />
    </section>
  )
}