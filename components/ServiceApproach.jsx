'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Instrument_Serif } from 'next/font/google'
import { Search, PenTool, Hammer, LineChart } from 'lucide-react'

const seasonFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
})

const steps = [
  {
    title: "Discover",
    description: "We analyze your business, identify bottlenecks, and uncover growth opportunities.",
    icon: Search
  },
  {
    title: "Design",
    description: "We create systems, processes, and solutions tailored to your goals.",
    icon: PenTool
  },
  {
    title: "Build",
    description: "Our team develops and implements the required infrastructure.",
    icon: Hammer
  },
  {
    title: "Optimize",
    description: "We continuously improve performance through analytics and iteration.",
    icon: LineChart
  }
]

export default function ServiceApproach() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-black text-white px-6 md:px-12 lg:px-24">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-white/[0.02] to-black pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto w-full relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-[10px] md:text-xs tracking-[0.3em] font-mono text-neutral-500 uppercase block mb-4">
            HOW WE WORK
          </span>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl text-white font-normal tracking-wide ${seasonFont.className}`}>
            The OneZeroLabs <span className="text-neutral-500">Approach.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="relative p-8 rounded-[2rem] border border-white/5 bg-[#151515] hover:bg-[#1c1c1c] transition-colors duration-500 group"
            >
              {/* Top border highlight */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex flex-col h-full relative z-10">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-neutral-400 mb-6 group-hover:text-white group-hover:border-white/30 transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  <step.icon size={20} strokeWidth={1.5} />
                </div>
                
                <h3 className={`text-2xl text-white mb-3 ${seasonFont.className}`}>
                  {index + 1}. {step.title}
                </h3>
                
                <p className="text-neutral-400 text-[15px] leading-relaxed group-hover:text-neutral-300 transition-colors duration-500" style={{ fontFamily: "'Satoshi', 'Matter', sans-serif" }}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
