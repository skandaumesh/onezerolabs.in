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

// A simple 4-pointed star component to match the reference
const FourPointStar = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
        <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" fill="currentColor" />
    </svg>
)


export default function CtaSection() {
    return (
        <section className={`relative w-full py-16 md:py-24 bg-black text-white px-4 md:px-8 flex items-center justify-center ${sans.className}`}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-[1050px] p-2 md:p-3 rounded-[48px] bg-[#0c0c0e] border border-white/10"
            >
                {/* Inner Card content container - double frame effect */}
                <div className="relative w-full min-h-[380px] md:min-h-[400px] rounded-[40px] overflow-hidden bg-black border border-white/[0.15] flex flex-col items-center justify-center pt-20 pb-12 px-6 text-center z-10 shadow-[inset_0_0_80px_rgba(255,255,255,0.08)]">

                    {/* Background Image Setup */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/cta_sec.jpg"
                            alt="Glowing nature landscape"
                            fill
                            className="object-cover object-center scale-110"
                        />
                        {/* Light dark overlay just to keep text readable, no muddy radial blending */}
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Inner shadow glow - Left, Right Side and Bottom */}
                    <div className="absolute inset-0 shadow-[inset_-30px_-40px_80px_rgba(255,255,255,0.15),inset_30px_-40px_80px_rgba(255,255,255,0.15)] pointer-events-none z-10" />

                    {/* Content */}
                    <div className="relative z-20 flex flex-col items-center max-w-2xl mx-auto w-full h-full justify-between mt-10">

                        <div className="flex flex-col items-center w-full">
                            {/* Title text */}
                            <h2 className={`text-[32px] md:text-[48px] lg:text-[52px] leading-[1.2] text-white tracking-wide mb-10 drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] ${serif.className}`} style={{ textShadow: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2)' }}>
                                Build the future of your project <br />
                                with OneZeroLabs.
                            </h2>

                            {/* Centered Star immediately below the text */}
                            <div className="relative flex justify-center w-full mb-10">
                                {/* Atmospheric Glow perfectly behind the star */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 blur-[30px] rounded-full pointer-events-none z-0" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/50 blur-[15px] rounded-full pointer-events-none z-0" />

                                {/* Star Icon */}
                                <div className="relative z-20 text-white pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                                    <FourPointStar />
                                </div>
                            </div>
                        </div>

                        <div className="relative mt-8 flex justify-center items-center">
                            {/* CTA Button Wrapper */}
                            <div className="relative">
                                {/* CTA Button */}
                                <Link href="/contact" className="group relative flex items-center justify-center px-12 py-4 bg-[#11131a]/60 backdrop-blur-xl border border-white/20 rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:bg-[#1a1c24]/80 hover:border-white/40 z-10 w-full md:w-auto overflow-hidden">
                                    {/* Bright glowing horizontal flare along the top border */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[180px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_rgba(255,255,255,1)]" />

                                    <span className="relative z-10 text-white text-[16px] font-bold tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                        Get Started Now
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
