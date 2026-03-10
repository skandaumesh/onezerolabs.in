'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Syne, Manrope } from 'next/font/google'
import { Instrument_Serif } from 'next/font/google'

// --- FONTS ---
const syne = Syne({ subsets: ['latin'], weight: ['700', '800'] })
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500'] })
const seasonFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
})

// --- DATA ---
const menuItems = [
  { label: 'Work', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

// --- VARIANTS ---
const menuVariants = {
  initial: { y: "-100%" },
  animate: {
    y: "0%",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
  },
  exit: {
    y: "-100%",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
  }
}

// --- MENU ITEM ---
const MenuItem = ({ item, index, closeMenu }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 + (index * 0.1) }}
      className="w-full mb-3 md:mb-5"
    >
      <Link
        href={item.href}
        onClick={closeMenu}
        className={`group relative flex items-center justify-between w-full p-4 md:p-6 
                   rounded-[32px] border border-white/5 bg-[#0a0a0c] 
                   shadow-[0_0_20px_rgba(255,255,255,0.02)]
                   transition-all duration-500 ease-out overflow-hidden
                   hover:border-white/20 hover:bg-[#0f0f12] hover:-translate-y-1 
                   hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]`}
      >
        {/* Subtle inner white glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300%] bg-white/[0.03] blur-[40px]`} />
        </div>

        {/* Left Side: Text only */}
        <div className="flex items-center gap-4 md:gap-6 relative z-10 w-full text-left pl-2 md:pl-4">
          <span className={`text-4xl md:text-5xl text-white/50 group-hover:text-white transition-all duration-500 tracking-wide group-hover:translate-x-2 ${seasonFont.className}`}>
            {item.label}
          </span>

          {/* Right Side: Arrow */}
          <div className="ml-auto relative z-10 pr-2 md:pr-4 text-white/20 group-hover:text-white/80 transition-all duration-500 group-hover:translate-x-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// --- MAIN COMPONENT ---
export default function NavbarResponsive() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
  }, [isOpen])

  return (
    <>
      {/* --- HEADER --- */}
      <header className={`fixed top-0 left-0 w-full z-[100] pt-6 pb-20 px-6 md:px-12 flex justify-between items-start text-white bg-gradient-to-b from-[#000]/80 via-[#000]/40 to-transparent pointer-events-none ${manrope.className}`}>

        {/* LEFT: LOGO */}
        <Link href="/" className="relative z-[110] flex items-center gap-3 pointer-events-auto hover:opacity-80 transition-opacity mt-1">
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain invert brightness-0 grayscale"
              priority
            />
          </div>
          <span className={`text-xl md:text-2xl font-bold tracking-tight text-white ${syne.className}`}>
            OneZeroLabs
          </span>
        </Link>

        {/* RIGHT: TRIGGER */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="z-[110] pointer-events-auto focus:outline-none group px-7 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        >
          <span className={`text-[11px] md:text-xs text-white font-medium uppercase tracking-[0.2em]`}>
            {isOpen ? 'Close' : 'Menu'}
          </span>
        </button>

      </header>

      {/* --- MENU OVERLAY --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-[#050505]/98 backdrop-blur-2xl z-[90] flex flex-col justify-center items-center pt-24 pb-12"
          >
            {/* Subtle Texture */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

            <div className="w-full max-w-2xl flex flex-col relative z-20 px-4">
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  item={item}
                  index={index}
                  closeMenu={() => setIsOpen(false)}
                />
              ))}
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              className={`absolute bottom-6 md:bottom-8 w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-4 text-white/30 text-[10px] md:text-xs font-semibold uppercase tracking-widest ${manrope.className}`}
            >
              <div className="order-2 md:order-1">OneZeroLabs © {new Date().getFullYear()}</div>
              <div className="flex gap-6 order-1 md:order-2">

                <a href="https://www.linkedin.com/company/onezerolabs/" className="hover:text-white transition-colors">LinkedIn</a>

              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
