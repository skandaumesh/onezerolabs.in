"use client"

import { motion } from "framer-motion"
import { Instrument_Serif, Inter } from 'next/font/google'
import Link from 'next/link'
import { WordsPullUp } from '@/components/ui/words-pull-up'

const serif = Instrument_Serif({
    subsets: ['latin'],
    weight: '400',
    style: ['normal', 'italic'],
    display: 'swap',
  adjustFontFallback: false,
})

const sans = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600'],
    display: 'swap',
  adjustFontFallback: false,
})




// The card's own entrance, as a variant rather than an inline object. Naming it
// is what lets framer hand the same state down to the heading's word reveal.
const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, when: "beforeChildren" },
    },
}

// The defaults are the homepage's own close. Inner pages pass their own
// heading and first-button label but keep the same card.
export default function CtaSection({
    title = "Let’s build the future.",
    primaryLabel = "Start a project",
    primaryHref = "/contact",
}) {
    return (
        <section className={`relative w-full py-12 md:py-16 bg-ozl-base text-ozl-ink px-4 md:px-8 flex items-center justify-center ${sans.className}`}>
            <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative w-full max-w-[950px] p-2 md:p-3 rounded-[40px] md:rounded-[48px] bg-ozl-glass backdrop-blur-sm border border-ozl-glassBorder shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]"
            >
                {/* Inner Card content container - text at top, button at bottom */}
                <div className="relative w-full min-h-[320px] md:min-h-[380px] rounded-[32px] md:rounded-[40px] overflow-hidden bg-[#101418] border border-white/60 flex flex-col items-center z-10 px-6 pt-9 md:pt-12 pb-7 md:pb-9 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">

                    {/* Video bed. Sits under the gradient stack rather than
                        replacing it: the dome is what keeps the heading legible,
                        so the clip reads through the lower half of the card where
                        the gradient has already fallen away to transparent.

                        muted is what makes autoPlay permissible at all, and
                        playsInline stops iOS hijacking it to fullscreen. */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        aria-hidden
                        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
                        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
                    />

                    {/* Legibility scrim. The blue dome and the white washes are
                        gone, but white text still cannot sit on a bright sky --
                        this is the same top/bottom darkening the reference hero
                        uses, and nothing more: no colour of its own. */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/35 via-transparent to-black/55"
                    />
                    <div className="noise-overlay pointer-events-none absolute inset-0 z-[1] opacity-[0.7] mix-blend-overlay" />

                    {/* Content Layer - justify-between keeps the center clear */}
                    <div className="relative z-20 w-full flex-1 flex flex-col items-center justify-between">

                        {/* Title text */}
                        <div className="w-full text-center flex justify-center">
                            <h2 className={`text-3xl sm:text-5xl lg:text-[64px] leading-[1.2] tracking-wide text-center text-white ${serif.className}`}>
                                <WordsPullUp
                                    trigger="inherit"
                                    className="justify-center"
                                    text={title}
                                    startDelay={0.15}
                                    delayStep={0.16}
                                    rise={36}
                                    fadeFrom="#FFFFFF"
                                    fadeTo="#CBD5E1"
                                />
                            </h2>
                        </div>

                        {/* Two commitment levels, all the way to the bottom */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex w-full max-w-md flex-col items-center justify-center gap-3 sm:flex-row"
                        >
                            <Link
                                href={primaryHref}
                                className="group relative inline-flex h-11 w-full items-center justify-center rounded-full bg-[#1E293B] px-6 py-2.5 text-sm font-medium text-white border border-white/20 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.35),inset_0_0_10px_rgba(255,255,255,0.1),0_4px_14px_rgba(15,23,42,0.25)] cursor-pointer transition-all duration-200 hover:bg-[#0F172A] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),0_6px_18px_rgba(15,23,42,0.35)] sm:w-auto [touch-action:manipulation]"
                            >
                                {primaryLabel}
                            </Link>

                            <Link
                                href="/contact?intent=review"
                                className="group relative inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-medium text-ozl-ink border border-black/10 shadow-[inset_0_2px_4px_rgba(100,116,139,0.3),inset_0_0_0_1px_rgba(148,163,184,0.18),0_2px_6px_rgba(0,0,0,0.05)] cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-[inset_0_2px_5px_rgba(100,116,139,0.38),inset_0_0_0_1px_rgba(148,163,184,0.25),0_4px_10px_rgba(0,0,0,0.08)] sm:w-auto"
                            >
                                Get a free review
                            </Link>
                        </motion.div>

                    </div>
                </div>
            </motion.div>
        </section>
    )
}
