'use client'

import React from 'react'
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
})

const tickerItems = [
    'Institutional Software',
    'AI Integration',
    'Mobile Apps',
    'Full-Stack Web',
    'Data Chatbots',
    'Advanced SEO',
    'Graphic Design',
    'Social Media',
]

function GlowDot() {
    return (
        <span
            className="w-1 h-1 rounded-full bg-[#7B6EF6] inline-block flex-shrink-0 mx-6"
            style={{ boxShadow: '0 0 8px #7B6EF6' }}
        />
    )
}

export default function Ticker() {
    return (
        <section className="relative border-t border-b border-white/[0.07] bg-white/[0.01] overflow-hidden py-5">
            <div className="marquee-track">
                {[...Array(2)].map((_, setIndex) => (
                    <div key={setIndex} className="flex items-center flex-shrink-0">
                        {tickerItems.map((item, i) => (
                            <React.Fragment key={`${setIndex}-${i}`}>
                                <span
                                    className={`text-[11px] uppercase tracking-[0.12em] text-[#4A4A6A] whitespace-nowrap ${dmSans.className}`}
                                >
                                    {item}
                                </span>
                                <GlowDot />
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    )
}
