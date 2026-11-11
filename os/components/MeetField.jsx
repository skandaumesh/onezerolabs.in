'use client'

import { useEffect, useRef, useState } from 'react'
import { Video } from 'lucide-react'
import { Field, Input } from '@/components/ui'
import { looksLikeMeeting, NEW_MEET } from '@/lib/meet.mjs'

/**
 * Asks for a Google Meet link once the task's name, typed in the same form,
 * sounds like a meeting, or when there is a link already. "New Meet" opens Google
 * Meet to make one; its link is then pasted here.
 */
export function MeetField({ defaultValue = '', title = '', className = '' }) {
  const ref = useRef(null)
  const [meeting, setMeeting] = useState(looksLikeMeeting(title))
  const [hasLink, setHasLink] = useState(Boolean(defaultValue))

  useEffect(() => {
    const form = ref.current?.closest('form')
    const field = form?.querySelector('[name=title]')
    if (!form || !field) return
    const check = () => setMeeting(looksLikeMeeting(field.value))
    // After "Add task" the form clears for the next one; so does this field.
    const cleared = () => setTimeout(() => {
      check()
      setHasLink(Boolean(form.querySelector('[name=meet_link]')?.value))
    })
    check()
    field.addEventListener('input', check)
    form.addEventListener('reset', cleared)
    return () => {
      field.removeEventListener('input', check)
      form.removeEventListener('reset', cleared)
    }
  }, [])

  return (
    <div ref={ref} className={meeting || hasLink ? className : 'hidden'}>
      <Field label="Google Meet link" hint="Paste the link, or tap New Meet to make one. Leave it empty for a meeting in person.">
        <div className="flex gap-2">
          <Input
            // A new saved link (tidied by the server) replaces what was typed.
            key={defaultValue ?? ''}
            name="meet_link"
            defaultValue={defaultValue ?? ''}
            onInput={(e) => setHasLink(Boolean(e.currentTarget.value))}
            inputMode="url"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="meet.google.com/abc-defg-hij"
          />
          <a
            href={NEW_MEET}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-fill px-3 text-sub font-medium text-accent hover:bg-fill-hover md:min-h-10"
          >
            <Video size={17} aria-hidden="true" />
            New Meet
          </a>
        </div>
      </Field>
    </div>
  )
}

/** A Join button for a meeting with a Meet link. In the Android app it opens the Meet app. */
export function JoinMeet({ link, compact = false }) {
  if (!link) return null
  if (compact) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="press relative z-10 inline-flex items-center gap-1 rounded-full bg-good-soft px-2 py-0.5 text-cap font-semibold text-good"
      >
        <Video size={12} aria-hidden="true" />
        Join
      </a>
    )
  }
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="press inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-good px-5 text-body font-semibold text-white md:min-h-10 md:text-sub"
    >
      <Video size={18} aria-hidden="true" />
      Join Google Meet
    </a>
  )
}
