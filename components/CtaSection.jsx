"use client"

import { motion } from "framer-motion"
import { Instrument_Serif, Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

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




export default function CtaSection() {
    return (
        <section className={`relative w-full py-16 md:py-24 bg-black text-white px-4 md:px-8 flex items-center justify-center ${sans.className}`}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-[950px] p-2 md:p-3 rounded-[40px] md:rounded-[48px] bg-[#0c0c0e] border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.07)]"
            >
                {/* Inner Card content container - text at top, button at bottom */}
                <div className="relative w-full min-h-[480px] md:min-h-[520px] rounded-[32px] md:rounded-[40px] overflow-hidden bg-black border border-white/[0.15] flex flex-col items-center z-10 px-6 pt-4 md:pt-7 pb-8 md:pb-10 text-center shadow-[inset_0_0_20px_rgba(255,255,255,0.03)]">

                    {/* Background Image Setup - Lightened for visibility */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/chat.png"
                            alt="Glowing nature landscape"
                            fill
                            className="object-cover object-center"
                        />
                        {/* Much lighter overlays to bring out the image details */}
                        <div className="absolute inset-0 bg-black/15" />
                        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    {/* Content Layer - justify-between keeps the center clear */}
                    <div className="relative z-20 w-full flex-1 flex flex-col items-center justify-between">

                        {/* Title text - Split into 3 lines on mobile for perfect centering */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="w-full text-center flex justify-center"
                        >
                            <h2 className={`text-[34px] md:text-[48px] lg:text-[56px] leading-[1.3] md:leading-[1.2] text-white tracking-wide drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] text-center ${serif.className}`} style={{ textShadow: '0 0 5px rgba(255,255,255,0.2)' }}>
                                Build the future <br className="md:hidden" />
                                of your project <br />
                                with OneZeroLabs.
                            </h2>
                        </motion.div>

                        {/* Button - Pushed to the bottom with transparent bg */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="w-full flex justify-center"
                        >
                            <Link href="/contact" className="group relative flex items-center justify-center px-10 py-3.5 md:px-14 md:py-4 bg-white/0 hover:bg-white/[0.05] backdrop-blur-md border border-white/20 rounded-full transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:border-white/50 overflow-hidden">
                                {/* Bright glowing horizontal flare along the top border */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] md:w-[200px] h-px bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_rgba(255,255,255,1)]" />

                                <span className="relative z-10 text-white text-[15px] md:text-[17px] font-bold tracking-wider">
                                    Get Started Now
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
