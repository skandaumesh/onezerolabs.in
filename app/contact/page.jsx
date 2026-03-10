'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Check, Linkedin, Loader2, MapPin, Mail } from 'lucide-react'
import Image from 'next/image'
import { Instrument_Serif, Inter } from 'next/font/google'
import NavbarResponsive from '@/components/Navbar'

// ----------------------------------------------------------------------
// 0. CONFIGURATION
// ----------------------------------------------------------------------
const WEB3FORMS_ACCESS_KEY = "aeb1e2ea-21fd-44b4-bb0a-366928d410ae";

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

// ----------------------------------------------------------------------
// 1. MAIN COMPONENT
// ----------------------------------------------------------------------
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
    agreePolicy: false
  })

  const [status, setStatus] = useState(null) // null | 'submitting' | 'success' | 'error'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          ...formData,
          subject: `New Inquiry from ${formData.name}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success')
        setFormData({ name: '', company: '', email: '', message: '', agreePolicy: false })
      } else {
        setStatus('error')
        alert("Something went wrong. Please try again.")
      }
    } catch (error) {
      setStatus('error')
      console.error(error)
    }
  }

  return (
    <main className={`bg-[#050505] text-white min-h-screen selection:bg-white/20 selection:text-white ${sans.className}`}>

      <NavbarResponsive />

      <section className="relative w-full min-h-[90vh] overflow-hidden px-4 md:px-8 pb-24 pt-32 md:pt-40 flex justify-center">
        {/* Background ambient glow matching about page */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[150vw] sm:w-[1200px] h-[1200px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12)_0%,rgba(147,51,234,0.08)_30%,transparent_65%)] pointer-events-none blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full max-w-[1200px] bg-[#0c0c0e] border border-white/10 rounded-[40px] md:rounded-[56px] shadow-[0_0_80px_rgba(0,0,0,0.8),0_0_60px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col lg:flex-row"
        >
          {/* === LEFT SIDE (Visual) === */}
          <div className="relative w-full lg:w-[48%] h-[250px] lg:h-auto overflow-hidden">

            <Image
              src="/contact_dreamy.jpg"
              alt="Lone silhouette in a meadow under a day-night transitioning sky"
              fill
              className="object-cover relative z-10 brightness-[1.15] contrast-[1.05]"
              priority
            />

            {/* Image Glow Overlays */}
            <div className="absolute inset-0 z-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(100,150,255,0.25)_0%,transparent_70%)]" />
            <div className="absolute inset-0 z-15 pointer-events-none bg-[radial-gradient(ellipse_at_50%_60%,rgba(200,180,255,0.15)_0%,transparent_60%)]" />
            <div className="absolute inset-0 z-15 pointer-events-none shadow-[inset_0_0_80px_rgba(120,160,255,0.2)]" />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-20" />


            {/* Centered Content with Glow */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6">
              <h2
                className={`text-3xl md:text-5xl text-white tracking-tight drop-shadow-[0_0_40px_rgba(255,255,255,0.5)] ${serif.className}`}
                style={{ textShadow: '0 0 30px rgba(255,255,255,0.6), 0 0 60px rgba(150,180,255,0.4), 0 0 100px rgba(100,150,255,0.2)' }}
              >
                Let's start a <br /> <span className="italic opacity-90">project.</span>
              </h2>
              <div className="mt-4 flex gap-6 text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">
                <span>OneZeroLabs</span>
                <span>Innovation + Strategy</span>
              </div>
            </div>


            {/* Circular cutout mimic (subtle) */}
            <div className="hidden lg:block absolute -right-20 top-1/2 -translate-y-1/2 w-40 h-[110%] bg-[#0c0c0e] rounded-full blur-2xl opacity-40 translate-x-1/2" />
          </div>

          {/* === RIGHT SIDE (Form Section) === */}
          <div className="w-full lg:w-[52%] p-6 md:p-8 lg:p-10 flex flex-col justify-center">
            {/* Section Header */}
            <div className="mb-8">
              <h1 className={`text-4xl md:text-5xl lg:text-[48px] text-white leading-tight mb-3 ${serif.className}`}>
                Bring your <br /> <span className="italic text-white/50">vision to life.</span>
              </h1>
              <p className="text-neutral-400 font-light text-[15px] leading-relaxed max-w-md">
                Partner with OneZeroLabs to build high-performance digital solutions tailored to your brand.
              </p>
            </div>

            <AnimatePresence mode='wait'>
              {status === 'success' ? (
                /* === SUCCESS STATE === */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-10 text-center flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8">
                    <Check size={32} className="text-white" />
                  </div>
                  <h3 className={`text-3xl text-white mb-4 ${serif.className}`}>Message Received.</h3>
                  <p className="text-neutral-400 mb-10">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setStatus(null)}
                    className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                /* === FORM STATE === */
                <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-[16px] focus:outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                    />

                    <input
                      type="text"
                      name="company"
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-[16px] focus:outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-[16px] focus:outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                    />

                    <textarea
                      name="message"
                      placeholder="Tell us about your project..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      required
                      className="w-full px-6 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-[16px] focus:outline-none focus:border-white/30 transition-all placeholder:text-neutral-600 resize-none"
                    />

                    <div className="flex items-start gap-3 pt-2">
                      <div className="relative flex items-center mt-0.5">
                        <input
                          type="checkbox"
                          name="agreePolicy"
                          id="agreePolicy"
                          checked={formData.agreePolicy}
                          onChange={handleChange}
                          required
                          className="peer h-4 w-4 cursor-pointer appearance-none border border-white/20 rounded bg-white/5 checked:bg-white checked:border-white transition-all focus:ring-0"
                        />
                        <Check size={10} strokeWidth={4} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </div>
                      <label htmlFor="agreePolicy" className="text-[14px] text-neutral-500 font-light cursor-pointer select-none">
                        I agree to the <a href="/privacy-policy" className="text-white/80 hover:text-white underline underline-offset-4 decoration-white/20 transition-colors">privacy policy</a>.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!formData.agreePolicy || status === 'submitting'}
                      className="group relative w-full px-8 py-4 bg-white text-black rounded-2xl text-[15px] font-medium tracking-wide hover:bg-neutral-200 transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                      <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

    </main>
  )
}