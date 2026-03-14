'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useScroll, useTransform, useInView, useAnimation } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Instrument_Serif, Inter } from 'next/font/google'

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

// ----------------------------------------------------------------------
// DATA — UI/UX removed, Marks Management gets description note
// ----------------------------------------------------------------------
const projects = [
  {
    id: 1,
    title: "AI-Powered Academic Management Platform",
    description: "Full-stack SaaS with attendance, analytics, and AI chatbot",
    category: "Web Development",
    year: "2024",
    src: "/lms2.png",
    href: "/portfolio/LMS"
  },
  {
    id: 2,
    title: "Praasa Consultancy",
    description: "Corporate website with modern design and CMS",
    category: "Web Development",
    year: "2024",
    src: "/praasa.jpg",
    href: "https://praasaconsultancy.com/"
  },
  {
    id: 3,
    title: "Marks Management System",
    description: "Internal grading and assessment platform for institutions",
    category: "Web Development",
    year: "2024",
    src: "/iamarks.jpg",
  },
  {
    id: 4,
    title: "Samruddi Pathway",
    description: "Business consulting website with lead generation",
    category: "Web Development",
    year: "2024",
    src: "/samruddi.jpg",
    href: "https://samruddhipathwayltd.com/"
  },
  {
    id: 5,
    title: "AI-Powered Student Information Chatbot",
    description: "LLM-driven conversational interface for academic data",
    category: "LLM & Gen AI",
    year: "2025",
    src: "/llm1.jpg",
  },
  {
    id: 6,
    title: "Praasa Identity",
    description: "Brand identity and visual communication for Praasa Consultancy",
    category: "Graphic Design",
    year: "2024",
    src: "/graphic-designs/Picsart_25-03-16_18-07-44-231.jpg",
  },
  {
    id: 7,
    title: "Tech Week Poster",
    description: "Event poster design for college technology week",
    category: "Graphic Design",
    year: "2024",
    src: "/graphic-designs/Picsart_25-03-09_17-30-39-120.jpg",
  },
  {
    id: 8,
    title: "Nordic Brand",
    description: "Minimal brand identity with Nordic design language",
    category: "Graphic Design",
    year: "2024",
    src: "/graphic-designs/Picsart_25-03-01_19-03-26-625.jpg",
  },
  {
    id: 9,
    title: "Urban Typography",
    description: "Bold typographic poster series for urban culture",
    category: "Graphic Design",
    year: "2024",
    src: "/graphic-designs/Picsart_25-01-04_14-20-24-939.jpg",
  },
]

const CATEGORIES = [
  { name: "Web Development", tagline: "Scalable platforms and full-stack products" },
  { name: "LLM & Gen AI", tagline: "Intelligent systems powered by language models" },
  { name: "Graphic Design", tagline: "Brand identity, print, and visual communication" },
]

