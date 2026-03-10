'use client'

import { motion } from 'framer-motion'

export default function Stats() {
  const stats = [
    { label: 'Students Using Our Apps', value: '1000+' },
    { label: 'Projects Delivered', value: '50+' },
    { label: 'Uptime Achieved', value: '99.9%' },
    { label: 'Years of Experience', value: '5+' },
  ]

  return (
    <section className="py-20 bg-black border-t border-b border-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
