'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Band, BODY, EYEBROW, HEADING, INK, MUTED } from '@/components/ui/light-kit'

// ----------------------------------------------------------------------
// 1. DATA: POLICY SECTIONS
// ----------------------------------------------------------------------
const policySections = [
  {
    id: "01",
    title: "Information Collection",
    content: "We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, and company details. We also automatically collect certain technical data when you visit our site, including IP addresses and browser types, to ensure optimal performance."
  },
  {
    id: "02",
    title: "Usage of Data",
    content: "The information we collect is used to provide, maintain, and improve our services. We use your data to communicate with you about projects, updates, and security alerts. We do not sell your personal data to third parties. Your information acts as the blueprint for our collaboration, used strictly to architect the solutions you requested."
  },
  {
    id: "03",
    title: "Data Protection",
    content: "We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
  },
  {
    id: "04",
    title: "Third-Party Services",
    content: "Our services may contain links to third-party websites or services that are not owned or controlled by OneZeroLabs. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review the privacy policies of any third-party sites you visit."
  }
]

// ----------------------------------------------------------------------
// 2. MAIN COMPONENT
// ----------------------------------------------------------------------
export default function PrivacyPolicy() {
  const containerRef = useRef(null)

  // Parallax effect for the header
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <main className="min-h-screen w-full bg-ozl-base text-ozl-ink">
      <Band>
        <div ref={containerRef} className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-32 md:px-12 md:pt-40">

          {/* --- HERO HEADER --- */}
          <motion.div
            style={{ y, opacity }}
            className="mb-20 border-b border-[#0E1A33]/10 pb-12 md:mb-24"
          >
            <span className={`${EYEBROW} mb-6`}>Legal documentation</span>

            <h1 className={`${HEADING} text-6xl md:text-8xl`}>
              Privacy <span className="italic">Protocol.</span>
            </h1>

            <div className="mt-8 flex items-end justify-between gap-6">
              <p className={`max-w-md text-[15px] leading-relaxed ${BODY}`}>
                Transparency is part of our code. Below is a breakdown of how we handle, store, and protect your digital footprint.
              </p>
              <span className={`${EYEBROW} hidden whitespace-nowrap md:block`}>
                Last updated: Dec 2025
              </span>
            </div>
          </motion.div>

          {/* --- CONTENT GRID --- */}
          <div className="relative z-10 grid grid-cols-1 gap-14 md:gap-20">
            {policySections.map((section, index) => (
              <PolicyRow key={section.id} section={section} index={index} />
            ))}
          </div>

          {/* --- FOOTER --- */}
          <div className="mt-28 flex flex-col items-center justify-between gap-6 border-t border-[#0E1A33]/10 pt-12 md:flex-row">
            <p className={`text-xs uppercase tracking-widest ${MUTED}`}>
              © OneZeroLabs. All Rights Reserved.
            </p>
            <Link
              href="/contact"
              className={`border-b border-[#0E1A33]/20 pb-1 text-[13px] font-medium tracking-wide transition-colors hover:border-[#0E1A33]/60 ${INK}`}
            >
              Have questions? Contact us
            </Link>
          </div>

        </div>
      </Band>
    </main>
  )
}

// ----------------------------------------------------------------------
// 3. ROW COMPONENT
// ----------------------------------------------------------------------
const PolicyRow = ({ section, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group grid grid-cols-1 gap-5 border-l-2 border-[#0E1A33]/10 pl-6 transition-colors duration-500 hover:border-[#0E1A33]/40 md:grid-cols-12 md:gap-12 md:pl-12"
    >
      {/* Left: ID & Title */}
      <div className="flex flex-col justify-start md:col-span-4">
        <span className={`${EYEBROW} mb-2`}>{section.id}</span>
        <h2 className={`font-[family-name:var(--font-instrument-serif)] text-3xl tracking-wide md:text-4xl ${INK}`}>
          {section.title}
        </h2>
      </div>

      {/* Right: Content */}
      <div className="md:col-span-8">
        <p className={`text-lg leading-relaxed ${BODY}`}>
          {section.content}
        </p>
      </div>
    </motion.div>
  )
}
