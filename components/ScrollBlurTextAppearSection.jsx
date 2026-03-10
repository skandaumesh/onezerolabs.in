'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function SlowStarMarquee() {
  // SPEED CONTROL: Higher = Slower (40s for a very premium feel)
  const SPEED = 40;

  // Separator: ✦ (Four-pointed star)
  const TEXT = "GET IN TOUCH ✦ LET'S BUILD ✦ ONEZEROLABS ✦ "

  return (
    <section className="relative h-[25vh] md:h-[35vh] bg-[#050505] flex items-center overflow-hidden border-y border-white/5">

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: SPEED,
          ease: "linear"
        }}
        className="flex whitespace-nowrap pointer-events-none select-none"
      >
        {/* We repeat the text to create a perfect infinite loop */}
        <span className="font-syne text-[12vw] md:text-[8vw] font-extrabold uppercase leading-none tracking-tighter text-white px-4">
          {TEXT}{TEXT}{TEXT}{TEXT}
        </span>
      </motion.div>

    </section>
  )
}