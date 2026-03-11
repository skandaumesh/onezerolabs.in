"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { Instrument_Serif, Inter } from 'next/font/google'
import { Quote } from 'lucide-react'
import Image from 'next/image'

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
})

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const testimonials = [
  {
    company: "Praasa Consultancy",
    quote: "Collaborating with One Zero Labs to build the Praasa Consultancy website was a phenomenal experience. They translated our mission into a professional, user-friendly platform where researchers can easily access our services. Skanda's technical expertise and attention to detail ensured every feature works flawlessly. The communication was prompt and transparent throughout. I highly recommend them to anyone looking for a talented team that brings a vision to life.",
    author: "Dr. Sandesh Bhat",
    role: "Founder",
    dept: "",
    image: "/praasa.jpeg",
    imagePosition: "50% 10%",
  },
  {
    company: "MLA Academy of Higher Learning",
    quote: "The AI-Powered Academic Management Platform developed by OneZeroLabs has brought a remarkable improvement in the way attendance is managed within the department and the institution. The system is simple, efficient, and well-designed to meet the practical needs of faculty members. It has helped reduce manual effort, improved accuracy in attendance tracking, and made the overall process much more organized and reliable.",
    author: "Ms. Kamala S",
    role: "Head of Department & Assistant Professor",
    dept: "Dept. of Computer Applications",
    image: "/kamala.png",
    imagePosition: "30% 20%",
  },
  {
    company: "Vetaas Education",
    quote: "ONEZEROLABS brings a refreshing blend of technical expertise and problem-solving mindset. Their team is proactive, responsive, and genuinely invested in building solutions that work in real environments. Their ability to translate complex requirements into intuitive, scalable systems is truly commendable. It's exciting to see young innovators building technology with such clarity, purpose, and a deep understanding of what institutions actually need.",
    author: "Vetaas Education",
    role: "Education Partner",
    dept: "",
    image: "/vetaas.jpeg",
    imagePosition: "50% 50%",
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection)
    setCurrent((prev) => (prev + newDirection + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      paginate(1)
    }, 2000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, paginate])

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  }

  const t = testimonials[current]

  return (
    <section className={`relative w-full py-16 md:py-28 bg-black text-white overflow-hidden ${sans.className}`}>

      <div className="relative z-10 w-full max-w-[1050px] mx-auto px-4 md:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-18"
        >
          <span className="text-[10px] font-mono tracking-[0.4em] text-neutral-500 uppercase block mb-4">
            Testimonials
          </span>
          <h2 className={`text-3xl md:text-5xl lg:text-6xl text-white tracking-wide leading-[1.1] ${serif.className}`}>
            What our clients{' '}
            <span className="italic text-neutral-500">say.</span>
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div
          className="relative w-full"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]
                       rounded-[24px] md:rounded-[32px] p-5 md:p-10 lg:p-12
                       shadow-[0_0_80px_rgba(255,255,255,0.06),0_0_40px_rgba(255,255,255,0.04)]
                       overflow-hidden flex flex-col h-[460px] md:h-[440px]"
          >
            {/* Top-left white glow */}
            <div
              className="absolute top-0 left-0 pointer-events-none rounded-tl-[24px] md:rounded-tl-[32px]"
              style={{
                width: '200px',
                height: '200px',
                background: 'radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 40%, transparent 70%)',
                filter: 'blur(2px)',
              }}
            />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col h-full flex-1"
              >
                {/* Company Name */}
                <div className="mb-4 md:mb-6 lg:mb-8">
                  <span className="text-[18px] md:text-[22px] font-bold text-white/90 tracking-tight">
                    {t.company}
                  </span>
                  <div className="mt-2 w-10 md:w-12 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                </div>

                {/* Quote */}
                <p className={`text-[15px] md:text-[18px] text-neutral-300 leading-[1.6] md:leading-[1.8] font-light mb-6 md:mb-8 text-left max-w-full ${sans.className}`}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-4">
                    {/* Author Photo or Initials */}
                    {t.image ? (
                      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.08)] flex-shrink-0">
                        <Image
                          src={t.image}
                          alt={t.author}
                          fill
                          className="object-cover"
                          style={{ objectPosition: t.imagePosition }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-white/60 text-[13px] font-medium">{t.author.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-white/90 text-[15px] md:text-[15px] font-medium">{t.author}</p>
                      <p className="text-neutral-500 text-[13px] md:text-[13px] font-light">{t.role}</p>
                      {t.dept && <p className="text-neutral-600 text-[12px] md:text-[12px] font-light">{t.dept}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Subtle quote watermark */}
            <Quote size={120} strokeWidth={0.5} className="absolute -top-4 -right-4 md:-top-8 md:-right-8 text-white/[0.02] pointer-events-none" />
          </motion.div>


        </div>

      </div>
    </section>
  )
}