'use client'

import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Instrument_Serif } from 'next/font/google'
import { productsData } from '@/data/productsData'
import ServiceCta from '@/components/ServiceCta'

const seasonFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
})

export default function ProductPage({ params }) {
  const data = productsData[params.slug];
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  if (!data) {
    notFound();
  }

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      {/* 1. Hero Section */}
      <section className="relative w-full pb-12">
        <div className="w-full relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0 }}
            className="relative w-full min-h-[60vh] md:min-h-[75vh] overflow-hidden flex flex-col items-center justify-center text-center px-6 pt-36 pb-12"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${data.image})` }}
            />
            
            {/* Dark Overlays for readability */}
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

            {/* Content */}
            <div className="relative z-10 max-w-4xl flex flex-col items-center w-full">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[10px] md:text-[11px] tracking-[0.4em] font-mono text-white/80 uppercase block mb-6 md:mb-8 font-semibold"
              >
                {data.title}
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`text-4xl md:text-5xl lg:text-6xl max-w-5xl text-white font-normal mb-8 leading-tight ${seasonFont.className}`}
              >
                {data.hero.headline}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl lg:text-2xl text-neutral-300 font-light max-w-3xl leading-relaxed font-[family-name:var(--font-satoshi)] mb-8"
              >
                {data.hero.subheadline}
              </motion.p>
              
              {data.hero.badge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-sm md:text-base font-[family-name:var(--font-satoshi)]"
                >
                  {data.hero.badge}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Metrics Bar */}
      {data.metrics && data.metrics.length > 0 && (
        <section className="relative w-full pb-16 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full pt-12 border-t border-white/10">
              {data.metrics.map((metric, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <span className={`text-4xl md:text-5xl text-white mb-2 ${seasonFont.className}`}>
                    {metric.value}
                  </span>
                  <span className="text-base md:text-lg text-white font-medium mb-2 font-[family-name:var(--font-satoshi)]">
                    {metric.label}
                  </span>
                  <span className="text-sm md:text-[15px] font-[family-name:var(--font-satoshi)] text-neutral-500">
                    {metric.description}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. The Problem Section */}
      {data.problem && (
        <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#050505] border-y border-white/5">
          <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/2 flex flex-col gap-6"
            >
              <span className="text-[11px] md:text-xs font-mono font-bold text-red-500/80 tracking-[0.2em] uppercase block">
                THE PROBLEM
              </span>
              <h2 className={`text-4xl md:text-5xl lg:text-6xl text-white leading-tight ${seasonFont.className}`}>
                {data.problem.headline}
              </h2>
              <p className="text-xl text-neutral-400 font-light font-[family-name:var(--font-satoshi)]">
                {data.problem.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {data.problem.painPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-red-500/80 text-lg">✕</span>
                    <span className="text-neutral-300 font-[family-name:var(--font-satoshi)]">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/2 bg-[#111] p-10 rounded-3xl border border-white/10"
            >
              <h3 className={`text-2xl text-white mb-6 ${seasonFont.className}`}>This Creates:</h3>
              <div className="flex flex-col gap-4 mb-10">
                {data.problem.consequences.map((cons, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-xl text-neutral-300 font-[family-name:var(--font-satoshi)] flex items-center gap-3 border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                    {cons}
                  </div>
                ))}
              </div>
              <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <p className="text-lg text-white font-medium font-[family-name:var(--font-satoshi)] leading-relaxed">
                  {data.problem.solution}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 4. The Ecosystem Apps */}
      {data.ecosystemApps && data.ecosystemApps.length > 0 && (
        <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto w-full">
            {data.ecosystemIntro && (
              <div className="text-center mb-20">
                <h2 className={`text-5xl md:text-6xl text-white mb-6 ${seasonFont.className}`}>
                  {data.ecosystemIntro.headline}
                </h2>
                <p className="text-xl text-neutral-400 font-light max-w-2xl mx-auto font-[family-name:var(--font-satoshi)]">
                  {data.ecosystemIntro.subheadline}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-12 w-full">
              {data.ecosystemApps.map((app, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className="w-full p-8 md:p-12 lg:p-16 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] flex flex-col md:flex-row gap-12 md:gap-20 items-center overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  <div className="w-full md:w-5/12 flex flex-col relative z-10">
                    <span className="text-[11px] font-mono font-bold text-neutral-500 tracking-[0.2em] uppercase mb-4">
                      {app.title}
                    </span>
                    <h3 className={`text-4xl lg:text-5xl text-white mb-6 leading-tight ${seasonFont.className}`}>
                      {app.tagline}
                    </h3>
                    <p className="text-lg text-neutral-400 leading-relaxed font-[family-name:var(--font-satoshi)] mb-8">
                      {app.description}
                    </p>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-base text-neutral-300 italic font-[family-name:var(--font-satoshi)]">
                        "{app.benefits}"
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-7/12 relative z-10">
                    <h4 className="text-sm font-mono font-bold text-white uppercase mb-6 tracking-wider">Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                      {app.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-neutral-300 font-[family-name:var(--font-satoshi)]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Screenshots Gallery */}
      {data.screenshots && data.screenshots.length > 0 && (
        <section className="relative w-full py-20 bg-[#050505] border-y border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-12">
            <h2 className={`text-4xl md:text-5xl text-white ${seasonFont.className}`}>
              See SAAME in Action
            </h2>
          </div>
          {/* Horizontal scrolling gallery setup */}
          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex gap-6 overflow-x-auto pb-8 px-6 md:px-12 lg:px-24 hide-scrollbar items-center ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab snap-x snap-mandatory scroll-smooth'}`}
          >
            {data.screenshots.map((shot, idx) => {
              const isDesktop = shot.type === 'desktop' || idx === 0; // Fallback to desktop for first if type is missing
              
              return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex-shrink-0 snap-center flex flex-col gap-4"
              >
                <div className={`h-[350px] md:h-[450px] lg:h-[500px] ${isDesktop ? 'aspect-[16/10]' : 'aspect-[9/16]'} rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center overflow-hidden relative select-none`}>
                  {shot.image ? (
                    <img 
                      src={shot.image} 
                      alt={shot.label} 
                      className="w-full h-full object-cover pointer-events-none" 
                      draggable={false}
                    />
                  ) : (
                    <div className="text-neutral-600 font-mono text-sm tracking-widest uppercase">
                      [UI: {shot.label}]
                    </div>
                  )}
                </div>
                <span className="text-neutral-400 font-[family-name:var(--font-satoshi)] text-center text-sm uppercase tracking-wider">
                  {shot.label}
                </span>
              </motion.div>
            )})}
          </div>
        </section>
      )}

      {/* 6. Everything Your Institution Needs (Capabilities) */}
      {data.capabilities && data.capabilities.length > 0 && (
        <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className={`text-4xl md:text-5xl lg:text-6xl text-white mb-6 ${seasonFont.className}`}>
                {data.capabilitiesHeadline || "Core Capabilities"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.capabilities.map((cap, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-colors"
                >
                  <h3 className={`text-2xl text-white mb-4 ${seasonFont.className}`}>
                    {cap.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed font-[family-name:var(--font-satoshi)]">
                    {cap.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Why Institutions Choose SAAME */}
      {data.whyChoose && data.whyChoose.length > 0 && (
        <section className="relative w-full py-24 bg-white text-black px-6 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto w-full">
            <div className="mb-16">
              <span className="text-[11px] md:text-xs font-mono font-bold text-black/50 tracking-[0.2em] uppercase block mb-4">
                THE DIFFERENCE
              </span>
              <h2 className={`text-4xl md:text-5xl lg:text-6xl text-black ${seasonFont.className}`}>
                Why Institutions Choose SAAME
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {data.whyChoose.map((reason, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col gap-4"
                >
                  <h3 className={`text-3xl text-black ${seasonFont.className}`}>
                    {reason.title}
                  </h3>
                  <p className="text-lg text-black/70 font-[family-name:var(--font-satoshi)] leading-relaxed">
                    {reason.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Implementation Process */}
      {data.implementation && data.implementation.length > 0 && (
        <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-black">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-20">
              <h2 className={`text-4xl md:text-5xl lg:text-6xl text-white mb-6 ${seasonFont.className}`}>
                How Implementation Works
              </h2>
            </div>
            
            <div className="flex flex-col gap-8 relative">
              <div className="absolute left-6 md:left-[3.25rem] top-0 bottom-0 w-px bg-white/10" />
              {data.implementation.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-center gap-6 md:gap-10 relative z-10"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#111] border border-white/20 flex items-center justify-center flex-shrink-0 text-white font-mono text-sm md:text-base font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl w-full">
                    <h3 className={`text-2xl text-white md:w-1/3 ${seasonFont.className}`}>
                      {step.title}
                    </h3>
                    <p className="text-neutral-400 font-[family-name:var(--font-satoshi)] md:w-2/3">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Trust Section */}
      {data.trust && (
        <section className="relative w-full py-24 bg-[#050505] px-6 md:px-12 lg:px-24 border-y border-white/5 text-center">
          <div className="max-w-4xl mx-auto w-full">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl text-white mb-8 leading-tight ${seasonFont.className}`}>
              {data.trust.headline}
            </h2>
            <p className="text-xl text-neutral-400 font-light leading-relaxed font-[family-name:var(--font-satoshi)]">
              {data.trust.description}
            </p>
          </div>
        </section>
      )}

      {/* 10. Perfect For */}
      {data.perfectFor && data.perfectFor.length > 0 && (
        <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-black">
          <div className="max-w-5xl mx-auto w-full text-center">
            <span className="text-[11px] md:text-xs font-mono font-bold text-neutral-500 tracking-[0.2em] uppercase block mb-12">
              PERFECT FOR
            </span>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-8">
              {data.perfectFor.map((audience, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`text-3xl md:text-5xl lg:text-6xl text-neutral-300 hover:text-white transition-colors cursor-default ${seasonFont.className}`}
                >
                  {audience}
                  {idx !== data.perfectFor.length - 1 && (
                    <span className="text-white/20 ml-6 md:ml-10 font-sans font-light text-2xl md:text-4xl">/</span>
                  )}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. The Future of Educational Operations */}
      {data.future && (
        <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] border-t border-white/10">
          <div className="max-w-4xl mx-auto w-full">
            <h2 className={`text-4xl md:text-5xl lg:text-6xl text-white mb-10 ${seasonFont.className}`}>
              {data.future.headline}
            </h2>
            <div className="flex flex-col gap-6 pl-6 md:pl-10 border-l border-white/20">
              {data.future.paragraphs.map((para, idx) => (
                <p key={idx} className="text-xl md:text-2xl text-neutral-300 font-light leading-relaxed font-[family-name:var(--font-satoshi)]">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 12. CTA Section */}
      <div className="relative z-20 bg-black">
        <ServiceCta title={data.ctaText} />
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
