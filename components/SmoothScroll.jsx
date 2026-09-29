'use client'

import { useEffect, useRef } from 'react'

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)
  const rafHandleRef = useRef(null)

  useEffect(() => {
    let active = true

    // 1. Dynamic import Lenis safely on client-side only
    import('lenis').then(({ default: Lenis }) => {
      if (!active) return

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

      const onScroll = () => {
        window.dispatchEvent(new Event('scroll'))
      }
      
      lenisRef.current.on('scroll', onScroll)

      function raf(time) {
        lenisRef.current?.raf(time)
        rafHandleRef.current = requestAnimationFrame(raf)
      }

      rafHandleRef.current = requestAnimationFrame(raf)
    }).catch(err => {
      console.warn('Lenis smooth scroll failed to load:', err)
    })

    // 4. Cleanup Function
    return () => {
      active = false
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