'use client'

import { motion, useInView, useAnimation } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Instrument_Serif, Inter } from 'next/font/google'
import NavbarResponsive from '@/components/Navbar'

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
})

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  adjustFontFallback: false,
})

const founders = [
  { name: 'Skanda Umesh', role: 'Founder', img: '/founder.jpg' },
  { name: 'Praveen Kumar', role: 'Co-Founder', img: '/cofounder.jpg' },
  { name: 'Tanisha Karve', role: 'Operations & Strategy', img: '/lead.jpg' },
]

export default function AboutPage() {
  const ctaRef = useRef(null)
  const isInView = useInView(ctaRef, { once: false, margin: '-10% 0px' })
  const glowControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      glowControls.start('visible')
    } else {
      glowControls.start('hidden')
    }
  }, [isInView, glowControls])

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
    <main className={`bg-[#050505] text-white min-h-screen selection:bg-white/20 selection:text-white ${sans.className}`}>

      <NavbarResponsive />

      {/* MANIFESTO BLOCKS */}
      <section className="relative w-full overflow-hidden px-4 md:px-8 pb-40 pt-40 md:pt-48 flex justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[150vw] sm:w-[1200px] h-[1200px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12)_0%,rgba(147,51,234,0.08)_30%,transparent_65%)] pointer-events-none blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full max-w-[1000px] bg-[#0c0c0e]/80 backdrop-blur-2xl border border-white/20 rounded-[40px] md:rounded-[64px] p-8 md:p-16 lg:p-24 shadow-[0_0_60px_rgba(255,255,255,0.08),inset_0_0_15px_rgba(255,255,255,0.05)] overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="flex justify-center mb-8 md:mb-12">
            <div className="relative w-28 h-28 md:w-32 md:h-32 opacity-80">
              <Image src="/logo.png" alt="OneZeroLabs Logo" fill className="object-contain" />
            </div>
          </div>

          <div className="flex flex-col gap-24 md:gap-32 w-full max-w-[800px] mx-auto text-center">

            <div className="w-full">
              <h2 className={`text-4xl sm:text-5xl lg:text-[56px] text-white leading-tight mb-8 tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${serif.className}`}>
                Building the Infrastructure Behind Growth
              </h2>
              <div className="text-neutral-300 text-[17px] sm:text-[19px] leading-[1.8] font-light space-y-6">
                <p>Organizations today don't struggle because they lack tools. They struggle because their systems are disconnected.</p>
                <p>Marketing operates separately from operations. Data lives in multiple places. Teams rely on manual processes. Growth becomes difficult because the infrastructure supporting the business isn't designed to scale.</p>
                <p>OneZeroLabs was founded to solve this problem. We help organizations build the systems, technology, and digital infrastructure required to operate efficiently, make better decisions, and grow with confidence.</p>
              </div>
            </div>

            <div className="w-full">
              <h2 className={`text-4xl sm:text-5xl lg:text-[56px] text-white leading-tight mb-8 tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${serif.className}`}>
                What We Do
              </h2>
              <div className="text-neutral-300 text-[17px] sm:text-[19px] leading-[1.8] font-light space-y-6 flex flex-col items-center">
                <p>OneZeroLabs works at the intersection of technology, operations, automation, and growth. We design and build:</p>
                <div className="text-left w-fit space-y-1 my-2">
                  <p>• Digital Platforms</p>
                  <p>• Business Websites</p>
                  <p>• Internal Systems</p>
                  <p>• AI & Automation Workflows</p>
                  <p>• Analytics Dashboards</p>
                  <p>• Operational Infrastructure</p>
                  <p>• Brand & Growth Systems</p>
                </div>
                <p>Our goal is simple: Create systems that help organizations work smarter, move faster, and scale sustainably.</p>
              </div>
            </div>

            <div className="w-full">
              <h2 className={`text-4xl sm:text-5xl lg:text-[56px] text-white leading-tight mb-8 tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${serif.className}`}>
                How We Think
              </h2>
              <div className="text-neutral-300 text-[17px] sm:text-[19px] leading-[1.8] font-light space-y-6">
                <p>Technology alone doesn't solve problems.</p>
                <p>A beautiful website won't fix broken processes. An AI tool won't improve operations without the right workflows. A dashboard won't create growth without meaningful insights.</p>
                <p>That's why we focus on the entire system. Every solution we build is designed to support real business outcomes, not just deliver features.</p>
              </div>
            </div>

            <div className="w-full">
              <h2 className={`text-4xl sm:text-5xl lg:text-[56px] text-white leading-tight mb-8 tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${serif.className}`}>
                Our Approach
              </h2>
              <div className="text-neutral-300 text-[17px] sm:text-[19px] leading-[1.8] font-light space-y-6">
                <p><strong>Discover:</strong> Understand the organization, challenges, and opportunities.</p>
                <p><strong>Design:</strong> Create systems and strategies tailored to specific goals.</p>
                <p><strong>Build:</strong> Develop the technology, workflows, and infrastructure required.</p>
                <p><strong>Optimize:</strong> Continuously improve performance through data and iteration.</p>
              </div>
            </div>

            <div className="w-full">
              <h2 className={`text-4xl sm:text-5xl lg:text-[56px] text-white leading-tight mb-8 tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${serif.className}`}>
                Our Work
              </h2>
              <div className="text-neutral-300 text-[17px] sm:text-[19px] leading-[1.8] font-light space-y-6 flex flex-col items-center">
                <p>From educational institutions and startups to growing organizations, we help clients build the foundations that support long-term growth.</p>
                <div className="text-left w-fit space-y-1 my-2">
                  <p>• Educational Operations Platforms</p>
                  <p>• Parent & Student Portals</p>
                  <p>• Business Websites</p>
                  <p>• AI Automation Systems</p>
                  <p>• Analytics Platforms</p>
                  <p>• Operational Dashboards</p>
                  <p>• Community Platforms</p>
                </div>
              </div>
            </div>

            <div className="w-full">
              <h2 className={`text-4xl sm:text-5xl lg:text-[56px] text-white leading-tight mb-8 tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${serif.className}`}>
                Our Vision & Mission
              </h2>
              <div className="text-neutral-300 text-[17px] sm:text-[19px] leading-[1.8] font-light space-y-6">
                <p><strong>Vision:</strong> To become the trusted infrastructure partner behind the next generation of ambitious organizations.</p>
                <p><strong>Mission:</strong> To help organizations build scalable systems that improve how they operate, grow, and serve their communities.</p>
              </div>
            </div>

            <div className="w-full">
              <h2 className={`text-4xl sm:text-5xl lg:text-[56px] text-white leading-tight mb-8 tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${serif.className}`}>
                Built by Builders
              </h2>
              <div className="text-neutral-300 text-[17px] sm:text-[19px] leading-[1.8] font-light space-y-6">
                <p>OneZeroLabs is led by people who actively design, develop, and deploy the systems they recommend.</p>
                <p>We believe the best solutions come from understanding both strategy and execution. Every project is approached with a focus on long-term value, operational clarity, and measurable impact.</p>
              </div>
            </div>

            <div className="w-full">
              <h2 className={`text-4xl sm:text-5xl lg:text-[56px] text-white leading-tight mb-8 tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${serif.className}`}>
                The Future
              </h2>
              <div className="text-neutral-300 text-[17px] sm:text-[19px] leading-[1.8] font-light space-y-6">
                <p>As organizations become increasingly digital, the need for connected systems, intelligent workflows, and scalable infrastructure will only grow.</p>
                <p>OneZeroLabs exists to help organizations navigate that future with confidence.</p>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* FOUNDERS */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 pb-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[600px] bg-[radial-gradient(ellipse,rgba(255,255,255,0.03)_0%,transparent_60%)] pointer-events-none mix-blend-screen -z-10" />

        <div className="mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className={`text-5xl md:text-6xl text-white leading-tight tracking-wide text-center md:text-left drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${serif.className}`}>
              The People Behind <span className="italic text-white/50">OneZeroLabs</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12 max-w-[1050px] mx-auto">
          {founders.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, scale: 0.7, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-[32px] border border-white/10 bg-[#08080a] p-3 transition-all duration-500 hover:border-white/20 overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.02)] hover:shadow-[0_0_50px_rgba(255,255,255,0.08)] max-w-[340px] sm:max-w-none mx-auto w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-white/5 mb-6">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#08080a] via-transparent to-transparent opacity-60" />
                <Image
                  src={f.img}
                  alt={f.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
              </div>
              <div className="px-4 pb-5 text-center relative z-10">
                <p className={`text-2xl text-white tracking-wide group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-500 ${serif.className}`}>{f.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
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

        <div className="max-w-[860px] mx-auto px-6 py-40 text-center relative z-10 mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`text-5xl sm:text-6xl md:text-7xl text-white leading-[0.9] tracking-wide mb-12 ${serif.className}`}
          >
            Build the <span className="italic text-white/50">future</span> with
            <br />OneZeroLabs.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/20 text-white text-sm font-medium tracking-wide rounded-full hover:bg-white/10 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]"
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