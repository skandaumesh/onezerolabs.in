"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const stats = [
  { value: "1", label: "Unified Platform" },
  { value: "3", label: "Core Portals" },
  { value: "17", label: "API modules" },
  { value: "99.9%", label: "Uptime" },
]

const features = [
  "AI-powered NLP chatbot — Groq pipeline with MongoDB query generation",
  "FCM push notifications for parent alerts",
  "Biometric attendance integration (eSSL push model)",
  "JWT auth with jwtVersion invalidation for secure password resets",
  "Published on Google Play Store via Capacitor"
]

export default function SaameSpotlight() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-[#0d0d0d] text-white px-6 md:px-12 lg:px-24 border-y border-white/10">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1000px] mx-auto w-full flex flex-col items-center text-center"
      >
        
        {/* Caption */}
        <span className="text-[11px] md:text-xs tracking-widest text-white/50 uppercase block mb-6">
          CASE STUDY · FLAGSHIP PRODUCT
        </span>
        
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-8 font-[family-name:var(--font-instrument-serif)]">
          The platform that started it all.
        </h2>
        
        {/* Body */}
        <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-3xl mb-16 font-normal">
          SAAME — Smart Attendance & Academic Management Ecosystem — is a production institutional platform built for MLA Academy of Higher Learning, Bengaluru. What began as a viral social app during our founder's BCA final year evolved into a fully-fledged institutional system and OneZeroLabs' first flagship product. It is now a blueprint for how we build at scale.
        </p>
        
        {/* Stats Row */}
        <div className="w-full flex flex-wrap md:flex-nowrap justify-between gap-y-12 gap-x-4 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center w-[45%] md:w-1/4 relative">
              <span className="text-4xl md:text-5xl text-white mb-2 font-[family-name:var(--font-instrument-serif)]">
                {stat.value}
              </span>
              <span className="text-[11px] md:text-xs tracking-wider text-white/40 uppercase">
                {stat.label}
              </span>
              {/* Dividers */}
              {index < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/10" />
              )}
            </div>
          ))}
        </div>
        
        {/* Features List */}
        <div className="w-full max-w-2xl bg-black/50 border border-white/10 p-8 md:p-10 text-left mb-16">
          <ul className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start text-white/70 text-sm md:text-base leading-relaxed">
                <span className="mr-3 text-white/30">·</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* CTA */}
        <Link 
          href="/work/saame"
          className="text-white/40 text-sm md:text-base tracking-wide hover:text-white/70 transition-colors"
        >
          Full case study coming soon →
        </Link>

      </motion.div>
    </section>
  )
}
