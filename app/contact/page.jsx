'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import Image from 'next/image'
import { Band, BODY, BTN_PRIMARY, BTN_SECONDARY, GlassCard, HEADING, INK, MUTED } from '@/components/ui/light-kit'

// ----------------------------------------------------------------------
// 0. CONFIGURATION
// ----------------------------------------------------------------------
const WEB3FORMS_ACCESS_KEY = "aeb1e2ea-21fd-44b4-bb0a-366928d410ae";

const FIELD =
  "w-full rounded-2xl border border-[#0E1A33]/10 bg-white/70 px-6 py-4 text-[16px] text-[#0E1A33] shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition-all placeholder:text-[#94A3B8] focus:border-[#0E1A33]/30 focus:bg-white focus:outline-none"

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
    <main className="min-h-screen bg-ozl-base text-ozl-ink">
      <Band tone="grey" fadeTop fadeBottom className="flex min-h-[90vh] justify-center px-4 pb-24 pt-32 md:px-8 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-[1200px]"
        >
          <GlassCard innerClassName="flex flex-col lg:flex-row">
            {/* === LEFT SIDE (Visual) === */}
            <div className="relative h-[250px] w-full overflow-hidden lg:h-auto lg:w-[48%]">
              <Image
                src="/contact_dreamy.jpg"
                alt="Lone silhouette in a meadow under a day-night transitioning sky"
                fill
                className="relative z-10 object-cover brightness-[1.1]"
                priority
              />

              {/* Just enough shade at the foot for the white type. */}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
                <h2
                  className="font-[family-name:var(--font-instrument-serif)] text-3xl tracking-tight text-white md:text-5xl"
                  style={{ textShadow: '0 2px 24px rgba(12,24,48,0.35)' }}
                >
                  Let's start a <br /> <span className="italic opacity-90">project.</span>
                </h2>
                <div className="mt-4 flex gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/75">
                  <span>OneZeroLabs</span>
                  <span>Innovation + Strategy</span>
                </div>
              </div>
            </div>

            {/* === RIGHT SIDE (Form Section) === */}
            <div className="flex w-full flex-col justify-center p-6 md:p-8 lg:w-[52%] lg:p-10">
              {/* Section Header */}
              <div className="mb-8">
                <h1 className={`${HEADING} mb-3 text-4xl md:text-5xl lg:text-[48px]`}>
                  Bring your <br /> <span className="italic">vision to life.</span>
                </h1>
                <p className={`max-w-md text-[15px] font-light leading-relaxed ${BODY}`}>
                  Partner with OneZeroLabs to build high-performance digital solutions tailored to your brand.
                </p>
              </div>

              <AnimatePresence mode='wait'>
                {status === 'success' ? (
                  /* === SUCCESS STATE === */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="flex flex-col items-center py-10 text-center"
                  >
                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-white bg-white/80 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)]">
                      <Check size={32} className="text-[#0E1A33]" />
                    </div>
                    <h3 className={`mb-4 font-[family-name:var(--font-instrument-serif)] text-3xl ${INK}`}>Message Received.</h3>
                    <p className={`mb-10 ${BODY}`}>We'll get back to you within 24 hours.</p>
                    <button onClick={() => setStatus(null)} className={BTN_SECONDARY}>
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  /* === FORM STATE === */
                  <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={FIELD}
                      />

                      <input
                        type="text"
                        name="company"
                        placeholder="Company Name"
                        value={formData.company}
                        onChange={handleChange}
                        className={FIELD}
                      />

                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={FIELD}
                      />

                      <textarea
                        name="message"
                        placeholder="Tell us about your project..."
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        required
                        className={`${FIELD} resize-none`}
                      />

                      <div className="flex items-start gap-3 pt-2">
                        <div className="relative mt-0.5 flex items-center">
                          <input
                            type="checkbox"
                            name="agreePolicy"
                            id="agreePolicy"
                            checked={formData.agreePolicy}
                            onChange={handleChange}
                            required
                            // min-h-0/min-w-0: the phone tap-target rule in
                            // globals.css otherwise inflates this to a 44px
                            // square. The label is clickable, so the target
                            // stays large enough.
                            className="peer h-4 w-4 min-h-0 min-w-0 cursor-pointer appearance-none rounded border border-[#0E1A33]/25 bg-white transition-all checked:border-[#1E293B] checked:bg-[#1E293B] focus:ring-0"
                          />
                          <Check size={10} strokeWidth={4} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                        </div>
                        <label htmlFor="agreePolicy" className={`cursor-pointer select-none text-[14px] font-light ${MUTED}`}>
                          I agree to the <a href="/privacy-policy" className={`underline decoration-[#0E1A33]/20 underline-offset-4 transition-colors hover:decoration-[#0E1A33]/50 ${INK}`}>privacy policy</a>.
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={!formData.agreePolicy || status === 'submitting'}
                        className={`${BTN_PRIMARY} group !h-12 w-full`}
                      >
                        <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                        <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>
      </Band>
    </main>
  )
}
