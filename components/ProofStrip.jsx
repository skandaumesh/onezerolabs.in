"use client"

import { motion } from "framer-motion"

// Real names, before any claim. Three beats six abstract cards.
const clients = [
  "MLA Academy of Higher Learning",
  "Vaayu Chest",
  "Vetaas Education Foundation",
]

export default function ProofStrip() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative w-full border-y border-white/10 bg-black py-8 md:py-10"
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <span className="block text-center text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase mb-6">
          Trusted by
        </span>

        <div className="flex flex-col items-center justify-center gap-4 text-center md:flex-row md:flex-wrap md:gap-0">
          {clients.map((client, index) => (
            <div key={client} className="flex items-center md:px-6 lg:px-8">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="hidden md:block h-4 w-px bg-white/15 mr-6 lg:mr-8 -ml-6 lg:-ml-8"
                />
              )}
              <span className="text-[15px] md:text-[17px] font-medium tracking-tight text-white/70">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
