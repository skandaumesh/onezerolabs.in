"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function FinalCta() {
  return (
    <section className="relative w-full py-32 md:py-48 bg-black text-white px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-white opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-3xl w-full"
      >
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-[family-name:var(--font-instrument-serif)] text-white mb-8">
          Let's build something significant.
        </h2>
        
        <p className="text-white/60 text-lg md:text-xl font-normal leading-relaxed mb-12 max-w-2xl">
          Our studio is ready. Brand, technology, operations, marketing — tell us what you're building and we'll architect the system around it.
        </p>
        
        <div className="flex flex-col items-center gap-6">
          <Link 
            href="/contact"
            className="px-8 py-4 bg-white text-black text-sm uppercase tracking-wider font-semibold rounded-full hover:bg-white/90 transition-colors"
          >
            Start a Project
          </Link>
          
          <a 
            href="mailto:hello@onezerolabs.in"
            className="text-white/40 text-sm hover:text-white/80 transition-colors underline underline-offset-4"
          >
            Or email us at hello@onezerolabs.in
          </a>
        </div>
      </motion.div>
    </section>
  )
}
