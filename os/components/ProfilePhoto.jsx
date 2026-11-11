'use client'

import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import { ActionErrorAlert, ProblemAlert } from '@/components/Alert'
import { showBanner } from '@/components/Banner'
import { ActionForm, ConfirmSubmit } from '@/components/forms'
import { Avatar, BUTTON_TEXT } from '@/components/ui'
import { removeProfilePhoto, setProfilePhoto } from '@/lib/actions/profile'
import { AVATAR_EDGE, MAX_AVATAR_BYTES } from '@/lib/avatar.mjs'
import { squarePhoto } from '@/lib/photo-client'

/**
 * Your photo at the top of Profile. Tap it, or "Choose photo", to pick one; it
 * is cropped to a square from the middle on the phone before it is sent.
 */
export function ProfilePhoto({ name, photo, children }) {
  const pickRef = useRef(null)
  const [state, run, saving] = useActionState(setProfilePhoto, null)
  const [preparing, setPreparing] = useState(false)
  const [problem, setProblem] = useState(null)
  const busy = preparing || saving

  useEffect(() => {
    if (state?.ok) showBanner('Photo updated')
  }, [state])

  const onPick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPreparing(true)
    try {
      const blob = await squarePhoto(file, AVATAR_EDGE, MAX_AVATAR_BYTES)
      const data = new FormData()
      data.set('photo', blob, 'photo.jpg')
      startTransition(() => run(data))
    } catch {
      setProblem('That photo could not be read. Try another one.')
    } finally {
      setPreparing(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input ref={pickRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={onPick} aria-label="Profile photo" />
      <button
        type="button"
        onClick={() => pickRef.current?.click()}
        disabled={busy}
        aria-label={photo ? 'Change your photo' : 'Add a photo'}
        className={`press relative shrink-0 rounded-full ${busy ? 'opacity-50' : ''}`}
      >
        <Avatar name={name} photo={photo} large />
        <span aria-hidden="true" className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[rgb(var(--surface))] bg-fill text-ink">
          <Camera size={12} strokeWidth={2.25} />
        </span>
      </button>
      <div className="min-w-0">
        {children}
        <div className="mt-1 flex flex-wrap items-center gap-x-4">
          <button type="button" onClick={() => pickRef.current?.click()} disabled={busy} className={BUTTON_TEXT}>
            {busy ? 'Saving…' : photo ? 'Change photo' : 'Choose photo'}
          </button>
          {/* The form stays when the photo has gone, so it can still say so. */}
          <ActionForm action={removeProfilePhoto} success="Photo removed" errorTitle="Couldn’t Remove" className="contents">
            {photo && !busy && (
              <ConfirmSubmit title="Remove Your Photo?" message="Your initial shows instead, for both of you." confirm="Remove" className={`${BUTTON_TEXT} text-late`}>
                Remove
              </ConfirmSubmit>
            )}
          </ActionForm>
        </div>
      </div>
      <ActionErrorAlert state={state} title="Couldn’t Save Photo" />
      {problem && <ProblemAlert title="Photo Not Added" message={problem} onClose={() => setProblem(null)} />}
    </div>
  )
}
