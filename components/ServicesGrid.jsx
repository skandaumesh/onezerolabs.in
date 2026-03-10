'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const services = [
  {
    number: '01',
    title: 'Web Development',
    description: 'Create visually compelling brands and websites.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: '02',
    title: 'UI/UX Design',
    description: 'Build efficient, user-friendly digital solutions.',
    color: 'from-blue-500 to-purple-500',
  },
  {
    number: '03',
    title: 'Graphic Design',
    description: 'Attract and convert more new customers.',
    color: 'from-pink-500 to-purple-500',
  },
  {
    number: '04',
    title: 'SEO Optimization',
    description: 'Optimize your website to increase revenue.',
    color: 'from-purple-500 to-blue-500',
  },
]

export default function ServicesGrid() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <section className="relative min-h-screen bg-black py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="max-w-[1600px] mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-gray-300">
            We craft modern <span className="text-white">Websites</span>, intuitive <span className="text-white">Designs</span>
            <br />
            and scalable <span className="text-white">Digital Solutions</span> that help
            <br />
            Businesses Grow and stand out.
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group relative bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 lg:p-10 hover:bg-gray-900/60 hover:border-gray-700 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Background gradient on hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full min-h-[280px] sm:min-h-[320px] md:min-h-[350px]">
                {/* Number */}
                <motion.span
                  className="text-purple-500 text-sm sm:text-base font-bold mb-4 sm:mb-6"
                  animate={hoveredIndex === index ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {service.number}
                </motion.span>

                {/* Title */}
                <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 flex-grow">
                  {service.description}
                </p>

                {/* Arrow Icon */}
                <motion.div
                  className="flex items-center justify-start"
                  animate={hoveredIndex === index ? { x: 10 } : { x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-500 group-hover:text-white transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{
                  x: hoveredIndex === index ? ['-100%', '200%'] : '-100%',
                }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}