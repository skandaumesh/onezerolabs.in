'use client'

import { createContext, startTransition, useActionState, useContext, useEffect, useOptimistic, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { ActionErrorAlert, Alert } from '@/components/Alert'
import { announceSaved } from '@/components/AppBridge'
import { showBanner } from '@/components/Banner'
import { useSheet } from '@/components/Sheet'

const PendingContext = createContext(false)

/**
 * A form wired to a server action. An error it returns opens an alert headed
 * `errorTitle`, then stays beside the form as a reminder while it gets fixed.
 *
 * It calls the action from onSubmit rather than through <form action>, because
 * React resets a form after an action prop completes. That would wipe what was
 * typed whenever validation failed. On success, `reset` clears the form for
 * adding another, `success` shows in a banner, and `closeOnSuccess` closes its sheet.
 */
export function ActionForm({ action, reset = false, closeOnSuccess = false, success, errorTitle = 'Couldn’t Save', className, children, ...rest }) {
  const [state, run, pending] = useActionState(action, null)
  const formRef = useRef(null)
  const sheet = useSheet()

  useEffect(() => {
    if (!state?.ok) return
    announceSaved()
    if (success) showBanner(success)
    if (closeOnSuccess) sheet?.close()
    if (reset) {
      formRef.current?.reset()
      formRef.current?.querySelector('[data-autofocus]')?.focus({ preventScroll: true })
    }
    // Runs for each new result, not when the sheet or flags change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const onSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    startTransition(() => run(data))
  }

  return (
    <PendingContext.Provider value={pending}>
      <form ref={formRef} onSubmit={onSubmit} className={className} {...rest}>
        {children}
        {state?.error && (
          <p role="alert" className="basis-full text-foot text-late sm:col-span-2">
            {state.error}
          </p>
        )}
        {state?.ok && success && (
          <p role="status" className="sr-only">
            {success}
          </p>
        )}
      </form>
      <ActionErrorAlert state={state} title={errorTitle} />
    </PendingContext.Provider>
  )
}

export function Submit({ className, children, ...rest }) {
  const pending = useContext(PendingContext)
  return (
    <button type="submit" disabled={pending} className={className} {...rest}>
      {children}
    </button>
  )
}

/**
 * A submit button that asks first. For anything that deletes or can't be taken back.
 * A destructive choice is asked in an action sheet on phones, as iPhone does, with
 * Cancel bold. Anything else gets an alert with the action bold. `dismiss` renames
 * Cancel where that would be ambiguous, such as when the action is itself a cancel.
 */
export function ConfirmSubmit({ title, message, confirm = 'Delete', dismiss = 'Cancel', destructive = true, className, children, ...rest }) {
  const pending = useContext(PendingContext)
  const [asking, setAsking] = useState(false)
  const buttonRef = useRef(null)

  return (
    <>
      <button
        ref={buttonRef}
        type="submit"
        disabled={pending}
        className={className}
        onClick={(e) => {
          e.preventDefault()
          setAsking(true)
        }}
        {...rest}
      >
        {children}
      </button>
      {asking && (
        <Alert
          title={title}
          message={message}
          sheet={destructive}
          onClose={() => setAsking(false)}
          actions={[
            { label: dismiss, bold: destructive },
            {
              label: confirm,
              destructive,
              bold: !destructive,
              onPress: () => buttonRef.current?.form?.requestSubmit(buttonRef.current),
            },
          ]}
        />
      )}
    </>
  )
}

/** A select that submits its form as soon as it changes. */
export function AutoSubmitSelect({ options, className, ...rest }) {
  const pending = useContext(PendingContext)
  return (
    <select disabled={pending} className={className} onChange={(e) => e.target.form.requestSubmit()} {...rest}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

/**
 * A tick that changes the moment it is tapped, before the server has answered,
 * and undoes itself with the reason if the server refuses. It is never disabled,
 * so a mistaken tap can be reversed straight away.
 */
export function CheckButton({ action, id, done, label, blockedBy, square = false }) {
  const [state, run] = useActionState(action, null)
  const [shown, setShown] = useOptimistic(Boolean(done))
  useEffect(() => {
    if (state?.ok) announceSaved()
  }, [state])
  const wouldBeRefused = !shown && Boolean(blockedBy)

  const onSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    startTransition(() => {
      if (!wouldBeRefused) setShown(!shown)
      run(data)
    })
    // Android only; iPhones do not allow it. Finishing something is worth a tap back.
    if (!shown && !wouldBeRefused) navigator.vibrate?.(10)
  }

  return (
    <form onSubmit={onSubmit} className="contents">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={shown ? `Reopen ${label}` : `Mark ${label} done`}
        title={wouldBeRefused ? `Waiting on ${blockedBy}` : undefined}
        className="press relative z-10 -m-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
      >
        <span className={`tick ${wouldBeRefused ? 'opacity-40' : ''}`} data-done={shown} data-square={square}>
          <Check size={square ? 12 : 14} strokeWidth={3.25} aria-hidden="true" />
        </span>
      </button>
      <ActionErrorAlert state={state} title="Can’t Finish Yet" />
    </form>
  )
}
