"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Instrument_Serif, Inter } from 'next/font/google'

const seasonFont = Instrument_Serif({
    subsets: ['latin'],
    weight: '400',
    style: ['normal', 'italic'],
    display: 'swap',
})

const sans = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600'],
    display: 'swap',
})

const differences = [
    {
        number: "01",
        title: "Production-Grade Systems",
        description: "Moving beyond demos. We ship reliable, high-performance systems with security and monitoring built-in from day one.",
    },
    {
        number: "02",
        title: "Architecture Before Code",
        description: "We design first. Precise database, API, and scaling strategies ensure your product remains stable as it grows.",
    },
    {
        number: "03",
        title: "AI That Actually Solves Problems",
        description: "No hype. We integrate intelligent LLM workflows and automation that reduce manual work and drive operational impact.",
    },
    {
        number: "04",
        title: "Systems Built to Scale",
        description: "Designed for growth. Our architecture supports seamless horizontal scaling from 100 to 1 million users.",
    },
    {
        number: "05",
        title: "Full Ownership & Independence",
        description: "You own the code and data. No hidden dependencies, platform lock-ins, or forced subscriptions to maintain control.",
    },
    {
        number: "06",
        title: "Engineer-Led Development",
        description: "Direct collaboration with senior engineers. Faster decisions, cleaner systems, and higher technical standards throughout.",
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
}

export default function DifferenceSection() {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    return (
        <section className={`relative w-full py-12 md:py-16 bg-black text-white overflow-hidden ${sans.className}`}>

            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none blur-[100px]" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-8 pt-8 md:pt-12"
            >
                {/* Section Header - Centered & Compact */}
                <motion.div variants={itemVariants} className="text-center mb-8 md:mb-12">
                    <span className="text-[10px] font-mono tracking-[0.4em] text-neutral-500 uppercase block mb-4">
                        The Standard
                    </span>
                    <h2 className={`text-4xl md:text-6xl text-white tracking-wide leading-[1.1] ${seasonFont.className}`}>
                        The OneZeroLabs{' '}
                        <span className="italic text-neutral-500">Difference.</span>
                    </h2>
                </motion.div>

                {/* Compact Double Layer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
                    {differences.map((item, index) => (
                        <div key={index} className="relative p-1.5 md:p-2 rounded-[2rem] border border-white/[0.04] bg-white/[0.01]">
                            <motion.div
                                variants={itemVariants}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                whileHover={{ scale: 1.01 }}
                                className="group relative bg-[#090909] backdrop-blur-3xl border border-white/[0.07] rounded-[1.6rem] p-5 md:p-6 h-full flex flex-col transition-all duration-700 hover:border-white/15 hover:bg-[#0b0b0b] cursor-default overflow-hidden"
                            >
                                {/* Inner Ambient Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                <div className="relative z-10 flex flex-col h-full">
                                    {/* Number Row with Line */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <motion.span
                                            className="text-[9px] font-mono font-bold text-neutral-500 tracking-[0.2em]"
                                            animate={hoveredIndex === index ? { color: "#ffffff" } : { color: "#666666" }}
                                        >
                                            {item.number}
                                        </motion.span>
                                        <div className="h-px w-8 bg-white/5 group-hover:w-12 group-hover:bg-white/20 transition-all duration-500" />
                                    </div>

                                    {/* Title - Optimized for Readability with better spacing */}
                                    <h3 className={`text-xl md:text-2xl font-medium text-white mb-3 tracking-wide group-hover:text-white transition-colors duration-500 leading-tight ${seasonFont.className}`}>
                                        {item.title}
                                    </h3>

                                    {/* Description - High Contrast with better spacing */}
                                    <p className="text-[14px] md:text-[15px] text-neutral-300 group-hover:text-neutral-100 leading-relaxed font-light tracking-wide transition-colors duration-500 pr-2">
                                        {item.description}
                                    </p>

                                    {/* Subtle Bottom Signal */}
                                    <div className="mt-auto pt-4 overflow-hidden">
                                        <motion.div
                                            animate={hoveredIndex === index ? { x: 0, opacity: 1 } : { x: -15, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className="text-white/30 text-lg"
                                        >
                                            →
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Grainy Texture */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
            />
        </section>
    )
}
