"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Linkedin, Mail } from 'lucide-react'

const sans = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
    adjustFontFallback: false,
})

// Every href below points at a route that exists. The previous version carried a
// LEGAL column of `#` placeholders (Terms, Refunds) and socials for accounts
// that were never set up -- dead links in a footer are worse than a short
// footer, so these columns are only as long as the site is.
const COLUMNS = [
    {
        title: 'Services',
        links: [
            { label: 'Digital Infrastructure', href: '/services/digital-infrastructure' },
            { label: 'AI & Automation', href: '/services/ai-automation' },
            { label: 'Operations & Systems', href: '/services/operations-systems' },
            { label: 'Analytics & Intelligence', href: '/services/analytics-intelligence' },
            { label: 'Brand & Social Media', href: '/services/brand-growth' },
        ],
    },
    {
        title: 'Solutions',
        links: [
            { label: 'Educational Institutions', href: '/solutions/education' },
            { label: 'Startups', href: '/solutions/startups' },
            { label: 'SMEs', href: '/solutions/smes' },
            { label: 'Healthcare', href: '/solutions/healthcare' },
            { label: 'Consultants', href: '/solutions/consultants' },
        ],
    },
    {
        title: 'Products',
        links: [
            { label: 'SAAME', href: '/products/saame' },
            { label: 'OZL Studio', href: '/products/studio' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About us', href: '/about' },
            { label: 'Our work', href: '/portfolio' },
            { label: 'Contact', href: '/contact' },
        ],
    },
    {
        title: 'Legal',
        links: [{ label: 'Privacy Policy', href: '/privacy-policy' }],
    },
]

export default function Footer() {
    return (
        <footer
            className={`relative w-full overflow-hidden text-ozl-ink ${sans.className}`}
            // Starts at pure white so it meets the white page above with no
            // seam, then settles into a cool blue-grey by the foot. The stops
            // are weighted late -- an even ramp would read as a visible band
            // across the middle of the link columns rather than a slow settle.
            style={{
                background:
                    "linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 22%, #F1F4FA 48%, #E4E9F3 76%, #DCE2EE 100%)",
            }}
        >
            <div className="mx-auto w-full max-w-[1400px] px-6 pt-16 md:px-16 md:pt-20">
                <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
                    {/* Brand column */}
                    <div className="shrink-0 lg:w-[260px]">
                        {/* Rendered well under its native size on purpose.
                            logo-print.png is only 259x159, and it is the ONLY
                            OneZeroLabs mark that works on a light background --
                            logo.png is white-on-transparent (invisible here) and
                            everything in public/logo/ belongs to clients. At 28px
                            tall the source still has ~5x headroom, so it stays
                            sharp even on a 2x display. */}
                        <Image
                            src="/logo-print.png"
                            alt="OneZeroLabs"
                            width={259}
                            height={159}
                            quality={100}
                            className="h-7 w-auto"
                        />

                        <p className="mt-4 text-[14px] leading-relaxed text-ozl-muted">
                            The digital side of your business, built and run from Bengaluru.
                        </p>

                        <span className="mt-8 block text-[13px] font-medium text-ozl-ink">
                            Find us at
                        </span>
                        <div className="mt-3 flex items-center gap-4">
                            <a
                                href="https://www.linkedin.com/company/onezerolabs"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="OneZeroLabs on LinkedIn"
                                className="text-ozl-muted transition-colors hover:text-ozl-ink"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="mailto:hello@onezerolabs.in"
                                aria-label="Email OneZeroLabs"
                                className="text-ozl-muted transition-colors hover:text-ozl-ink"
                            >
                                <Mail size={18} />
                            </a>
                        </div>

                        <div className="mt-10 rounded-xl border border-ozl-glassBorder p-4">
                            <p className="text-[13px] leading-relaxed text-ozl-muted">
                                &copy; {new Date().getFullYear()} OneZeroLabs.
                                <br />
                                All rights reserved.
                            </p>
                            <p className="mt-4 text-[13px] leading-relaxed text-ozl-muted">
                                Bengaluru, Karnataka 560064
                            </p>
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
                        {COLUMNS.map((col) => (
                            <nav key={col.title} aria-label={col.title}>
                                <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ozl-ink">
                                    {col.title}
                                </h3>
                                <ul className="space-y-3">
                                    {col.links.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-[14px] leading-snug text-ozl-muted transition-colors hover:text-ozl-ink"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}
                    </div>
                </div>
            </div>

            {/* Wordmark, full-bleed. Drawn as SVG rather than styled text
                because a `vw` font-size cannot guarantee an exact fit: the word
                is 11 characters, and any size that fills the frame at one
                viewport overflows or falls short at another. Here `textLength`
                with `lengthAdjust="spacingAndGlyphs"` forces the glyphs to span
                the viewBox exactly, so it is edge-to-edge at every width.

                The image is clipped to the letterforms with a clipPath, which
                also sidesteps the background-clip:text trap -- no transparent
                text fill, so nothing can render invisible. */}
            <div aria-hidden className="mx-auto mt-12 w-full max-w-[1150px] px-5 md:mt-16 md:px-10">
                <svg
                    viewBox="0 0 1200 186"
                    className={`block w-full ${sans.className}`}
                    role="presentation"
                >
                    <defs>
                        <clipPath id="ozl-wordmark-clip">
                            {/* Baseline sits below the viewBox so the feet of the
                                letters are cropped by the frame. */}
                            <text
                                x="0"
                                y="188"
                                fontSize="210"
                                fontWeight="700"
                                letterSpacing="-6"
                                textLength="1200"
                                lengthAdjust="spacingAndGlyphs"
                            >
                                OneZeroLabs
                            </text>
                        </clipPath>
                    </defs>
                    <image
                        href="/cta.jpg"
                        x="0"
                        y="0"
                        width="1200"
                        height="186"
                        preserveAspectRatio="xMidYMid slice"
                        clipPath="url(#ozl-wordmark-clip)"
                    />
                </svg>
            </div>
        </footer>
    )
}
