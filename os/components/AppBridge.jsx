'use client'

import { startTransition, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { markNotificationsRead } from '@/lib/actions/notifications'

/** Fired after anything is saved, so the Android app can set its reminders again. */
export const SAVED_EVENT = 'ozl:saved'
export const announceSaved = () => window.dispatchEvent(new Event(SAVED_EVENT))

/** The Android app's bridge, or null in a browser. */
const app = () => (typeof window !== 'undefined' ? (window.OZLAndroid ?? null) : null)

/** Light or dark, from the colour the page is actually painted, whatever the theme setting. */
const isDark = (rgb) => {
  const [r, g, b] = (rgb.match(/\d+/g) ?? [255, 255, 255]).map(Number)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128
}

/**
 * Talks to the Android app when the page runs inside it: asks it to refresh its
 * reminders after a save, on every new page and when it comes back to the
 * front, and tells it the page colour so the phone's status bar matches.
 */
export function AppBridge() {
  const pathname = usePathname()

  useEffect(() => {
    app()?.syncNow?.()
  }, [pathname])

  useEffect(() => {
    const bridge = app()
    if (!bridge) return
    const sync = () => bridge.syncNow?.()
    const onVisible = () => document.visibilityState === 'visible' && sync()
    const paintBars = () => {
      const color = getComputedStyle(document.body).backgroundColor
      bridge.setBars?.(color, isDark(color))
    }
    paintBars()
    const watch = new MutationObserver(paintBars)
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    const scheme = window.matchMedia('(prefers-color-scheme: dark)')
    scheme.addEventListener('change', paintBars)
    window.addEventListener(SAVED_EVENT, sync)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      watch.disconnect()
      scheme.removeEventListener('change', paintBars)
      window.removeEventListener(SAVED_EVENT, sync)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return null
}

/** Marks every notice read once the list has been seen. */
export function MarkRead({ unread }) {
  useEffect(() => {
    if (unread > 0) startTransition(() => markNotificationsRead())
  }, [unread])
  return null
}
