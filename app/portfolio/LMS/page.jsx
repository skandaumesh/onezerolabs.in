'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
   Layers,
   MessageCircle,
   FileSpreadsheet,
   Database,
   Repeat,
   Bot,
   Edit,
   ChevronDown,
   UserCheck,
   Wifi,
   ArrowUpRight,
   Sparkles,
   ShieldCheck,
   Cpu,
   Zap,
   Globe,
   Server,
   Lock,
   BarChart3,
   Clock,
   Wallet,
   CheckCircle2
} from 'lucide-react'
import { Instrument_Serif, Inter } from 'next/font/google'

const serif = Instrument_Serif({
   subsets: ['latin'],
   weight: '400',
   style: ['normal', 'italic'],
   display: 'swap',
})

const sans = Inter({
   subsets: ['latin'],
   weight: ['300', '400', '500', '600', '700'],
   display: 'swap',
})

export default function LmsProjectPage() {
   const containerRef = useRef(null)
   const { scrollYProgress } = useScroll({ target: containerRef })

   // Parallax for Hero
   const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05])
   const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
   const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])

   const teachingFeatures = [
      { icon: Zap, title: "0.1s Zero Latency", text: "Proprietary 'Stale-While-Revalidate' architecture for instant marking." },
      { icon: Wifi, title: "Offline-First", text: "Mark attendance without internet; auto-syncs when back online." },
      { icon: Cpu, title: "Smart Subject Logic", text: "Auto-filters Core, Electives, and Languages by stream/semester." },
      { icon: Bot, title: "Cognitive AI Assistant", text: "Query student data using natural language directly in the app." }
   ]

   const adminFeatures = [
      {
         title: "Excel-Style Inline Editing",
         icon: FileSpreadsheet,
         desc: "Modify batch data (Names, Streams) instantly without forms."
      },
      {
         title: "Automated batch Promotion",
         icon: Repeat,
         desc: "One-click semester batch transfer with 100% logic accuracy."
      },
      {
         title: "Compliance Reporting",
         icon: BarChart3,
         desc: "Inspection-ready PDF/Excel exports for NAAC and NBA audits."
      },
      {
         title: "Advanced Filtering",
         icon: Layers,
         desc: "Slice data by Stream, Language, or Active Status in real-time."
      },
      {
         title: "WhatsApp Logic",
         icon: MessageCircle,
         desc: "Automated absenteeism triggers sent to parent mobile devices."
      },
      {
         title: "Enterprise Security",
         icon: ShieldCheck,
         desc: "Firebase Auth, reCAPTCHA v3, and Nginx rate-limiting middleware."
      }
   ]

   return (
      <main ref={containerRef} className={`bg-[#050505] min-h-screen text-white selection:bg-white/20 selection:text-white overflow-x-hidden pb-20 ${sans.className}`}>

         {/* --- GLOBAL GLOW --- */}
         <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/[0.03] blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/[0.02] blur-[120px] rounded-full" />
         </div>

         {/* --- 1. HERO SECTION --- */}
         <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-24 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[70vh] bg-gradient-to-b from-white/10 via-white/[0.02] to-transparent blur-[120px] pointer-events-none opacity-50"></div>

            <motion.div
               style={{ opacity: heroOpacity }}
               className="text-center relative z-10 max-w-5xl mx-auto mb-16 md:mb-24 w-full"
            >
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
               >
               </motion.div>

               <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className={`text-6xl sm:text-8xl md:text-9xl font-normal tracking-tight text-white mb-8 leading-[0.85] ${serif.className}`}
                  style={{ textShadow: '0 0 50px rgba(255,255,255,0.2)' }}
               >
                  Smart Academic <br /> <span className="italic text-white/40">Ecosystem.</span>
               </motion.h1>

               <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="text-base md:text-xl text-white/40 max-w-2xl mx-auto px-4 font-light leading-relaxed"
               >
                  An enterprise-grade digital core digitizing critical academic workflows through <span className="text-white/80">Hybrid Cloud Architecture</span> and <span className="text-white/80">Generative AI.</span>
               </motion.p>
            </motion.div>

            {/* THE MAIN UI DISPLAY */}
            <motion.div
               style={{ scale: heroScale }}
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 1.2, delay: 0.5, type: "spring", bounce: 0.1 }}
               className="relative w-full max-w-[1000px] mx-auto px-4"
            >
               <div className="relative group p-2 rounded-[48px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl shadow-[0_0_100px_rgba(255,255,255,0.05)] overflow-hidden">
                  <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-[40px] overflow-hidden bg-[#000] border border-white/10 flex items-end justify-center">
                     <motion.img
                        style={{ y: yParallax }}
                        src="/lms2.png"
                        alt="SAAME Dashboard UI"
                        className="w-[85%] h-[85%] object-contain object-bottom rounded-t-[48px] opacity-90 transition-all duration-1000 group-hover:scale-[1.02] group-hover:opacity-100 grayscale hover:grayscale-0 relative z-10"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  </div>
               </div>
               <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[70%] h-[120px] bg-white/10 blur-[100px] -z-10 rounded-full opacity-30"></div>
            </motion.div>
         </section>

         {/* --- 2. THE TEACHING MODULE --- */}
         <section className="py-32 px-4 md:px-12 relative z-10 border-t border-white/[0.03]">
            <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-center">
                  <div>
                     <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-white/30 mb-8 block">01 / MOBILE CAPABILITY</span>
                     <h2 className={`text-5xl md:text-8xl font-normal mb-8 text-white leading-[0.9] ${serif.className}`}>
                        Native App <br /> <span className="italic text-white/30">Architecture.</span>
                     </h2>
                     <p className="text-white/40 text-lg md:text-xl leading-relaxed mb-10 font-light">
                        Designed for speed and reliability, the <span className="text-white/80">SAAME Teacher APK</span> provides faculty with zero-latency tools that function perfectly in network dead zones.
                     </p>
                     <div className="flex flex-wrap gap-4">
                        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-mono uppercase tracking-widest text-white/60">Android APK</div>
                        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-mono uppercase tracking-widest text-white/60">Offline-First</div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {teachingFeatures.map((item, i) => (
                        <div key={i} className="group p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-700">
                           <item.icon size={28} className="text-white/80 mb-8 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                           <h3 className={`text-2xl font-normal mb-4 text-white ${serif.className}`}>{item.title}</h3>
                           <p className="text-sm text-white/30 leading-relaxed font-light">{item.text}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* --- 3. THE ADMIN COMMAND CENTER --- */}
         <section className="py-32 px-4 md:px-12 relative z-10 bg-white/[0.01] border-y border-white/[0.03]">
            <div className="max-w-7xl mx-auto">
               <div className="text-center mb-28">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-white/30 mb-8 block">02 / COMMAND CENTER</span>
                  <h2 className={`text-6xl md:text-9xl font-normal leading-none mb-10 text-white ${serif.className}`}>
                     Central <span className="italic text-white/40">Command.</span>
                  </h2>
                  <p className="text-lg md:text-2xl text-white/40 max-w-3xl mx-auto font-light leading-relaxed">
                     The high-performance web dashboard manages institutional data with <span className="text-white/80">Excel-style speed</span> and military-grade security.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                  {adminFeatures.map((feat, index) => (
                     <div key={index} className="group relative bg-[#0c0c0e]/40 backdrop-blur-md p-10 rounded-[48px] border border-white/[0.05] hover:border-white/[0.15] transition-all duration-700 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10">
                           <div className="mb-10 w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
                              <feat.icon className="w-5 h-5 text-white/50 group-hover:text-white transition-colors duration-500" />
                           </div>
                           <h3 className={`text-3xl font-normal mb-4 text-white ${serif.className}`}>{feat.title}</h3>
                           <p className="text-[15px] text-white/30 leading-relaxed font-light group-hover:text-white/60 transition-colors">
                              {feat.desc}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* --- 4. THE AI QUERY SIMULATION --- */}
         <section className="py-24 px-4 md:px-12 relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
               <div className="text-center mb-16">
                  <h2 className={`text-5xl md:text-7xl font-normal text-white mb-6 ${serif.className}`}>Institutional <span className="italic text-white/40">Intelligence.</span></h2>
                  <p className="text-white/40 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
                     Empowering educators and administrators with a <span className="text-white/80">natural language interface</span> to query complex academic data instantly. Ask anything from attendance trends and deficiency reports to student performance analytics with enterprise-grade precision.
                  </p>
               </div>

               <div className="w-full max-w-[900px] p-1.5 rounded-[48px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
                  <div className="bg-[#050505] border border-white/[0.05] rounded-[42px] min-h-[400px] flex flex-col">
                     <div className="p-8 flex-1 flex flex-col justify-end space-y-10">
                        <div className="flex justify-end">
                           <div className="bg-white text-black px-8 py-5 rounded-[28px] rounded-tr-none text-sm font-bold shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                              Who has less than 75% attendance in BBA Sem 4?
                           </div>
                        </div>
                        <div className="flex items-start gap-6">
                           <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              <Bot size={20} className="text-white/80" />
                           </div>
                           <div className="w-full max-w-md bg-white/[0.03] border border-white/[0.08] p-8 rounded-[32px] rounded-tl-none backdrop-blur-xl">
                              <div className="text-[10px] uppercase tracking-widest text-white/30 mb-4 font-bold">Query Result: 4 Batches Affected</div>
                              <div className="space-y-4">
                                 <div className="flex justify-between items-center text-sm border-b border-white/[0.03] pb-2">
                                    <span className="text-white/60">Tanisha (BDA)</span>
                                    <span className="text-red-400 font-mono">72%</span>
                                 </div>
                                 <div className="flex justify-between items-center text-sm border-b border-white/[0.03] pb-2">
                                    <span className="text-white/60">Akash M. (GEC)</span>
                                    <span className="text-red-400 font-mono">68%</span>
                                 </div>
                              </div>

                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

      </main>
   )
}