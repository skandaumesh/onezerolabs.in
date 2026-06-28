"use client"

import { motion } from "framer-motion"

const projects = [
  {
    client: "SAAME",
    tag: "EDUCATION · INSTITUTIONAL SOFTWARE",
    description: "17-module production platform — parent Android app on Google Play, teaching portal PWA, and admin dashboard with AI-powered NLP chatbot.",
    stack: "Node.js · MongoDB · Firebase · Capacitor · Tailwind",
    outcome: "43,000+ lines · 17 modules · ₹1.5L commercial sale"
  },
  {
    client: "Elevare Connect",
    tag: "EVENTS · WEB DEVELOPMENT",
    description: "Full Next.js rebuild with Razorpay integration, GSC SEO setup, and schema optimisation — replacing a broken WordPress predecessor.",
    stack: "Next.js · Razorpay · Vercel · Tailwind · GSC",
    outcome: "Live at elevareconnect.in · Sub-2s load"
  },
  {
    client: "Praasa Consultancy",
    tag: "CONSULTING · WEB DEVELOPMENT",
    description: "Professional research consultancy site translating a complex academic mission into a clean, navigable platform.",
    stack: "Next.js · Tailwind · Vercel",
    outcome: "Launched · Client-verified"
  },
  {
    client: "Vetaas Foundation",
    tag: "NON-PROFIT · WEB & DESIGN",
    description: "React component library for an SEL nonprofit — About page, hero section, and full brand-aligned UI system in production-ready JSX.",
    stack: "React · JSX · Tailwind",
    outcome: "Full component library delivered"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function WorkSection() {
  return (
    <section id="work" className="relative w-full py-24 md:py-32 bg-black text-white px-6 md:px-12 lg:px-24">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-[11px] md:text-xs tracking-widest text-white/50 uppercase block mb-4">
            CLIENT PROJECTS
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-[family-name:var(--font-instrument-serif)]">
            Selected Work.
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-16"
        >
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              variants={cardVariants}
              className="group relative flex flex-col bg-black border border-white/15 rounded-[2px] transition-all duration-300 hover:scale-[1.01] hover:border-white/30 overflow-hidden"
            >
              {/* Visual Placeholder */}
              <div className="w-full aspect-[4/3] bg-black border-b border-white/10 relative">
                {/* TODO: add {project.client} screenshot */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_2px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
              </div>

              {/* Content */}
              <div className="p-8 md:p-10 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl md:text-2xl font-medium text-white/90">
                    {project.client}
                  </h3>
                  <span className="text-[10px] tracking-wider text-white/40 uppercase max-w-[120px] text-right">
                    {project.tag}
                  </span>
                </div>
                
                <p className="text-white/60 text-[15px] leading-relaxed mb-10 flex-grow font-normal">
                  {project.description}
                </p>
                
                <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Stack</span>
                    <span className="text-xs text-white/70">{project.stack}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Outcome</span>
                    <span className="text-xs text-white/70">{project.outcome}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="text-white/40 text-sm tracking-wide hover:text-white/70 transition-colors cursor-pointer">
            More work coming soon →
          </span>
        </motion.div>

      </div>
    </section>
  )
}
