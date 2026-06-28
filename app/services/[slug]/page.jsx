'use client'

import React from 'react'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { Instrument_Serif } from 'next/font/google'
import { servicesData } from '@/data/servicesData'
import ServiceApproach from '@/components/ServiceApproach'
import ServiceCta from '@/components/ServiceCta'

const seasonFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
})

export default function ServicePage({ params }) {
  const slug = params.slug
  const data = servicesData[slug]

  if (!data) {
    return notFound()
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      {/* Hero Section */}
      <section className="relative w-full pb-12">
        <div className="w-full relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0 }}
            className="relative w-full h-[60vh] md:h-[75vh] min-h-[400px] overflow-hidden flex flex-col items-center justify-center text-center px-6 pt-24"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${data.image})` }}
            />
            
            {/* Dark Overlays for readability */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
            
            {/* Content */}
            <div className="relative z-10 max-w-4xl flex flex-col items-center">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[10px] md:text-[11px] tracking-[0.4em] font-mono text-white/80 uppercase block mb-6 md:mb-8 font-semibold"
              >
                SERVICES
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`text-5xl md:text-6xl lg:text-[6rem] text-white font-normal mb-4 leading-none ${seasonFont.className}`}
              >
                {data.title}
              </motion.h1>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro & Overview Section */}
      <section className="relative w-full py-16 md:py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1000px] mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-10 md:gap-12"
          >
            <h2 className={`text-4xl md:text-5xl lg:text-6xl text-white leading-[1.15] ${seasonFont.className}`}>
              {data.hero.headline}
            </h2>
            
            <div className="pl-6 md:pl-10 border-l border-white/20 flex flex-col gap-6">
              <p className="text-xl md:text-2xl text-neutral-300 font-light leading-relaxed font-[family-name:var(--font-satoshi)]">
                {data.hero.subheadline}
              </p>
              <p className="text-lg md:text-xl text-neutral-400 leading-relaxed font-[family-name:var(--font-satoshi)]">
                {data.overview}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="relative w-full py-20 md:py-32 bg-[#050505] px-6 md:px-12 lg:px-24 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col">
          <div className="mb-16 md:mb-24">
            <h2 className={`text-4xl md:text-5xl lg:text-6xl text-white font-normal tracking-wide ${seasonFont.className}`}>
              Core <span className="text-neutral-500">Services.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {data.servicesList.map((service, index) => {
              const isLastOdd = index === data.servicesList.length - 1 && data.servicesList.length % 2 !== 0;
              
              return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className={`group relative p-8 md:p-10 rounded-[2.5rem] border border-white/5 bg-[#151515] hover:bg-[#1c1c1c] transition-all duration-500 overflow-hidden ${
                  isLastOdd ? "md:col-span-2 md:w-[calc(50%-12px)] md:justify-self-center" : "w-full"
                }`}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <span className="text-[10px] font-mono font-bold text-neutral-500 tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                    0{index + 1}
                    <div className="h-px w-6 bg-white/10 group-hover:w-12 group-hover:bg-white/30 transition-all duration-500" />
                  </span>
                  
                  <h3 className={`text-3xl md:text-4xl text-white mb-4 leading-tight group-hover:text-white transition-colors duration-500 ${seasonFont.className}`}>
                    {service.title}
                  </h3>
                  
                  <p className="text-neutral-400 text-[15px] md:text-[16px] leading-relaxed group-hover:text-neutral-300 transition-colors duration-500 mt-auto" style={{ fontFamily: "'Satoshi', 'Matter', sans-serif" }}>
                    {service.description}
                  </p>
                </div>
              </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Shared Approach Section */}
      <ServiceApproach />

      {/* CTA Section */}
      <ServiceCta text={data.ctaText} />
    </main>
  )
}
