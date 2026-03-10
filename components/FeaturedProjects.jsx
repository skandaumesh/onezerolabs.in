'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FeaturedProjects() {
  const projects = [
    {
      id: 1,
      number: '01',
      title: 'Smart Attendance SaaS',
      description: 'An AI-driven LMS for institutions with offline-first capabilities and real-time syncing.',
      href: '/portfolio'
    },
    {
      id: 2,
      number: '02',
      title: 'Fintech Dashboard',
      description: 'Ultra-clear data visualization and transaction systems for modern banking.',
      href: '/portfolio'
    },
    {
      id: 3,
      number: '03',
      title: 'Agentic AI Platform',
      description: 'Autonomous workflows and LLM orchestration for enterprise automation.',
      href: '/portfolio'
    },
    {
      id: 4,
      number: '04',
      title: 'Spatial UI Library',
      description: 'A React-based library for immersive 3D and spatial digital interfaces.',
      href: '/portfolio'
    }
  ]

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-black px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full max-w-[1600px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight max-w-5xl">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Projects</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl mt-4 sm:mt-6 max-w-2xl">
            Explore our latest works and see how we transform ideas into exceptional digital experiences.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8 }}
            >
              <Link href={project.href} className="block h-full">
                <div className="group relative bg-white/[0.01] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10 h-full flex flex-col transition-all duration-700 hover:border-white/20 hover:bg-white/[0.03] cursor-pointer overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">

                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">

                    {/* Project Number */}
                    <motion.div
                      className="text-xs sm:text-sm font-bold text-purple-400 mb-4 sm:mb-6 tracking-widest uppercase"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {project.number}
                    </motion.div>

                    {/* Project Title */}
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-600 transition-all duration-500 leading-tight">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-sm mb-auto leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {project.description}
                    </p>

                    {/* Arrow Icon */}
                    <motion.div
                      className="text-white text-xl sm:text-2xl md:text-3xl group-hover:text-purple-400 transition-colors duration-500 inline-block"
                      animate={{ x: 0 }}
                      whileHover={{ x: 6 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      →
                    </motion.div>
                  </div>

                  {/* Border shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-xl sm:rounded-2xl border border-transparent group-hover:border-purple-500/20 transition-all duration-500"
                    style={{
                      boxShadow: 'inset 0 0 20px rgba(168, 85, 247, 0)'
                    }}
                    whileHover={{
                      boxShadow: 'inset 0 0 20px rgba(168, 85, 247, 0.1)'
                    }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}