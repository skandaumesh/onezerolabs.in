'use client'

import React from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion'
import { ArrowRight, Linkedin, Mail } from 'lucide-react'

// ----------------------------------------------------------------------
// 0. FONT LOADER
// ----------------------------------------------------------------------
const FontLoader = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap');
    .font-syne { font-family: 'Syne', sans-serif; }
    .font-inter { font-family: 'Inter', sans-serif; }
  `}} />
)

// ----------------------------------------------------------------------
// 1. UTILS: MARQUEE LOGIC
// ----------------------------------------------------------------------
const wrap = (min, max, v) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

const VelocityText = ({ children, baseVelocity = 5, className = "" }) => {
  const baseX = useMotionValue(0)
  useAnimationFrame((t, delta) => {
    let moveBy = baseVelocity * (delta / 1000)
    baseX.set(baseX.get() + moveBy)
  })
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap select-none w-full pointer-events-none">
      <motion.div className={`flex flex-nowrap ${className}`} style={{ x }}>
        {[...Array(8)].map((_, i) => (
          <span key={i} className="block mr-[10vw]">{children}</span>
        ))}
      </motion.div>
    </div>
  )
}

// ----------------------------------------------------------------------
// 2. MAIN COMPONENT
// ----------------------------------------------------------------------
export default function ContactSection() {

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 }, // Reduced Y distance for subtler entrance
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  }

  return (
    // CHANGED: bg-black to bg-white. Reduced padding (py-16 md:py-24). Removed massive pb-48.
    <section className="relative w-full bg-white overflow-hidden z-40 py-16 md:py-24">

      <FontLoader />

      {/* --- BACKGROUND MARQUEE (SUBTLE WATERMARK) --- */}
      {/* CHANGED: text-white to text-neutral-100 for subtle grey on white bg */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full opacity-100 pointer-events-none select-none z-0">
        <VelocityText baseVelocity={1} className="text-[20vw] md:text-[12vw] font-black font-syne leading-none text-neutral-100/50">
          ONEZEROLABS — INNOVATE — DEPLOY —
        </VelocityText>
      </div>

      {/* --- CONTENT WRAPPER --- */}
      {/* CHANGED: max-w-[1400px] to max-w-[1200px] for a tighter layout */}
      <div className="relative z-20 w-full px-6 md:px-12 max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 lg:gap-20">

        {/* LEFT COLUMN: Heading & CTA */}
        <div className="max-w-xl w-full flex flex-col items-start text-left">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="w-full text-left"
          >
            <span className="block text-neutral-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6 text-left font-bold">
               // INITIALIZE_CONNECTION
            </span>

            {/* CHANGED: Text colors inverted. Sizes slightly reduced. */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black font-syne uppercase tracking-tighter leading-[0.9] mb-8 text-left">
              Let's build <br />
              <span className="text-neutral-400">The Future.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="w-full text-left"
          >
            {/* CHANGED: Text color darker for readability on white */}
            <p className="text-neutral-600 text-sm md:text-base font-inter mb-10 max-w-md leading-relaxed text-left">
              Our digital lab is ready to architect your vision. From custom LLMs to high-performance SaaS, let's deploy something significant.
            </p>

            <Link href="/contact" className="inline-block">
              {/* CHANGED: Button colors inverted (Black bg, white text). Shadow is now dark. */}
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest text-[11px] transition-all duration-300 flex items-center gap-3 overflow-hidden"
              >
                <span className="relative z-10 font-syne">Start a Project</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Contact Info */}
        <motion.div
          className="flex flex-col items-start w-full lg:w-auto text-left mt-10 lg:mt-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
        >
          <p className="text-neutral-500 text-[10px] md:text-xs font-mono uppercase tracking-widest mb-4 text-left font-bold">
            Transmission Protocol
          </p>

          {/* CHANGED: Link color to black. Underline color to black. Sizes reduced. */}
          <a
            href="mailto:hello@onezerolabs.com"
            className="group relative text-2xl sm:text-3xl md:text-4xl font-bold text-black font-syne tracking-tight transition-colors duration-300 mb-8 block"
          >
            hello@onezerolabs.com
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black group-hover:w-full transition-all duration-500 ease-out" />
          </a>

          <div className="flex flex-wrap items-center gap-4">
            {/* LinkedIn Pill */}
            {/* CHANGED: Borders and text colors adapted for white background */}
            <motion.a
              href="https://linkedin.com/..."
              target="_blank"
              whileHover={{ y: -3, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
              className="flex items-center gap-3 border border-black/10 px-5 py-2.5 rounded-full hover:border-black transition-colors group bg-white"
            >
              <Linkedin size={14} className="text-neutral-600 group-hover:text-black transition-colors" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 group-hover:text-black">
                LinkedIn
              </span>
            </motion.a>

            {/* Email Pill */}
            <motion.a
              href="mailto:hello@onezerolabs.com"
              whileHover={{ y: -3, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
              className="flex items-center gap-3 border border-black/10 px-5 py-2.5 rounded-full hover:border-black transition-colors group bg-white"
            >
              <Mail size={14} className="text-neutral-600 group-hover:text-black transition-colors" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 group-hover:text-black">
                Email
              </span>
            </motion.a>
          </div>
        </motion.div>

      </div>

      {/* --- FOOTER LOGO MARK --- */}
      {/* CHANGED: Changed color to very subtle black. Reduced translation Y. */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center overflow-hidden pointer-events-none z-10 translate-y-[10%]">
        <h1 className="font-syne font-black text-[12vw] leading-none text-black/[0.02] tracking-tighter select-none whitespace-nowrap">
          ONEZEROLABS
        </h1>
      </div>

    </section>
  )
}