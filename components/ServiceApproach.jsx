'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Band, BODY, EYEBROW, GlassCard, HEADING, INK } from '@/components/ui/light-kit'

// A numbered label on each step rather than an icon in a circle, as with the
// homepage's How We Work steps.
const steps = [
  {
    title: "Discover",
    description: "We analyze your business, identify bottlenecks, and uncover growth opportunities.",
  },
  {
    title: "Design",
    description: "We create systems, processes, and solutions tailored to your goals.",
  },
  {
    title: "Build",
    description: "Our team develops and implements the required infrastructure.",
  },
  {
    title: "Optimize",
    description: "We continuously improve performance through analytics and iteration.",
  }
]

export default function ServiceApproach() {
  return (
    // Continues the grey band of the section above it (the service's Core
    // Services cards), so it fades out at the foot but not in at the top.
    <Band tone="grey" fadeBottom className="px-6 pb-20 pt-6 md:px-12 md:pb-28 md:pt-8 lg:px-24">
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center md:mb-16"
        >
          <span className={`${EYEBROW} mb-4`}>How we work</span>
          <h2 className={`${HEADING} text-4xl md:text-5xl lg:text-6xl`}>
            The OneZeroLabs <span className="italic">Approach.</span>
          </h2>
        </motion.div>

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="h-full"
            >
              <GlassCard interactive className="h-full" innerClassName="flex flex-col p-6 sm:p-7">
                <span className={`${EYEBROW} mb-5`}>
                  Step {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={`mb-3 font-[family-name:var(--font-instrument-serif)] text-2xl tracking-wide ${INK}`}>
                  {step.title}
                </h3>
                <p className={`text-[15px] font-light leading-relaxed ${BODY}`}>
                  {step.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </Band>
  )
}
