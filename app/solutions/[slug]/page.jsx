'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Instrument_Serif } from 'next/font/google'
import { solutionsData } from '@/data/solutionsData'
import ServiceCta from '@/components/ServiceCta'

const seasonFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
})

export default function SolutionPage({ params }) {
  const data = solutionsData[params.slug];

  if (!data) {
    notFound();
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
                SOLUTIONS
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

      {/* Intro Section */}
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Common Challenges */}
      <section className="relative w-full py-20 px-6 md:px-12 lg:px-24 bg-[#050505]">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-16">
            <span className="text-[11px] md:text-xs font-mono font-bold text-red-500/80 tracking-[0.2em] uppercase block mb-4">
              THE FRICTION
            </span>
            <h2 className={`text-4xl md:text-5xl text-white mb-6 ${seasonFont.className}`}>
              Common Challenges
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.commonChallenges.map((challenge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 md:p-8 rounded-2xl border border-white/5 bg-[#0a0a0a] flex items-start gap-4"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-2.5 flex-shrink-0" />
                <p className="text-lg text-neutral-300 leading-relaxed font-[family-name:var(--font-satoshi)]">
                  {challenge}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-16">
            <span className="text-[11px] md:text-xs font-mono font-bold text-neutral-500 tracking-[0.2em] uppercase block mb-4">
              OUR EXPERTISE
            </span>
            <h2 className={`text-4xl md:text-5xl text-white mb-6 ${seasonFont.className}`}>
              How We Help
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {data.howWeHelp.map((service, index) => {
              const isLastOdd = index === data.howWeHelp.length - 1 && data.howWeHelp.length % 2 !== 0;
              
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
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <span className="text-[10px] md:text-[11px] font-mono font-bold text-neutral-500 tracking-[0.2em] uppercase mb-4">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`text-3xl md:text-4xl text-white mb-4 leading-none ${seasonFont.className}`}>
                    {service.title}
                  </h3>
                  <p className="text-lg text-neutral-400 font-light leading-relaxed mt-auto font-[family-name:var(--font-satoshi)]">
                    {service.description}
                  </p>
                </div>
              </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* What We Build (Checkmarks) */}
      <section className="relative w-full py-24 px-6 md:px-12 lg:px-24 bg-[#050505]">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl text-white mb-6 ${seasonFont.className}`}>
              What We Build
            </h2>
            <p className="text-xl text-neutral-400 font-[family-name:var(--font-satoshi)] max-w-2xl mx-auto">
              Tangible deliverables tailored precisely for {data.title.toLowerCase()}.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {data.deliverables.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-lg md:text-xl text-white font-[family-name:var(--font-satoshi)] font-medium">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal Clients */}
      <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto w-full text-center">
          <span className="text-[11px] md:text-xs font-mono font-bold text-neutral-500 tracking-[0.2em] uppercase block mb-8">
            WHO WE WORK WITH
          </span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-6">
            {data.idealClients.map((client, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`text-2xl md:text-4xl text-neutral-300 hover:text-white transition-colors cursor-default ${seasonFont.className}`}
              >
                {client}
                {idx !== data.idealClients.length - 1 && (
                  <span className="text-white/20 ml-6 md:ml-10 font-sans font-light">/</span>
                )}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="relative z-20 bg-black">
        <ServiceCta title={data.ctaText} />
      </div>
    </main>
  );
}
