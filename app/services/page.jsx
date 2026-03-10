'use client'

import React, { useRef, useEffect } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Instrument_Serif, Inter } from 'next/font/google'
import Link from 'next/link'
import NavbarResponsive from '@/components/Navbar'

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
})

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

import Image from 'next/image'

// ── SERVICE DATA ──
const services = [
  {
    image: '/aesthetic_object.png',
    title: 'Institutional Software',
    description:
      'Digital systems that replace manual academic processes — managing attendance, assessments, portals, and institutional operations.',
  },
  {
    image: '/aesthetic_object.png',
    title: 'Product & Platform Engineering',
    description:
      'End-to-end development of scalable platforms and digital products designed to power real-world operations.',
  },
  {
    image: '/aesthetic_object.png',
    title: 'Web Architecture',
    description:
      'High-performance websites and digital platforms engineered to build credibility and support business growth.',
  },
  {
    image: '/aesthetic_object.png',
    title: 'AI Systems',
    description:
      'Practical AI-powered tools and automation that reduce repetitive work and enable intelligent decision-making.',
  },
  {
    image: '/aesthetic_object.png',
    title: 'Growth Infrastructure',
    description:
      'Technical foundations including SEO and online systems that improve discoverability and long-term digital growth.',
  },
  {
    image: '/aesthetic_object.png',
    title: 'Social Media Management',
    description:
      'Strategic social media planning, content scheduling, and community engagement that builds brand presence.',
  },
  {
    image: '/aesthetic_object.png',
    title: 'Graphics Designing',
    description:
      'Visual design and creative assets — from logos and marketing materials to UI elements and presentation decks.',
  },
]

// ── SERVICE CARD ──
function ServiceCard({ service, index }) {
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
      <div className="relative w-full p-2 rounded-[32px] bg-[#0c0c0e] border border-white/10 transition-all duration-500 hover:border-white/[0.2] hover:shadow-[0_0_30px_rgba(255,255,255,0.06)] group/card">

        {/* Inner Window */}
        <div className="relative w-full h-full min-h-[280px] rounded-[24px] overflow-hidden bg-black border border-white/[0.05] p-8 text-left z-10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] flex flex-col">

          {/* Subtle top glow on hover */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.05)_0%,transparent_60%)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-600 pointer-events-none" />

          {/* Content - Structured Layout */}
          <div className="relative z-20 flex flex-col h-full w-full">

            {/* Number Indicator */}
            <div className="text-white/20 font-mono text-sm mb-6 flex items-center gap-4">
              <span>{(index + 1).toString().padStart(2, '0')}</span>
              <div className="h-[1px] w-12 bg-white/10 group-hover/card:w-20 group-hover/card:bg-white/20 transition-all duration-500" />
            </div>

            {/* ── TITLE ── */}
            <h3 className={`text-[24px] md:text-[26px] text-white leading-[1.2] tracking-wide mb-4 ${serif.className}`}>
              {service.title}
            </h3>

            {/* ── DESCRIPTION ── */}
            <p className="text-white/60 text-[13px] md:text-[14px] leading-[1.6] font-light max-w-[280px] group-hover/card:text-white/80 transition-colors duration-400 mt-auto">
              {service.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── MAIN PAGE ──
export default function ServicesPage() {
  const ctaRef = useRef(null)
  const isCtaInView = useInView(ctaRef, { once: false, margin: '-10% 0px' })
  const glowControls = useAnimation()

  useEffect(() => {
    if (isCtaInView) {
      glowControls.start('visible')
    } else {
      glowControls.start('hidden')
    }
  }, [isCtaInView, glowControls])

  const glowVariants = {
    hidden: { opacity: 0, y: 120, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 2.0,
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 1.4, ease: 'easeOut' },
        scale: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
      },
    },
  }

  return (
    <main className={`bg-[#050505] text-white min-h-screen selection:bg-white/20 ${sans.className}`}>

      <NavbarResponsive />

      {/* Spacer for navbar */}
      <div className="pt-32 md:pt-40" />


      {/* ─── SERVICES GRID ─── */}
      <section className="relative w-full px-4 md:px-8 pb-32 md:pb-40 overflow-hidden">

        {/* Ambient background glows */}
        <div className="absolute top-[5%] left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none blur-[60px]" />
        <div className="absolute top-[40%] right-[5%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.025)_0%,transparent_70%)] pointer-events-none blur-[60px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none blur-[50px]" />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

        {/* Floating animated orbs */}
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[20%] w-[6px] h-[6px] rounded-full bg-white/20 blur-[1px] pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[50%] left-[8%] w-[4px] h-[4px] rounded-full bg-white/15 blur-[1px] pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, -6, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-[30%] right-[12%] w-[5px] h-[5px] rounded-full bg-white/20 blur-[1px] pointer-events-none"
        />

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-[1200px] mx-auto text-center mb-6 md:mb-8"
        >
          <h2 className={`text-4xl md:text-5xl lg:text-6xl text-white tracking-wide leading-[1.1] ${serif.className}`}>
            Our <span className="italic text-white/40">Services</span>
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 max-w-[480px] mx-auto text-center text-neutral-500 text-[14px] md:text-[15px] font-light leading-relaxed mb-6"
        >
          Engineered solutions for institutions, startups, and growing businesses.
        </motion.p>

        {/* Decorative glowing line */}
        <div className="relative z-10 flex justify-center mb-14 md:mb-18">
          <div className="w-[80px] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {services.slice(0, 6).map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
        {/* 7th card centered */}
        <div className="relative z-10 max-w-[1200px] mx-auto mt-4 md:mt-5 flex justify-center">
          <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
            <ServiceCard service={services[6]} index={6} />
          </div>
        </div>
      </section>



      {/* ─── BOTTOM CTA ─── */}
      <section ref={ctaRef} className="relative z-10 overflow-hidden border-t border-white/[0.04] min-h-[60vh] flex flex-col items-center justify-center">

        {/* ── SCROLL-TRIGGERED MOON / SEMICIRCLE GLOW ── */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          variants={glowVariants}
          initial="hidden"
          animate={glowControls}
          style={{ transformOrigin: 'bottom center' }}
        >
          {/* Perfect half circle — mobile */}
          <div className="block md:hidden">
            <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: '-160px', width: '440px', height: '320px', borderRadius: '100%', background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.45) 30%, rgba(255,255,255,0.10) 60%, transparent 75%)', filter: 'blur(24px)' }} />
          </div>

          {/* Perfect half circle — desktop */}
          <div className="hidden md:block">
            <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: '-260px', width: '1000px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.42) 28%, rgba(255,255,255,0.08) 58%, transparent 74%)', filter: 'blur(36px)' }} />
          </div>
        </motion.div>

        <div className="max-w-[900px] mx-auto px-6 py-32 md:py-40 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`text-5xl sm:text-6xl md:text-7xl text-white leading-[0.9] tracking-wide mb-8 ${serif.className}`}
          >
            Ready to <span className="italic text-white/35">build?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-neutral-500 text-base md:text-lg mb-12 font-light max-w-md mx-auto"
          >
            Let's discuss how we can bring your vision to life with the right technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] text-white text-sm font-medium tracking-wide rounded-full hover:bg-white/[0.07] transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.02)] hover:shadow-[0_0_50px_rgba(255,255,255,0.06)]"
            >
              Start a Project
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <ArrowUpRight size={16} />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}