// ----------------------------------------------------------------------
// MAIN
// ----------------------------------------------------------------------
export default function WorkGrid() {
  const ctaRef = useRef(null)
  const isCtaInView = useInView(ctaRef, { once: false, margin: '-10% 0px' })
  const glowControls = useAnimation()

  React.useEffect(() => {
    if (isCtaInView) {
      glowControls.start('visible')
    } else {
      glowControls.start('hidden')
    }
  }, [isCtaInView, glowControls])

  const glowVariants = {
    hidden: {
      opacity: 0,
      y: 120,
      scale: 0.8,
    },
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
    <main className={`bg-[#050505] min-h-screen text-white selection:bg-white/20 selection:text-white ${sans.className}`}>

      {/* ============================================= */}
      {/* HERO */}
      {/* ============================================= */}
      <section className="relative max-w-[1300px] mx-auto px-6 md:px-12 pt-24 md:pt-44 pb-12 md:pb-20 text-center overflow-hidden">

        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(255,255,255,0.04)_0%,transparent_70%)] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)] rounded-full blur-[120px] pointer-events-none" />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[12px] md:text-[14px] text-neutral-500 tracking-widest uppercase mb-4 md:mb-10 font-medium relative z-10"
        >
          Portfolio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className={`text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-[-0.02em] relative z-10 mb-6 md:mb-8 ${serif.className}`}
          style={{ textShadow: '0 0 30px rgba(255,255,255,0.35), 0 0 80px rgba(255,255,255,0.15), 0 0 140px rgba(255,255,255,0.08)' }}
        >
          Our <span className="italic text-white/50">Work</span>
        </motion.h1>

      </section>

      {/* ============================================= */}
      {/* CATEGORY SECTIONS */}
      {/* ============================================= */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 pb-32">
        {CATEGORIES.map(({ name: category, tagline }) => {
          const categoryProjects = projects.filter(p => p.category === category)
          if (categoryProjects.length === 0) return null

          return (
            <section key={category} className="mb-16 md:mb-32">

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="py-4 md:py-8 border-t border-white/[0.08] mb-8 md:mb-14"
              >
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                  <h2
                    className={`text-4xl md:text-5xl text-white leading-[1.1] tracking-[-0.02em] ${serif.className}`}
                    style={{ textShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 80px rgba(255,255,255,0.08)' }}
                  >
                    {category}
                  </h2>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-neutral-500 font-light">{tagline}</p>
                    <span className="text-xs text-neutral-600 font-mono">
                      ({String(categoryProjects.length).padStart(2, '0')})
                    </span>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {categoryProjects.map((project, index) => {
                  const isFeatured = project.id === 1
                  return (
                    <div key={project.id} className={isFeatured ? "col-span-1 md:col-span-2" : ""}>
                      {isFeatured ? (
                        <HeroProjectCard project={project} index={index} />
                      ) : (
                        <ProjectCard project={project} index={index} />
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {/* ============================================= */}
      {/* CTA */}
      {/* ============================================= */}
      <section ref={ctaRef} className="relative z-10 border-t border-white/[0.05] overflow-hidden min-h-[60vh] flex flex-col items-center justify-center">

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

        <div className="max-w-[1000px] mx-auto px-6 pt-12 md:pt-16 pb-20 md:pb-36 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`text-5xl sm:text-6xl md:text-7xl text-white leading-[1.1] tracking-[-0.02em] mb-6 ${serif.className}`}
            style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}
          >
            Have a project <span className="italic text-white/50">in mind?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-base md:text-lg text-neutral-400 mb-12 font-light"
          >
            Let's turn your idea into a product people love.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
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

// ----------------------------------------------------------------------
// HERO PROJECT CARD
// ----------------------------------------------------------------------
const HeroProjectCard = ({ project, index }) => {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const isLink = !!project.href
  const Wrapper = isLink ? Link : 'div'
  const wrapperProps = isLink ? { href: project.href } : {}

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8 }}
      className={`group relative w-full mb-10 ${isLink ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <Wrapper {...wrapperProps} className="block relative z-10 w-full p-2.5 rounded-[40px] bg-[#0c0c0e] border border-white/10 transition-all duration-700 hover:border-white/[0.25] hover:shadow-[0_0_60px_rgba(255,255,255,0.05)] group/card overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-[50%] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04)_0%,transparent_70%)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="relative w-full rounded-[32px] overflow-hidden bg-[#050505] flex flex-col z-10">

          <div className="p-4 md:p-10 w-full relative z-20">
            <h3 className={`text-[32px] md:text-[54px] text-white leading-[1.05] mb-4 md:mb-6 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] ${serif.className}`}>
              {project.title}
            </h3>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
              <div className="max-w-xl">
                {project.description && (
                  <p className="text-[15px] md:text-[18px] text-white/50 font-light leading-[1.6]">
                    {project.description}
                  </p>
                )}
              </div>

              {isLink && (
                <div className="shrink-0">
                  <div className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 md:px-8 md:py-4 bg-transparent border border-white/[0.15] text-white font-medium rounded-full text-[13px] md:text-[14px] transition-all duration-500 group-hover/card:bg-white group-hover/card:text-black group-hover/card:border-white shadow-[0_0_30px_rgba(255,255,255,0)] group-hover/card:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    Explore Platform <ArrowUpRight size={18} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full relative px-3 md:px-14 pb-3 md:pb-6 overflow-hidden flex items-end justify-center min-h-[160px] md:min-h-[500px]">
            <div className="relative w-full translate-y-3">
              <img
                src={project.src}
                alt={project.title}
                className="w-full h-auto object-contain transition-transform duration-[1500ms] group-hover/card:scale-[1.02] opacity-90 group-hover/card:opacity-100 rounded-[20px] shadow-[0_0_60px_rgba(255,255,255,0.08)]"
              />
            </div>
          </div>

        </div>
      </Wrapper>
    </motion.div>
  )
}

// ----------------------------------------------------------------------
// PROJECT CARD
// ----------------------------------------------------------------------
const ProjectCard = ({ project, index }) => {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const yParallax = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

  function handleMouseMove({ clientX, clientY, currentTarget }) {
    const { left, top } = currentTarget.getBoundingClientRect()
    x.set(clientX - left)
    y.set(clientY - top)
  }

  // Graphic design cards show image only — no text below
  const isImageOnly = project.category === "Graphic Design"

  const isLink = !!project.href
  const Wrapper = isLink ? Link : 'div'
  const wrapperProps = isLink ? { href: project.href } : {}

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      className={`group relative w-full ${isLink ? 'cursor-auto md:cursor-none' : 'cursor-default'}`}
    >
      <Wrapper {...wrapperProps} className="block relative z-10 w-full h-full p-2 rounded-[32px] bg-[#0c0c0e] border border-white/10 transition-all duration-500 hover:border-white/[0.2] hover:shadow-[0_0_40px_rgba(255,255,255,0.06)] group/card">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_60%)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[32px]" />

        <div className={`relative w-full h-full rounded-[24px] overflow-hidden bg-black border border-white/[0.05] p-2 flex flex-col z-10 ${isImageOnly ? '' : 'min-h-[300px]'}`}>

          <div className={`relative overflow-hidden w-full ${isImageOnly ? 'rounded-[20px] bg-transparent flex-1 flex flex-col' : 'aspect-[4/3] md:aspect-[3/2] rounded-[20px] bg-[#050505]'}`}>

            {isImageOnly ? (
              <img
                src={project.src}
                alt={project.title}
                className="w-full h-full flex-1 object-cover transition-all duration-1000 scale-100 group-hover/card:scale-[1.02] opacity-90 group-hover/card:opacity-100 rounded-[20px]"
              />
            ) : (
              <motion.div
                style={{ y: yParallax }}
                className="absolute inset-0 h-[120%] w-full -top-[10%]"
              >
                <motion.img
                  src={project.src}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover/card:scale-110 opacity-70 group-hover/card:opacity-100 filter group-hover/card:brightness-110"
                />
              </motion.div>
            )}

            {/* Magnetic cursor — only for linked cards */}
            {isLink && (
              <motion.div
                style={{ left: mouseX, top: mouseY }}
                className="hidden md:flex absolute w-[100px] h-[100px] bg-white rounded-full items-center justify-center pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2 mix-blend-difference z-20 shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                <ArrowUpRight className="text-black w-8 h-8" />
              </motion.div>
            )}

          </div>

          {/* Text below — only for non-image-only cards */}
          {!isImageOnly && (
            <div className="px-4 py-6 bg-transparent h-full flex flex-col justify-end">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className={`text-[24px] md:text-[28px] text-white leading-[1.2] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] ${serif.className}`}>
                  {project.title}
                </h3>
                {isLink && (
                  <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] items-center justify-center flex flex-shrink-0 group-hover/card:bg-white group-hover/card:text-black transition-all duration-300">
                    <ArrowUpRight size={20} className="text-white group-hover/card:text-black transition-colors duration-300" />
                  </div>
                )}
              </div>

              {project.description && (
                <p className="text-[14px] md:text-[15px] text-white/50 font-light leading-[1.6] mb-3 max-w-[85%] group-hover/card:text-white/70 transition-colors duration-500">
                  {project.description}
                </p>
              )}
            </div>
          )}

        </div>
      </Wrapper>
    </motion.div>
  )
}