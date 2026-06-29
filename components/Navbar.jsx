'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Syne } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const navigationData = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Services',
    href: '/services',
    links: [
      { label: 'Digital Infrastructure', href: '/services/digital-infrastructure' },
      { label: 'AI & Automation', href: '/services/ai-automation' },
      { label: 'Operations & Systems', href: '/services/operations-systems' },
      { label: 'Analytics & Intelligence', href: '/services/analytics-intelligence' },
      { label: 'Brand & Growth', href: '/services/brand-growth' },
    ]
  },
  {
    label: 'Solutions',
    href: '/solutions',
    links: [
      { label: 'Educational Institutions', href: '/solutions/education' },
      { label: 'Startups', href: '/solutions/startups' },
      { label: 'SMEs', href: '/solutions/smes' },
      { label: 'Healthcare', href: '/solutions/healthcare' },
      { label: 'Consultants', href: '/solutions/consultants' },
    ]
  },
  {
    label: 'SAAME',
    href: '/products/saame',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
]

function NavItem({ item, handleScrollClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasDropdown = item.links && item.links.length > 0;

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {hasDropdown ? (
        <button 
          onClick={(e) => e.preventDefault()}
          className="text-white/70 group-hover:text-white transition-colors text-[14px] xl:text-[15px] font-medium tracking-wide flex items-center gap-1.5 py-2 cursor-default"
        >
          {item.label}
        </button>
      ) : (
        <Link 
          href={item.href}
          onClick={(e) => handleScrollClick(e, item.href)}
          className="text-white/70 group-hover:text-white transition-colors text-[14px] xl:text-[15px] font-medium tracking-wide flex items-center gap-1.5 py-2"
        >
          {item.label}
        </Link>
      )}

      {hasDropdown && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-1/2 -translate-x-1/2 pt-2 pb-4"
            >
              <div className="bg-[#090909] border border-white/10 rounded-2xl p-2 w-[240px] shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                {item.links.map((sub, sIdx) => (
                  <Link
                    key={sIdx}
                    href={sub.href}
                    onClick={(e) => {
                      setIsOpen(false);
                      handleScrollClick(e, sub.href);
                    }}
                    className="block px-4 py-3 text-[14px] text-white/70 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

function MobileAccordionItem({ group, handleScrollClick, delay }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex flex-col min-w-[200px]"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="font-[family-name:var(--font-instrument-serif)] text-3xl md:text-4xl text-white mb-4 hover:text-white/80 transition-colors flex items-center justify-between w-full text-left"
      >
        {group.label}
        <svg 
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 border-l border-white/20 pl-4 pb-4">
              <Link 
                href={group.href}
                onClick={(e) => handleScrollClick(e, group.href)}
                className="text-white/90 font-medium text-sm md:text-[15px] hover:text-white transition-colors tracking-wide block mb-1"
              >
                Overview
              </Link>
              {group.links.map((link, linkIdx) => (
                <Link 
                  key={linkIdx}
                  href={link.href}
                  onClick={(e) => handleScrollClick(e, link.href)}
                  className="text-white/60 text-sm md:text-[15px] hover:text-white transition-colors tracking-wide block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleScrollClick = (e, href) => {
    if (href.startsWith('/#')) {
      if (window.location.pathname === '/') {
        e.preventDefault();
        setIsOpen(false);
        const targetId = href.replace('/#', '');
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  return (
    <>
      {/* Floating Pill Navbar Wrapper (Edge-to-edge on mobile) */}
      <div className="fixed top-0 md:top-3 left-1/2 -translate-x-1/2 w-full md:w-[95%] max-w-[1400px] z-[100]">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`relative flex items-center justify-between px-6 md:px-8 py-3 md:py-2 transition-all duration-300 md:rounded-full ${
            scrolled 
              ? 'bg-black/50 backdrop-blur-md md:bg-black/80 md:backdrop-blur-md border-transparent md:border border-transparent md:border-white/20 shadow-none md:shadow-lg md:shadow-black/50' 
              : 'bg-transparent md:bg-black/40 md:backdrop-blur-sm border-transparent md:border-white/10'
          }`}
        >
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-3 relative z-10 shrink-0">
            <div className="relative w-12 h-12 md:w-14 md:h-14">
              <Image
                src="/logo.png"
                alt="OneZeroLabs"
                fill
                className="object-contain invert brightness-0 grayscale"
                priority
              />
            </div>
            <span className={`text-white text-xl md:text-2xl font-bold tracking-tight ${syne.className}`}>
              OneZeroLabs
            </span>
          </Link>

          {/* Center: Inline Links (Desktop Only) */}
          <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 absolute left-1/2 -translate-x-1/2 w-max">
            {navigationData.map((item, idx) => (
              <NavItem key={idx} item={item} handleScrollClick={handleScrollClick} />
            ))}
          </div>

          {/* Right: CTA and Mobile Menu Toggle */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Primary CTA */}
            <Link 
              href="/contact" 
              className="hidden md:flex items-center gap-2 bg-white text-black px-5 lg:px-6 py-2.5 rounded-full text-[13px] uppercase tracking-wider font-semibold hover:bg-white/90 transition-colors"
            >
              Book a Call
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
            


            {/* Hamburger Menu (visible on mobile only) */}
            <button 
              onClick={() => setIsOpen(true)}
              className="text-white lg:hidden flex items-center justify-center px-4 h-9 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-[12px] font-medium tracking-widest uppercase"
              aria-label="Open menu"
            >
              Menu
            </button>
          </div>
        </motion.div>
      </div>

      {/* Full-Screen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[200] bg-black text-white flex flex-col overflow-y-auto"
          >
            {/* Top Bar for Overlay */}
            <div className="flex items-center justify-between px-6 md:px-12 h-[88px] shrink-0 border-b border-white/10 relative">
              
              {/* Logo on Left */}
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 relative z-10 shrink-0">
                <div className="relative w-12 h-12 md:w-14 md:h-14">
                  <Image
                    src="/logo.png"
                    alt="OneZeroLabs"
                    fill
                    className="object-contain invert brightness-0 grayscale"
                  />
                </div>
                <span className={`text-white text-xl md:text-2xl font-bold tracking-tight ${syne.className}`}>
                  OneZeroLabs
                </span>
              </Link>

              {/* Close Button on Right */}
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white flex items-center justify-center px-4 h-9 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-[12px] font-medium tracking-widest uppercase relative z-10 shrink-0"
                aria-label="Close menu"
              >
                Close
              </button>
            </div>

            {/* Menu Content Grid */}
            <div className="flex-1 px-6 md:px-12 py-8 md:py-24 max-w-7xl mx-auto w-full flex flex-col md:flex-row md:flex-wrap gap-8 md:gap-24">
              {navigationData.map((group, idx) => {
                // Skip contact in the loop since it has a dedicated block below
                if (group.label === 'Contact') return null;

                if (!group.links) {
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
                      className="flex flex-col min-w-[200px]"
                    >
                      <Link 
                        href={group.href}
                        onClick={(e) => handleScrollClick(e, group.href)}
                        className="font-[family-name:var(--font-instrument-serif)] text-3xl md:text-4xl text-white mb-4 hover:text-white/80 transition-colors"
                      >
                        {group.label}
                      </Link>
                    </motion.div>
                  )
                }
                
                return (
                  <MobileAccordionItem 
                    key={idx} 
                    group={group} 
                    handleScrollClick={handleScrollClick} 
                    delay={0.1 + idx * 0.05} 
                  />
                )
              })}
              
              {/* Contact Group */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navigationData.length * 0.05, duration: 0.4 }}
                className="flex flex-col min-w-[200px]"
              >
                <Link 
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="font-[family-name:var(--font-instrument-serif)] text-3xl md:text-4xl text-white mb-4 hover:text-white/80 transition-colors"
                >
                  Book a Discovery Call
                </Link>
                <div className="flex flex-col gap-3 border-l border-white/20 pl-4">
                  <Link 
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="text-white/60 text-sm md:text-[15px] hover:text-white transition-colors tracking-wide"
                  >
                    Start a Project
                  </Link>
                  <a 
                    href="mailto:hello@onezerolabs.in"
                    className="text-white/60 text-sm md:text-[15px] hover:text-white transition-colors tracking-wide"
                  >
                    hello@onezerolabs.in
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Overlay Bottom Row */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="px-6 md:px-12 py-8 mt-auto shrink-0 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wider text-white/50"
            >
              <div className="flex items-center gap-6">
                <a href="https://www.linkedin.com/company/onezerolabs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
              <div>© 2026 OneZeroLabs · Bengaluru</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
