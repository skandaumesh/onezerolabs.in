'use client'

import { useSyncExternalStore } from 'react'
import { Moon, Sun, SunMoon } from 'lucide-react'

const KEY = 'os-theme'
const CHANGED = 'os-theme-changed'

const OPTIONS = [
  { value: 'auto', label: 'Match device', icon: SunMoon },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
]

const read = () => {
  try {
    return localStorage.getItem(KEY) ?? 'auto'
  } catch {
    return 'auto'
  }
}

const subscribe = (notify) => {
  window.addEventListener(CHANGED, notify)
  window.addEventListener('storage', notify)
  return () => {
    window.removeEventListener(CHANGED, notify)
    window.removeEventListener('storage', notify)
  }
}

const choose = (value) => {
  try {
    if (value === 'auto') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, value)
  } catch {
    return
  }
  // Cross-fades the whole page: an instant jump in brightness is hard on the eyes.
  const apply = () => window.__applyTheme?.()
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (document.startViewTransition && !calm) document.startViewTransition(apply)
  else apply()
  window.dispatchEvent(new Event(CHANGED))
}

/** Three choices: match the device, always light, always dark. Remembered per device. */
export function ThemeSwitch() {
  // Null on the server, which cannot know this device's choice.
  const current = useSyncExternalStore(subscribe, read, () => null)
  return (
    <div role="radiogroup" aria-label="Appearance" className="grid grid-cols-3 gap-0.5 rounded-[0.9rem] bg-fill p-0.5">
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={current === value}
          aria-label={label}
          onClick={() => choose(value)}
          className={`press flex min-h-[3.5rem] flex-col items-center justify-center gap-1 rounded-xl px-1 text-foot ${
            current === value ? 'bg-thumb font-medium text-ink shadow-[0_1px_3px_rgba(0,0,0,0.12)]' : 'text-ink2'
          }`}
        >
          <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  )
}
