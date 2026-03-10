"use client"

import Link from 'next/link'
import { Inter, Instrument_Serif } from 'next/font/google'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowRight, Linkedin, Mail } from 'lucide-react'

const serif = Instrument_Serif({
    subsets: ['latin'],
    weight: '400',
    style: ['normal', 'italic'],
    display: 'swap',
})

const sans = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
})

const FOOTER_LINKS = [
    {
        title: 'COMPANY',
        links: [
            { label: 'About us', href: '/about' },
            { label: 'Services', href: '/services' },
            { label: 'Contact', href: '/contact' },
        ],
    },
    {
        title: 'LEGAL',
        links: [
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms & Conditions', href: '#' },
            { label: 'Refund Policy', href: '#' },
        ],
    },
    {
        title: 'SOCIALS',
        links: [
            { label: 'LinkedIn', href: '#' },
            { label: 'X (Twitter)', href: '#' },
            { label: 'Instagram', href: '#' },
        ],
    },
]

export default function Footer() {
    const pathname = usePathname();
    const excludedPaths = ['/about', '/contact', '/services'];

    if (excludedPaths.includes(pathname)) {
        return null;
    }

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    // Intense scrolling reveal effect variables
    const glowOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const glowScale = useTransform(scrollYProgress, [0, 1], [0.6, 1.2]);
    const glowY = useTransform(scrollYProgress, [0, 1], [150, 0]);

    return (
        <footer
            ref={containerRef}
            className={`relative w-full h-[680px] lg:h-[600px] bg-[#050505] text-white overflow-hidden ${sans.className}`}
            style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
        >
            {/* The fixed unrolling reveal effect, now enabled for mobile too. */}
            <div className="fixed bottom-0 left-0 w-full h-[680px] lg:h-[600px] flex flex-col justify-between py-10 px-6 md:px-16 overflow-hidden bg-[#050505]">
                {/* Scroll-Animated Bottom Source Glow (White) */}
                <motion.div
                    style={{ opacity: glowOpacity, scale: glowScale, y: glowY }}
                    className="absolute bottom-0 left-0 w-full h-full pointer-events-none z-0"
                >
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-full flex justify-center items-end">
                        {/* Massive soft rounded glow spreading upwards */}
                        <div className="absolute bottom-0 w-[1400px] h-[600px] bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.05)_40%,transparent_70%)] pointer-events-none opacity-30 md:opacity-100" />

                        {/* Intense core round glow at the bottom center */}
                        <div className="absolute -bottom-[100px] w-[800px] h-[400px] bg-white/10 blur-[80px] rounded-[100%] pointer-events-none opacity-30 md:opacity-100" />

                        {/* Brighter tight center glow */}
                        <div className="absolute -bottom-[50px] w-[400px] h-[200px] bg-white/20 blur-[60px] rounded-[100%] pointer-events-none opacity-30 md:opacity-100" />

                        {/* Solid base light source line */}
                        <div className="absolute -bottom-2 w-[300px] h-[4px] bg-white/80 blur-[2px] rounded-full opacity-40 md:opacity-100" />
                    </div>
                </motion.div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between w-full max-w-[1400px] mx-auto gap-12 lg:gap-0 mt-4 md:mt-8 flex-1">

                    {/* Left Side: CTA Content */}
                    <div className="flex flex-col max-w-[600px]">
                        <h2 className="text-[40px] md:text-[56px] lg:text-[64px] leading-[1] font-bold text-white tracking-tighter mb-4 md:mb-6 uppercase font-sans">
                            Let's<br />
                            Build<br />
                            The<br />
                            Future.
                        </h2>

                        <p className="text-white/60 text-[13px] md:text-[14px] font-light leading-[1.6] max-w-[360px] mb-6 md:mb-8">
                            Our digital lab is ready to architect your vision. From custom LLMs to high-performance SaaS, let's deploy something significant.
                        </p>

                        <Link href="/contact" className="group flex items-center justify-center lg:justify-between bg-white text-black px-6 py-3 rounded-full w-fit hover:bg-white/90 transition-colors duration-300 pointer-events-auto">
                            <span className="text-[11px] font-bold tracking-wider uppercase mr-3">Start a Project</span>
                            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Right Side: Contact Details */}
                    <div className="flex flex-col lg:justify-end lg:items-end mt-4 lg:mt-0 pb-10 lg:pb-0">
                        <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-3 leading-none">
                            TRANSMISSION PROTOCOL
                        </span>

                        <a href="mailto:hello@onezerolabs.in" className="text-[24px] md:text-[32px] font-medium text-white hover:text-white/80 transition-colors duration-300 pointer-events-auto mb-5 md:mb-6 tracking-tight">
                            hello@onezerolabs.in
                        </a>

                        <div className="flex items-center gap-3">
                            <a href="#" className="flex flex-nowrap shrink-0 items-center justify-center gap-2 border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors duration-300 pointer-events-auto">
                                <Linkedin size={14} className="text-white/60" />
                                <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest leading-none mt-[2px]">LinkedIn</span>
                            </a>
                            <a href="mailto:hello@onezerolabs.in" className="flex flex-nowrap shrink-0 items-center justify-center gap-2 border border-white/20 rounded-full px-5 py-3 hover:bg-white/10 transition-colors duration-300 pointer-events-auto">
                                <Mail size={14} className="text-white/60" />
                                <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest leading-none mt-[2px]">Email</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Copyright and Location */}
                <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end pb-8 lg:pb-2 mt-8 md:mt-auto">
                    <p className="text-[13px] text-white/40 tracking-wide font-medium">
                        Copyright OneZeroLabs 2026
                    </p>
                    <p className="text-[13px] text-white/40 tracking-wide font-medium text-left md:text-right">
                        All rights reserved, Bengaluru - 560064
                    </p>
                </div>
            </div>
        </footer>
    )
}
