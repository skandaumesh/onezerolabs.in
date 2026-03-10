'use client'

import { motion } from 'framer-motion'
import { Instrument_Serif } from 'next/font/google'

const seasonFont = Instrument_Serif({
    subsets: ['latin'],
    weight: '400',
    style: ['normal', 'italic'],
    display: 'swap',
})

export default function AboutSection() {
    return (
        <section className="relative py-24 md:py-40 px-4 md:px-8 bg-[#050505] overflow-hidden">
            {/* Ambient Base Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[600px] bg-[radial-gradient(ellipse,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none mix-blend-screen" />

            <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col gap-12 md:gap-24">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col gap-4"
                    >
                        <span className="text-white/30 font-mono text-[10px] md:text-sm tracking-[0.3em] uppercase">
                            [ / About The Studio ]
                        </span>

                        <h2 className={`text-6xl sm:text-7xl md:text-[90px] leading-[0.9] text-white tracking-wide ${seasonFont.className}`}>
                            OneZero<span className="text-white/40 italic">Labs.</span>
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className={`max-w-md text-white/50 text-lg md:text-2xl leading-relaxed ${seasonFont.className}`}
                    >
                        Not just software. Systems organizations can rely on every single day.
                    </motion.p>
                </div>

                {/* Bento Grid layout for content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

                    {/* Intro Block (Spans 2 columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="group relative col-span-1 md:col-span-2 rounded-[32px] md:rounded-[40px] border border-white/10 bg-[#08080a] p-8 md:p-12 transition-all hover:border-white/20 hover:bg-[#0c0c0e] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <h3 className="text-white/30 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase mb-6 md:mb-10">
                            Who We Are
                        </h3>
                        <p className={`text-white/80 text-2xl md:text-4xl leading-[1.3] font-light ${seasonFont.className}`}>
                            OneZeroLabs is a technology studio focused on building practical digital systems for modern institutions and businesses. We design and develop platforms that simplify operations, improve efficiency, and bring intelligent technology into real-world environments.
                        </p>
                        <p className={`mt-8 text-white/40 text-lg md:text-2xl leading-relaxed font-light ${seasonFont.className}`}>
                            Our work spans across institutional software, modern web platforms, custom applications, and AI-powered systems. Every solution we create is engineered with performance, scalability, and usability in mind.
                        </p>
                    </motion.div>

                    {/* Vision Block */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="group relative col-span-1 rounded-[32px] md:rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0a0a0c] to-[#050505] p-8 md:p-12 transition-all hover:border-white/20 shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]"
                    >
                        <h3 className="text-white/30 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase mb-6 md:mb-10 flex items-center justify-between">
                            Our Vision
                            <div className="w-2 h-2 rounded-full bg-blue-500/50 group-hover:bg-blue-400 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-500" />
                        </h3>
                        <p className={`text-white/70 text-xl leading-relaxed font-light ${seasonFont.className}`}>
                            To create intelligent digital systems that empower institutions and organizations to operate more efficiently, adapt to technological change, and thrive in the evolving digital world.
                        </p>
                    </motion.div>

                    {/* Philosophy Block */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="group relative col-span-1 lg:col-span-2 rounded-[32px] md:rounded-[40px] border border-white/10 bg-[#08080a] p-8 md:p-10 transition-all hover:border-white/20 hover:bg-[#0c0c0e]"
                    >
                        <h3 className="text-white/30 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase mb-8">
                            Our Philosophy
                        </h3>

                        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                            <div className="flex-1">
                                <p className={`text-white text-3xl md:text-4xl leading-tight font-light mb-6 ${seasonFont.className}`}>
                                    "Technology should simplify <span className="italic text-white/50">complexity,</span> not add to it."
                                </p>
                                <p className={`text-white/50 text-xl leading-relaxed font-light ${seasonFont.className}`}>
                                    At OneZeroLabs, we believe the best systems are those that solve real problems, integrate naturally, and remain reliable as organizations grow.
                                </p>
                            </div>

                            <div className="flex-1 border-l border-white/5 pl-6 md:pl-10">
                                <p className="text-white/40 text-xs uppercase tracking-widest mb-6 font-mono">The best systems:</p>
                                <ul className="space-y-4">
                                    {['Solve real problems', 'Integrate naturally into workflows', 'Remain reliable as organizations grow', 'Combine modern tech with practical usability'].map((item, i) => (
                                        <li key={i} className={`flex items-start gap-4 text-white/70 text-lg md:text-xl font-light ${seasonFont.className}`}>
                                            <span className="text-white/20 mt-1.5">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mission Block */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="group relative col-span-1 md:col-span-2 lg:col-span-1 rounded-[32px] md:rounded-[40px] border border-white/10 bg-[#08080a] p-8 md:p-12 transition-all hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.02)]"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-bl-[100px] pointer-events-none" />
                        <h3 className="text-white/30 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase mb-6 md:mb-10">
                            Our Mission
                        </h3>
                        <p className={`text-white/80 text-2xl leading-relaxed font-light mb-6 ${seasonFont.className}`}>
                            To design and deliver practical, reliable, and scalable digital solutions that solve real operational challenges.
                        </p>
                        <p className={`text-white/40 text-lg leading-relaxed font-light ${seasonFont.className}`}>
                            We bridge the gap between modern technology and real-world needs by building systems that are simple to use, powerful in capability, and built for long-term value.
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
