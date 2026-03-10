'use client'

import { motion } from 'framer-motion'

export default function CaseStudy({ project }) {
  return (
    <article className="max-w-4xl mx-auto py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-12 h-96 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center"
      >
        <h1 className="text-5xl font-bold text-white text-center px-4">{project.title}</h1>
      </motion.div>

      {/* Content */}
      {/* Sections rendered here */}
    </article>
  )
}
