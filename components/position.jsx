'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

// --- IMAGES ---
const galleryImages = [
  "pos1.jpeg", // Tech/Robot
  "pos2.jpeg", // Circuit
  "pos3.jpeg", // Matrix/Code
  "https://images.unsplash.com/photo-1535378437327-1e09282211f7?q=80&w=800&auto=format&fit=crop"  // Abstract Glow
]

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const blobAnimation = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.3, 0.5, 0.3],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// --- COMPONENT: GLASS IMAGE CARD ---
const ImageCard = ({ src, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      className="group relative aspect-square p-3 rounded-[2rem] border border-white/10 bg-white/[0.05] backdrop-blur-xl hover:bg-white/[0.1] transition-all duration-500 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
    >
      {/* Inner Container for Image */}
      <div className="relative w-full h-full overflow-hidden rounded-[1.5rem]">
        <img 
          src={src} 
          alt={`Gallery image ${index + 1}`}
          // Full color images
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        
        {/* Inner Shadow Overlay - Reduced for brighter colors */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Decorative Glint/Shine on the Frame */}
      <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/20 pointer-events-none" />
    </motion.div>
  )
}

// --- MAIN SECTION ---
export default function VisionSection() {
  return (
    <section className="bg-black w-full min-h-screen py-24 px-6 md:px-12 flex items-center justify-center relative overflow-hidden">
      
      {/* Fonts - Include full Syne weight range */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Syne:wght@400;500;600;700;800&display=swap');
      `}} />

      {/* Decorative Background Glows - Animated */}
      <motion.div 
        variants={blobAnimation}
        animate="animate"
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        variants={blobAnimation}
        animate="animate"
        transition={{ delay: 4 }} // Offset the pulse
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" 
      />
      
      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* LEFT COLUMN: Company Info */}
        <motion.div 
          className="flex flex-col justify-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeInUp} className="mb-8 flex items-center gap-3">
             <span 
                className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold text-neutral-300 uppercase tracking-widest"
                style={{ fontFamily: "'Syne', sans-serif" }}
             >
               About OneZeroLabs
             </span>
          </motion.div>

          {/* CREATIVE HEADING: Staggered, Smaller, Gradient */}
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-[1.1] mb-8 relative"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <span className="block relative z-10">We Architect</span>
            {/* Staggered second line with gradient */}
            <span className="block pl-8 md:pl-16 text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 via-white to-neutral-400 opacity-90">
              The Unseen.
            </span>
            {/* Decorative underline animation */}
            <motion.div 
              className="absolute left-8 md:left-16 bottom-1 h-[2px] bg-indigo-500/50"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            />
          </motion.h2>

          <motion.div 
            variants={fadeInUp}
            className="space-y-6 text-lg text-neutral-400 font-light leading-relaxed max-w-lg"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <p>
              <strong className="text-white">OneZeroLabs</strong> is more than a development agency; we are a digital foundry. We operate at the intersection of rigorous engineering and fluid creativity.
            </p>
            <p>
              Our mission is to strip away the noise of the modern web and rebuild it with absolute precision. We don't just write code—we forge digital infrastructure designed to dominate markets and endure trends.
            </p>
          </motion.div>

          {/* Glass CTA Button */}
          <motion.div variants={fadeInUp} className="mt-12 group w-fit">
             <a href="#contact" className="flex items-center gap-4 px-6 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300">
                <span 
                  className="text-sm font-bold uppercase tracking-widest text-white"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Explore Our DNA
                </span>
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ArrowUpRight size={16} strokeWidth={3} />
                </div>
             </a>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: Glass Image Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
           {galleryImages.map((src, index) => (
             <ImageCard key={index} src={src} index={index} />
           ))}
        </div>

      </div>
    </section>
  )
}