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
        title: "Built From Real Problems",
        description: "Real-world challenges, real solutions.",
        gradient: "from-blue-400/70 to-indigo-500/70",
        bgGlow: "bg-blue-500/20",
        shadow: "shadow-[0_0_25px_rgba(59,130,246,0.3)]",
    },
    {
        title: "Engineering Over Templates",
        description: "Architected for scale and performance.",
        gradient: "from-rose-400/70 to-pink-500/70",
        bgGlow: "bg-rose-500/20",
        shadow: "shadow-[0_0_25px_rgba(244,63,94,0.3)]",
    },
    {
        title: "Technology That Works",
        description: "Intuitive, fast, and dependable.",
        gradient: "from-emerald-400/70 to-green-500/70",
        bgGlow: "bg-emerald-500/20",
        shadow: "shadow-[0_0_25px_rgba(16,185,129,0.3)]",
    },
    {
        title: "Modern Systems",
        description: "AI-powered platforms for tomorrow.",
        gradient: "from-amber-400/70 to-orange-500/70",
        bgGlow: "bg-amber-500/20",
        shadow: "shadow-[0_0_25px_rgba(251,191,36,0.3)]",
    },
    {
        title: "Clarity in Complexity",
        description: "Complexity turned into smart flow.",
        gradient: "from-purple-400/70 to-fuchsia-500/70",
        bgGlow: "bg-purple-500/20",
        shadow: "shadow-[0_0_25px_rgba(192,38,211,0.3)]",
    },
    {
        title: "Focused on Impact",
        description: "Measurable efficiency gains.",
        gradient: "from-cyan-400/70 to-blue-500/70",
        bgGlow: "bg-cyan-500/20",
        shadow: "shadow-[0_0_25px_rgba(34,211,238,0.3)]",
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
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
}

export default function DifferenceSection() {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    return (
        <section className={`relative w-full py-20 md:py-28 bg-black text-white overflow-hidden ${sans.className}`}>

            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05)_0%,rgba(147,51,234,0.03)_30%,transparent_65%)] pointer-events-none blur-[80px]" />

            <div className="absolute inset-0 opacity-[0.015]"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="relative z-10 w-full max-w-[1100px] mx-auto px-4 md:px-8"
            >
                {/* Section Header */}
                <motion.div variants={itemVariants} className="text-center mb-16 md:mb-20">
                    <span className="text-[10px] font-mono tracking-[0.4em] text-neutral-500 uppercase block mb-4">
                        Why OneZeroLabs
                    </span>
                    <h2 className={`text-4xl md:text-5xl lg:text-6xl text-white tracking-wide leading-[1.1] ${seasonFont.className}`}>
                        The OneZeroLabs{' '}
                        <span className="italic text-neutral-500">Difference.</span>
                    </h2>
                </motion.div>

                {/* Cards Grid — 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
                    {differences.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative bg-white/[0.03] backdrop-blur-xl
                                       border border-white/[0.08]
                                       rounded-[28px] p-5 md:p-6 h-full
                                       flex items-center gap-5 md:gap-6
                                       shadow-[0_0_30px_rgba(255,255,255,0.04)]
                                       cursor-default overflow-hidden"
                        >
                            {/* Glowing Icon Box */}
                            <div className={`relative flex-shrink-0 w-[88px] h-[88px] md:w-[100px] md:h-[100px]
                                           rounded-[20px] bg-gradient-to-br ${item.gradient}
                                           flex items-center justify-center overflow-hidden
                                           ${item.shadow}`}
                            >
                                {/* Inner glass depth */}
                                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.25)] rounded-[20px] pointer-events-none" />

                                {/* Abstract geometric shape */}
                                <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-[10px] border-[1.5px] border-white/50
                                               rotate-45 shadow-[0_0_12px_rgba(255,255,255,0.6)]
                                               mix-blend-overlay flex items-center justify-center">
                                    <div className="absolute w-full h-full rounded-[10px] border border-white/30 rotate-[30deg]" />
                                    <div className="absolute w-full h-full rounded-[10px] border border-white/30 -rotate-[30deg]" />
                                </div>

                                {/* Subtle inner glow */}
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-[20px] pointer-events-none" />
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[15px] md:text-[16px] font-semibold text-white/85 mb-1 leading-snug tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-[12px] md:text-[13px] text-neutral-500 leading-relaxed font-light">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
