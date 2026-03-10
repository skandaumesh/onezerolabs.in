'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkle } from 'lucide-react'
import { Syne, DM_Sans } from 'next/font/google'

const syne = Syne({ subsets: ['latin'], weight: ['600', '700'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'] })

const features = [
    {
        title: 'Sovereign by design',
        description: 'Build, deploy, and run full-stack systems with complete control, crafted entirely for your institution.'
    },
    {
        title: 'State of the art Architecture',
        description: "Industry-leading frameworks built for scale, speed, and real-world operational context."
    },
    {
        title: 'Human at the core',
        description: 'Forward deployed engineers work alongside your teams to deliver production-ready software.'
    }
]

export default function CoreFeatures() {
    return (
        <section className="py-24 md:py-32 px-4 md:px-8 bg-black flex justify-center w-full">
            <div className="max-w-[1200px] w-full flex flex-col items-center">

                {/* Section Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 md:mb-16 text-center"
                >
                    <h2 className={`text-4xl md:text-5xl lg:text-[56px] font-medium text-white tracking-tight leading-tight ${syne.className}`}>
                        Powering the digital-first future
                    </h2>
                </motion.div>

                {/* Main Card Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full bg-[#09090C] border border-white/10 rounded-[2rem] p-4 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center shadow-2xl relative overflow-hidden"
                >
                    {/* Subtle background glow inside the card */}
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(123,110,246,0.03)_0%,transparent_50%)] pointer-events-none" />

                    {/* Left: Visual Area (matching the rounded blue aesthetic but in dark mode) */}
                    <div className="w-full lg:w-1/2 h-[350px] md:h-[400px] lg:h-[480px] rounded-3xl bg-[linear-gradient(135deg,#131128_0%,#09090C_100%)] relative overflow-hidden flex flex-col items-center justify-center border border-white/5">
                        {/* Soft glowing clouds effect */}
                        <div className="absolute bottom-[-10%] w-[120%] h-[60%] flex items-end justify-center">
                            {/* Center large cloud */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                                className="absolute bottom-0 w-[60%] h-[80%] bg-[#7B6EF6]/20 blur-[60px] rounded-full"
                            />
                            {/* Left cloud */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[70%] bg-[#4FC3F7]/10 blur-[50px] rounded-t-full"
                            />
                            {/* Right cloud */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }}
                                className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-[#7B6EF6]/10 blur-[50px] rounded-full"
                            />
                        </div>

                        {/* Central Lotus/Mandala/Geometric Object */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                            className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center mb-10 z-10"
                        >
                            {/* Layer 1 */}
                            <div className="absolute inset-0 border border-white/20 rounded-full scale-100" />
                            {/* Layer 2 */}
                            <div className="absolute inset-2 border border-[#7B6EF6]/50 rounded-[1.5rem] rotate-45" />
                            {/* Layer 3 */}
                            <div className="absolute inset-4 border border-[#4FC3F7]/40 rounded-full" />
                            {/* Layer 4 */}
                            <div className="absolute inset-6 border border-white/30 rounded-lg rotate-[30deg]" />
                            {/* Layer 5 */}
                            <div className="absolute inset-6 border border-white/30 rounded-lg rotate-[60deg]" />
                            {/* Center Dot */}
                            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                        </motion.div>
                    </div>

                    {/* Right: Features List */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center gap-10 lg:gap-14 py-4 pr-0 lg:pr-8 z-10">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.15 + 0.3 }}
                                className="flex items-start gap-5"
                            >
                                <div className="mt-1 flex-shrink-0 relative">
                                    {/* Star/Sparkle Icon with Glow */}
                                    <div className="absolute inset-0 bg-[#7B6EF6] blur-[8px] opacity-40 rounded-full" />
                                    <Sparkle className="w-7 h-7 text-white relative z-10 fill-[#7B6EF6]/40" strokeWidth={1.5} />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <h3 className={`text-xl md:text-2xl font-bold text-white ${syne.className}`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`text-[15px] md:text-base text-[#9CA3AF] leading-[1.6] max-w-sm ${dmSans.className}`}>
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </div>
        </section>
    )
}
