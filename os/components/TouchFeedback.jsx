'use client'

import { useEffect } from 'react'

/** iOS Safari ignores :active, and so every press state, until a touch listener exists. */
export function TouchFeedback() {
  useEffect(() => {
    const noop = () => {}
    document.addEventListener('touchstart', noop, { passive: true })
    return () => document.removeEventListener('touchstart', noop)
  }, [])
  return null
}
