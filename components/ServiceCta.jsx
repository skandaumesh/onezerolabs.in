'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Instrument_Serif } from 'next/font/google'
import Link from 'next/link'

const seasonFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
})

export default function ServiceCta({ text }) {
  return (
    <section className="relative w-full py-24 md:py-32 bg-black text-white px-6 md:px-12 lg:px-24 border-t border-white/[0.05]">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto w-full relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="text-[10px] md:text-xs tracking-[0.3em] font-mono text-neutral-500 uppercase block mb-6">
            READY TO START?
          </span>
          <h2 className={`text-4xl md:text-5xl lg:text-7xl text-white font-normal mb-10 leading-tight ${seasonFont.className}`}>
            Let's build something <span className="text-neutral-500">great.</span>
          </h2>
          
          <Link href="/contact" className="group inline-flex items-center justify-center gap-4 bg-white text-black px-8 py-4 rounded-full font-medium text-[15px] tracking-wide hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            {text}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
