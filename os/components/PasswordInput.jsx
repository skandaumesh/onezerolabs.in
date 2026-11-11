'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { CONTROL } from '@/components/ui'

/**
 * A password field with an eye at its end, as on iPhone: tap to see what was
 * typed, tap again to hide it. The field keeps focus and the keyboard stays up.
 */
export function PasswordInput(props) {
  const [shown, setShown] = useState(false)
  return (
    <span className="relative block">
      <input {...props} type={shown ? 'text' : 'password'} autoCapitalize="none" autoCorrect="off" spellCheck={false} className={`${CONTROL} pr-12`} />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        onMouseDown={(e) => e.preventDefault()}
        aria-label={shown ? 'Hide password' : 'Show password'}
        aria-pressed={shown}
        className="press absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      >
        {shown ? <EyeOff size={19} strokeWidth={1.9} aria-hidden="true" /> : <Eye size={19} strokeWidth={1.9} aria-hidden="true" />}
      </button>
    </span>
  )
}
