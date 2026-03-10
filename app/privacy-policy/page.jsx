'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react'

// ----------------------------------------------------------------------
// 0. FONT LOADER
// ----------------------------------------------------------------------
const FontLoader = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
    .font-syne { font-family: 'Syne', sans-serif; }
  `}} />
)

// ----------------------------------------------------------------------
// 1. DATA: POLICY SECTIONS
// ----------------------------------------------------------------------
const policySections = [
  {
    id: "01",
    title: "Information Collection",
    icon: Eye,
    content: "We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, and company details. We also automatically collect certain technical data when you visit our site, including IP addresses and browser types, to ensure optimal performance."
  },
  {
    id: "02",
    title: "Usage of Data",
    icon: FileText,
    content: "The information we collect is used to provide, maintain, and improve our services. We use your data to communicate with you about projects, updates, and security alerts. We do not sell your personal data to third parties. Your information acts as the blueprint for our collaboration, used strictly to architect the solutions you requested."
  },
  {
    id: "03",
    title: "Data Protection",
    icon: Lock,
    content: "We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
  },
  {
    id: "04",
    title: "Third-Party Services",
    icon: Shield,
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
    <main className="bg-black min-h-screen w-full text-white font-sans selection:bg-[#D1F349] selection:text-black">
      <FontLoader />

      {/* --- NAVIGATION BAR --- */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <a href="/">
          <button className="group flex items-center gap-2 text-white hover:text-[#D1F349] transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-xs uppercase tracking-widest">Back to Home</span>
          </button>
        </a>

      </nav>

      <div ref={containerRef} className="relative pt-32 pb-20 px-6 md:px-12 max-w-[1200px] mx-auto">

        {/* --- HERO HEADER --- */}
        <motion.div
          style={{ y, opacity }}
          className="mb-24 border-b border-white/20 pb-12"
        >
          <div className="flex items-center gap-3 mb-6">

            <span className="text-white/50 font-mono text-xs uppercase tracking-[0.2em]">
              Legal Documentation
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black font-syne uppercase tracking-tighter leading-[0.9] text-white">
            Privacy <br />
            <span className="text-white/30">Protocol.</span>
          </h1>

          <div className="mt-8 flex justify-between items-end">
            <p className="text-white/60 font-mono text-sm max-w-md leading-relaxed">
              Transparency is part of our code. Below is a breakdown of how we handle, store, and protect your digital footprint.
            </p>
            <span className="hidden md:block font-mono text-xs text-[#D1F349] uppercase tracking-widest">
              Last Updated: Dec 2025
            </span>
          </div>
        </motion.div>

        {/* --- CONTENT GRID --- */}
        <div className="relative z-10 grid grid-cols-1 gap-16 md:gap-24">
          {policySections.map((section, index) => (
            <PolicyRow key={section.id} section={section} index={index} />
          ))}
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest">
            © OneZeroLabs. All Rights Reserved.
          </p>
          <a href="/contact">
            <button className="text-xs font-bold font-syne uppercase tracking-widest border-b border-white/30 pb-1 hover:text-[#D1F349] hover:border-[#D1F349] transition-colors">
              Have Questions? Contact Us
            </button>
          </a>
        </div>

      </div>
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
      className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 border-l-2 border-white/10 pl-6 md:pl-12 hover:border-[#D1F349] transition-colors duration-500"
    >
      {/* Left: ID & Title */}
      <div className="md:col-span-4 flex flex-col justify-start">
        <span className="font-mono text-[#D1F349] text-xs mb-2">0{section.id}</span>
        <h2 className="text-3xl md:text-4xl font-bold font-syne uppercase tracking-tight text-white group-hover:translate-x-2 transition-transform duration-300">
          {section.title}
        </h2>
      </div>

      {/* Right: Icon & Content */}
      <div className="md:col-span-8">
        <div className="mb-4 text-white/30 group-hover:text-white transition-colors duration-300">
          {React.createElement(section.icon, { size: 24 })}
        </div>
        <p className="text-lg text-white/70 font-sans leading-relaxed">
          {section.content}
        </p>
      </div>
    </motion.div>
  )
}