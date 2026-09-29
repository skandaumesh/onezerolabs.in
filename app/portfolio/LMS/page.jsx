'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { Band, BODY, EYEBROW, GlassCard, HEADING, INK, MUTED } from '@/components/ui/light-kit'

// Emphasis inside body copy: ink instead of slate, nothing louder.
const EM = `font-medium ${INK}`

export default function LmsProjectPage() {
   const teachingFeatures = [
      { title: "0.1s Zero Latency", text: "Proprietary 'Stale-While-Revalidate' architecture for instant marking." },
      { title: "Offline-First", text: "Mark attendance without internet; auto-syncs when back online." },
      { title: "Smart Subject Logic", text: "Auto-filters Core, Electives, and Languages by stream/semester." },
      { title: "Cognitive AI Assistant", text: "Query student data using natural language directly in the app." }
   ]

   const adminFeatures = [
      {
         title: "Excel-Style Inline Editing",
         desc: "Modify batch data (Names, Streams) instantly without forms."
      },
      {
         title: "Automated batch Promotion",
         desc: "One-click semester batch transfer with 100% logic accuracy."
      },
      {
         title: "Compliance Reporting",
         desc: "Inspection-ready PDF/Excel exports for NAAC and NBA audits."
      },
      {
         title: "Advanced Filtering",
         desc: "Slice data by Stream, Language, or Active Status in real-time."
      },
      {
         title: "WhatsApp Logic",
         desc: "Automated absenteeism triggers sent to parent mobile devices."
      },
      {
         title: "Enterprise Security",
         desc: "Firebase Auth, reCAPTCHA v3, and Nginx rate-limiting middleware."
      }
   ]

   return (
      <main className="min-h-screen overflow-x-hidden bg-ozl-base text-ozl-ink">

         {/* --- 1. HERO SECTION --- */}
         <Band className="flex min-h-[80vh] flex-col items-center justify-center px-4 pb-16 pt-32 sm:px-6 md:min-h-screen md:pb-24 md:pt-40">
            <div className="relative z-10 mx-auto mb-14 w-full max-w-5xl text-center md:mb-20">
               <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className={`${HEADING} mb-8 text-6xl leading-[0.95] sm:text-8xl md:text-9xl`}
               >
                  Smart Academic <br /> <span className="italic">Ecosystem.</span>
               </motion.h1>

               <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`mx-auto max-w-2xl px-4 text-base font-light leading-relaxed md:text-xl ${BODY}`}
               >
                  An enterprise-grade digital core digitizing critical academic workflows through <span className={EM}>Hybrid Cloud Architecture</span> and <span className={EM}>Generative AI.</span>
               </motion.p>
            </div>

            {/* THE MAIN UI DISPLAY. Rises into place only: it used to grow
                with the scroll as well, and a scale that keeps changing leaves
                the screenshot rastered soft. */}
            <motion.div
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
               className="relative mx-auto w-full max-w-[1000px] px-1 sm:px-4"
            >
               <GlassCard>
                  <div
                     className="relative flex aspect-[16/10] items-end justify-center overflow-hidden md:aspect-[21/9]"
                     style={{ backgroundImage: "url('/sky-hero.jpg')", backgroundSize: "cover", backgroundPosition: "center 30%" }}
                  >
                     <img
                        src="/lms2.png"
                        alt="SAAME Dashboard UI"
                        className="relative z-10 h-[85%] w-[85%] rounded-t-[20px] object-contain object-bottom drop-shadow-[0_24px_40px_rgba(15,23,42,0.25)]"
                     />
                  </div>
               </GlassCard>
            </motion.div>
         </Band>

         {/* One grey band for the teaching module and the command centre. */}
         <Band tone="grey" fadeTop fadeBottom className="px-4 py-20 md:px-12 md:py-28">

            {/* --- 2. THE TEACHING MODULE --- */}
            <div className="mx-auto max-w-7xl">
               <div className="mb-24 grid grid-cols-1 items-center gap-14 md:mb-32 lg:grid-cols-2 lg:gap-20">
                  <div>
                     <span className={`${EYEBROW} mb-6`}>01 / Mobile capability</span>
                     <h2 className={`${HEADING} mb-8 text-5xl leading-[0.95] md:text-8xl`}>
                        Native App <br /> <span className="italic">Architecture.</span>
                     </h2>
                     <p className={`mb-10 text-lg font-light leading-relaxed md:text-xl ${BODY}`}>
                        Designed for speed and reliability, the <span className={EM}>SAAME Teacher APK</span> provides faculty with zero-latency tools that function perfectly in network dead zones.
                     </p>
                     <div className="flex flex-wrap gap-3">
                        {["Android APK", "Offline-First"].map((tag) => (
                           <div key={tag} className={`rounded-full border border-white bg-white/70 px-5 py-2.5 font-mono text-xs uppercase tracking-widest shadow-[0_2px_8px_-4px_rgba(15,23,42,0.15)] ${BODY}`}>
                              {tag}
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                     {teachingFeatures.map((item) => (
                        <GlassCard key={item.title} interactive className="h-full" innerClassName="p-7">
                           <h3 className={`font-[family-name:var(--font-instrument-serif)] text-2xl ${INK}`}>{item.title}</h3>
                           <span aria-hidden className="mb-3 mt-3 block h-px w-8 bg-[#0E1A33]/15 transition-all duration-500 ease-ozl group-hover:w-16 group-hover:bg-ozl-violet/60" />
                           <p className={`text-sm font-light leading-relaxed ${BODY}`}>{item.text}</p>
                        </GlassCard>
                     ))}
                  </div>
               </div>
            </div>

            {/* --- 3. THE ADMIN COMMAND CENTER --- */}
            <div className="mx-auto max-w-7xl">
               <div className="mb-14 text-center md:mb-20">
                  <span className={`${EYEBROW} mb-6`}>02 / Command center</span>
                  <h2 className={`${HEADING} mb-8 text-6xl leading-none md:text-9xl`}>
                     Central <span className="italic">Command.</span>
                  </h2>
                  <p className={`mx-auto max-w-3xl text-lg font-light leading-relaxed md:text-2xl ${BODY}`}>
                     The high-performance web dashboard manages institutional data with <span className={EM}>Excel-style speed</span> and military-grade security.
                  </p>
               </div>

               <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                  {adminFeatures.map((feat) => (
                     <GlassCard key={feat.title} interactive className="h-full" innerClassName="p-8 md:p-9">
                        <h3 className={`font-[family-name:var(--font-instrument-serif)] text-3xl ${INK}`}>{feat.title}</h3>
                        <span aria-hidden className="mb-4 mt-4 block h-px w-8 bg-[#0E1A33]/15 transition-all duration-500 ease-ozl group-hover:w-16 group-hover:bg-ozl-violet/60" />
                        <p className={`text-[15px] font-light leading-relaxed ${BODY}`}>
                           {feat.desc}
                        </p>
                     </GlassCard>
                  ))}
               </div>
            </div>
         </Band>

         {/* --- 4. THE AI QUERY SIMULATION --- */}
         <Band className="px-4 pb-24 pt-16 md:px-12 md:pb-32">
            <div className="mx-auto flex max-w-7xl flex-col items-center">
               <div className="mb-14 text-center">
                  <h2 className={`${HEADING} mb-6 text-5xl md:text-7xl`}>Institutional <span className="italic">Intelligence.</span></h2>
                  <p className={`mx-auto max-w-3xl text-lg font-light leading-relaxed md:text-xl ${BODY}`}>
                     Empowering educators and administrators with a <span className={EM}>natural language interface</span> to query complex academic data instantly. Ask anything from attendance trends and deficiency reports to student performance analytics with enterprise-grade precision.
                  </p>
               </div>

               <GlassCard className="w-full max-w-[900px]">
                  <div className="flex min-h-[400px] flex-col">
                     <div className="flex flex-1 flex-col justify-end space-y-8 p-6 md:p-8">
                        <div className="flex justify-end">
                           <div className="rounded-[24px] rounded-tr-none bg-[#1E293B] px-6 py-4 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(15,23,42,0.5)] md:px-8 md:py-5">
                              Who has less than 75% attendance in BBA Sem 4?
                           </div>
                        </div>
                        <div className="flex items-start gap-4 md:gap-6">
                           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white bg-white/80 shadow-[0_4px_12px_-6px_rgba(15,23,42,0.25)]">
                              <Bot size={20} className="text-[#0E1A33]" />
                           </div>
                           <div className="w-full max-w-md rounded-[28px] rounded-tl-none border border-white bg-white/80 p-6 shadow-[0_12px_28px_-16px_rgba(15,23,42,0.25)] md:p-8">
                              <div className={`mb-4 text-[10px] font-bold uppercase tracking-widest ${MUTED}`}>Query Result: 4 Batches Affected</div>
                              <div className="space-y-4">
                                 <div className="flex items-center justify-between border-b border-[#0E1A33]/[0.06] pb-2 text-sm">
                                    <span className={BODY}>Tanisha (BDA)</span>
                                    <span className="font-mono text-rose-600">72%</span>
                                 </div>
                                 <div className="flex items-center justify-between border-b border-[#0E1A33]/[0.06] pb-2 text-sm">
                                    <span className={BODY}>Akash M. (GEC)</span>
                                    <span className="font-mono text-rose-600">68%</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </GlassCard>
            </div>
         </Band>

      </main>
   )
}
