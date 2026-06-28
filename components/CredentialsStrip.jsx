"use client"

import { motion } from "framer-motion"

export default function CredentialsStrip() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full border-y border-white/10 py-6 bg-black text-center overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4">
        <p className="text-[10px] md:text-xs font-mono text-white/40 tracking-[0.2em] uppercase leading-relaxed">
          MSME Registered <span className="mx-2 md:mx-4">·</span> 
          UDYAM-KR-03-0615981 <span className="mx-2 md:mx-4">·</span> 
          Listed on The Manifest <span className="mx-2 md:mx-4">·</span> 
          Bengaluru Software Companies <span className="mx-2 md:mx-4">·</span> 
          Est. 2023 <span className="mx-2 md:mx-4">·</span> 
          Bengaluru, Karnataka
        </p>
      </div>
    </motion.div>
  )
}
