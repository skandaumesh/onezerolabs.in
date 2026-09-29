'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import CtaSection from '@/components/CtaSection'
import { Band, BODY, EYEBROW, GlassCard, HEADING, INK, MUTED } from '@/components/ui/light-kit'
import { CLIENT_NAMES, listNames } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { portfolioSchema } from '@/lib/schemas'

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
]

const CATEGORIES = [
  { name: "Web Development", tagline: "Scalable platforms and full-stack products" },
  { name: "LLM & Gen AI", tagline: "Intelligent systems powered by language models" },
]

// ----------------------------------------------------------------------
// MAIN
// ----------------------------------------------------------------------
export default function WorkGrid() {
  return (
    <main className="min-h-screen bg-ozl-base text-ozl-ink">
      <JsonLd data={portfolioSchema} />

      {/* ============================================= */}
      {/* HERO */}
      {/* ============================================= */}
      <Band className="px-6 pb-10 pt-32 text-center md:px-12 md:pb-14 md:pt-44">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`${EYEBROW} mb-5 md:mb-7`}
        >
          Portfolio
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className={`${HEADING} text-4xl md:text-6xl lg:text-7xl`}
        >
          Our <span className="italic">Work</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className={`mx-auto mt-5 max-w-2xl text-[15px] font-light leading-relaxed md:mt-6 md:text-[16px] ${BODY}`}
        >
          Websites and software we have built for clients including{' '}
          {listNames(CLIENT_NAMES)}.
        </motion.p>
      </Band>

      {/* ============================================= */}
      {/* CATEGORY SECTIONS */}
      {/* ============================================= */}
      <Band tone="grey" fadeTop fadeBottom className="px-6 pb-24 pt-12 md:px-12 md:pb-32 md:pt-16">
        <div className="mx-auto max-w-[1300px]">
          {CATEGORIES.map(({ name: category, tagline }) => {
            const categoryProjects = projects.filter(p => p.category === category)
            if (categoryProjects.length === 0) return null

            return (
              <section key={category} className="mb-16 last:mb-0 md:mb-28">

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="mb-8 border-t border-[#0E1A33]/10 py-4 md:mb-12 md:py-8"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-baseline">
                    <h2 className={`${HEADING} text-4xl md:text-5xl`}>
                      {category}
                    </h2>
                    <div className="flex items-center gap-4">
                      <p className={`text-sm font-light ${BODY}`}>{tagline}</p>
                      <span className={`font-mono text-xs ${MUTED}`}>
                        ({String(categoryProjects.length).padStart(2, '0')})
                      </span>
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                  {categoryProjects.map((project, index) => {
                    const isFeatured = project.id === 1
                    return (
                      <div key={project.id} className={isFeatured ? "col-span-1 md:col-span-2" : ""}>
                        {isFeatured ? (
                          <HeroProjectCard project={project} />
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
      </Band>

      {/* ============================================= */}
      {/* CTA */}
      {/* ============================================= */}
      <CtaSection title="Have a project in mind?" />
    </main>
  )
}

// ----------------------------------------------------------------------
// HERO PROJECT CARD
// ----------------------------------------------------------------------
const HeroProjectCard = ({ project }) => {
  const isLink = !!project.href
  const linkProps = isLink ? { as: Link, href: project.href } : {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8 }}
      className={`relative mb-4 w-full md:mb-6 ${isLink ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <GlassCard {...linkProps} interactive={isLink} innerClassName="flex flex-col">
        <div className="relative z-20 w-full p-5 md:p-10">
          <h3 className={`mb-4 font-[family-name:var(--font-instrument-serif)] text-[32px] leading-[1.05] md:mb-6 md:text-[54px] ${INK}`}>
            {project.title}
          </h3>

          <div className="flex flex-col justify-between gap-6 md:gap-8 lg:flex-row lg:items-end">
            <div className="max-w-xl">
              {project.description && (
                <p className={`text-[15px] font-light leading-[1.6] md:text-[18px] ${BODY}`}>
                  {project.description}
                </p>
              )}
            </div>

            {isLink && (
              <div className="shrink-0">
                <div className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#0E1A33]/15 bg-white/70 px-7 py-3.5 text-[13px] font-medium text-[#0E1A33] transition-all duration-500 group-hover:border-[#1E293B] group-hover:bg-[#1E293B] group-hover:text-white md:px-8 md:py-4 md:text-[14px]">
                  Explore Platform <ArrowUpRight size={18} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative flex min-h-[160px] w-full items-end justify-center overflow-hidden px-3 pb-3 md:min-h-[500px] md:px-14 md:pb-6">
          <div className="relative w-full translate-y-3">
            <img
              src={project.src}
              alt={project.title}
              className="h-auto w-full rounded-[20px] object-contain shadow-[0_24px_60px_-28px_rgba(15,23,42,0.35)] transition-transform duration-[1500ms] group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </GlassCard>
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
  const linkProps = isLink ? { as: Link, href: project.href } : {}

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      className={`relative h-full w-full ${isLink ? 'cursor-auto md:cursor-none' : 'cursor-default'}`}
    >
      <GlassCard {...linkProps} interactive={isLink} className="h-full" innerClassName={`flex flex-col p-2 ${isImageOnly ? '' : 'min-h-[300px]'}`}>

        {/* shrink-0: as a flex item the frame was being squeezed below its
            aspect ratio, leaving the image a strip with empty card under it. */}
        <div className={`relative w-full overflow-hidden ${isImageOnly ? 'flex flex-1 flex-col rounded-[20px]' : 'aspect-[4/3] shrink-0 rounded-[20px] bg-[#ECEFF4] md:aspect-[3/2]'}`}>

          {isImageOnly ? (
            <img
              src={project.src}
              alt={project.title}
              className="h-full w-full flex-1 rounded-[20px] object-cover transition-all duration-1000 group-hover:scale-[1.02]"
            />
          ) : (
            <motion.div
              style={{ y: yParallax }}
              className="absolute inset-0 -top-[10%] h-[120%] w-full"
            >
              <img
                src={project.src}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </motion.div>
          )}

          {/* Magnetic cursor — only for linked cards */}
          {isLink && (
            <motion.div
              style={{ left: mouseX, top: mouseY }}
              className="pointer-events-none absolute z-20 hidden h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#1E293B]/90 opacity-0 shadow-[0_12px_30px_-10px_rgba(15,23,42,0.5)] backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 md:flex"
            >
              <ArrowUpRight className="h-8 w-8 text-white" />
            </motion.div>
          )}

        </div>

        {/* Text below — only for non-image-only cards */}
        {!isImageOnly && (
          <div className="flex h-full flex-col justify-end px-4 py-6">
            <div className="mb-2 flex items-start justify-between gap-4">
              <h3 className={`font-[family-name:var(--font-instrument-serif)] text-[24px] leading-[1.2] md:text-[28px] ${INK}`}>
                {project.title}
              </h3>
              {isLink && (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#0E1A33]/10 bg-white/70 text-[#0E1A33] transition-all duration-300 group-hover:border-[#1E293B] group-hover:bg-[#1E293B] group-hover:text-white">
                  <ArrowUpRight size={20} />
                </div>
              )}
            </div>

            {project.description && (
              <p className={`mb-3 max-w-[85%] text-[14px] font-light leading-[1.6] md:text-[15px] ${BODY}`}>
                {project.description}
              </p>
            )}
          </div>
        )}
      </GlassCard>
    </motion.div>
  )
}
