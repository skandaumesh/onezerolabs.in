'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)
  const rafHandleRef = useRef(null)

  useEffect(() => {
    // 1. Initialize Lenis
    if (!lenisRef.current) {
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false, // Keep false for native mobile feel
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
        autoResize: true,
      })
    }

    // 2. Sync with Framer Motion / Scroll Triggers
    const onScroll = (e) => {
      window.dispatchEvent(new Event('scroll')) 
    }
    
    lenisRef.current.on('scroll', onScroll)

    // 3. RAF Loop (With Cleanup Support)
    function raf(time) {
      lenisRef.current?.raf(time)
      rafHandleRef.current = requestAnimationFrame(raf)
    }

    rafHandleRef.current = requestAnimationFrame(raf)

    // 4. Cleanup Function
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      if (rafHandleRef.current) {
        cancelAnimationFrame(rafHandleRef.current)
        rafHandleRef.current = null
      }
    }
  }, [])

  return <>{children}</>
}