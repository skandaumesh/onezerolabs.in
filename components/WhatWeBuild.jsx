"use client"

import { motion } from "framer-motion"
import { Instrument_Serif, Inter } from 'next/font/google'
import { GraduationCap, Globe, Cpu, Sparkles, BarChart3, Palette } from 'lucide-react'
import Link from 'next/link'

const serif = Instrument_Serif({
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

const builds = [
    {
        tag: 'FLAGSHIP PRODUCT',
        title: 'AI-Powered Academic Management',
        date: 'Deployed & Live',
        gradient: 'from-blue-500 via-indigo-500 to-purple-600',
        icon: GraduationCap,
        href: '/portfolio/LMS',
    },
    {
        tag: 'SERVICE',
        title: 'Web Architecture & Design',
        date: 'Ongoing',
        gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
        icon: Globe,
        href: '/services',
    },
    {
        tag: 'SERVICE',
        title: 'Product & Platform Engineering',
        date: 'Ongoing',
        gradient: 'from-rose-500 via-pink-500 to-red-600',
        icon: Cpu,
        href: '/services',
    },
]

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
}

export default function WhatWeBuild() {
    return (
        <section className={`relative w-full py-20 md:py-28 bg-black text-white overflow-hidden ${sans.className}`}>

            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none blur-[80px]" />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                className="relative z-10 w-full max-w-[1100px] mx-auto px-4 md:px-8"
            >
                {/* Section Header */}
                <motion.div variants={itemVariants} className="text-center mb-16 md:mb-20">
                    <span className="text-[10px] font-mono tracking-[0.4em] text-neutral-500 uppercase block mb-4">
                        Products & Projects
                    </span>
                    <h2 className={`text-4xl md:text-5xl lg:text-6xl text-white tracking-wide leading-[1.1] ${serif.className}`}>
                        What We{' '}
                        <span className="italic text-neutral-500">Build.</span>
                    </h2>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                    {builds.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <motion.div key={index} variants={itemVariants}>
                                <Link href={item.href}>
                                    <div className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]
                                                    rounded-[32px] overflow-hidden cursor-pointer
                                                    shadow-[0_0_30px_rgba(255,255,255,0.03)]
                                                    hover:border-white/[0.15] hover:shadow-[0_0_40px_rgba(255,255,255,0.06)]
                                                    transition-all duration-500">

                                        {/* Top: Tag + Title + Date */}
                                        <div className="p-6 pb-4">
                                            <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">{item.tag}</span>
                                            <h3 className="text-[17px] md:text-[18px] font-semibold text-white/90 mt-2 mb-1 leading-snug tracking-tight group-hover:text-white transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-[13px] text-neutral-600 font-light">
                                                {item.date}
                                            </p>
                                        </div>

                                        {/* Bottom: Gradient Visual with Icon */}
                                        <div className={`relative w-full h-[180px] bg-gradient-to-br ${item.gradient} overflow-hidden`}>
                                            <div className="absolute inset-0 bg-black/15" />

                                            {/* Center Icon */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Icon size={52} strokeWidth={1} className="text-white/50 group-hover:text-white/80 group-hover:scale-110 transition-all duration-500" />
                                            </div>

                                            {/* Decorative blurs */}
                                            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                                            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </motion.div>
        </section>
    )
}
