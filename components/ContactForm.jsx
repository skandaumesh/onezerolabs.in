'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      )

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', projectType: '', message: '' })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        setError('Submission failed. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-black py-20 px-4">
      {/* Font Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400&family=Syne:wght@700;800&display=swap');
      `}} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tighter font-syne mb-4">
                Let's Build
            </h2>
            <p className="text-neutral-500 tracking-[0.2em] text-xs uppercase font-bold">
                [ Initiate Digital Orchestration ]
            </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="relative bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 md:p-12 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Name */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="SKANDA UMESH"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300 font-inter"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="hello@onezerolabs.com"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300 font-inter"
              />
            </div>

            {/* Project Type */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Service Selection</label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-white/40 transition-all duration-300 font-inter appearance-none cursor-pointer"
              >
                <option value="" className="bg-black">Select a Service</option>
                <option value="Web Development" className="bg-black">Web Development</option>
                <option value="Gen AI & LLM" className="bg-black">Gen AI & LLM</option>
                <option value="SaaS Development" className="bg-black">SaaS Development</option>
                <option value="Next-Gen Interface" className="bg-black">Next-Gen Interface</option>
                <option value="Search Branding" className="bg-black">Search Branding</option>
                <option value="Graphic Design" className="bg-black">Graphic Design</option>
              </select>
            </div>

            {/* Message */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Project Brief</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Describe the digital architecture you envision..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300 font-inter resize-none"
              ></textarea>
            </div>
          </div>

          {/* Feedback Messages */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm mt-6 font-inter"
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
            {submitted && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-emerald-400 text-sm mt-6 font-inter"
              >
                <CheckCircle2 size={16} /> Transmission successful. We will be in touch shortly.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-8 px-8 py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-syne uppercase tracking-tighter"
          >
            {loading ? 'Processing...' : (
              <>
                Send Message <Send size={18} />
              </>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </section>
  )
}