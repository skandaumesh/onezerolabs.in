"use client"

import { motion } from "framer-motion"

const team = [
  {
    initials: "SU",
    name: "Skanda Umesh",
    role: "Founder & Lead Engineer",
    bio: "Founder and lead engineer at OneZeroLabs. Architect of SAAME — a commercially sold, 43,000-line institutional platform built from scratch. Full-stack engineer specialising in Node.js, MongoDB, React, and AI integration. MCA candidate at Jain University.",
    links: [
      { label: "LinkedIn", href: "https://linkedin.com/in/skanda-umesh-88b16432b" },
      { label: "GitHub", href: "https://github.com/skandaumesh" }
    ]
  },
  {
    initials: "TK",
    name: "Tanisha Vishal Karve",
    role: "CEO",
    bio: "CEO at OneZeroLabs, leading brand strategy, social media management, content marketing, AI automation, and end-to-end project execution. Drives client growth with clarity, structure, and measurable impact.",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/tanisha-karve/" }
    ]
  }
]

export default function TeamSection() {
  return (
    <section id="team" className="relative w-full py-24 md:py-32 bg-black text-white px-6 md:px-12 lg:px-24">
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
            THE TEAM
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-[family-name:var(--font-instrument-serif)]">
            Built by people who ship.
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {team.map((member, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col bg-black border border-white/15 rounded-sm p-8 md:p-10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.04)]"
            >
              {/* Avatar and Info */}
              <div className="flex items-center gap-5 mb-8">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-semibold tracking-wide text-sm">
                    {member.initials}
                  </span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl md:text-2xl font-medium text-white/90">
                    {member.name}
                  </h3>
                  <span className="text-[13px] text-white/50 uppercase tracking-wide">
                    {member.role}
                  </span>
                </div>
              </div>
              
              {/* Bio */}
              <p className="text-white/60 text-[15px] leading-relaxed mb-8 flex-grow font-normal">
                {member.bio}
              </p>
              
              {/* Links */}
              <div className="flex gap-4 mt-auto">
                {member.links.map((link, linkIndex) => (
                  <a 
                    key={linkIndex}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-white/40 hover:text-white/80 hover:underline transition-all"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
