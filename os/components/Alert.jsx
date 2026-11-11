'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'motion/react'
import { lockPageScroll } from '@/lib/scroll-lock'

const DESKTOP = '(min-width: 768px)'

// An alert settles down from slightly too big and leaves by fading in place. An
// action sheet rises from the bottom and drops back. Neither bounces: nothing was
// thrown.
const POP = { type: 'spring', visualDuration: 0.3, bounce: 0 }
const RISE = { type: 'spring', visualDuration: 0.35, bounce: 0 }
const DROP = { type: 'spring', visualDuration: 0.25, bounce: 0 }
const FADE = { duration: 0.15, ease: 'easeOut' }
// How long leaving takes. A timer rather than waiting on the animation, so an alert
// can never be left blocking the page if an animation is skipped.
const LEAVE_MS = { alert: 170, sheet: 280 }

/**
 * An iPhone-style alert, for a decision or a problem that needs reading.
 *
 * `actions` holds one or two buttons: { label, onPress, bold, destructive }. The first
 * is always the safe one. It takes focus, so a stray Enter can't delete anything, and
 * Escape or Android's back gesture presses it.
 *
 * With `sheet`, a phone shows an action sheet instead, as iPhone does to confirm a
 * delete: the choice slides up from the bottom with Cancel set apart beneath it, and
 * tapping outside cancels. A centred alert ignores taps outside, because it needs an
 * answer. Desktop always gets the alert.
 */
export function Alert({ title, message, actions, onClose, sheet = false }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const messageId = useId()
  const reduced = useReducedMotion()
  // Only ever rendered in the browser, after a tap or a reply from the server.
  const [asSheet] = useState(() => sheet && !window.matchMedia(DESKTOP).matches)
  const [leaving, setLeaving] = useState(false)
  const [safe, ...others] = actions

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
    dialog.querySelector('[data-safe]')?.focus()
    return lockPageScroll()
  }, [])

  useEffect(() => {
    if (!leaving) return undefined
    const timer = setTimeout(
      () => {
        dialogRef.current?.close() // hands focus back to whatever opened it
        onClose()
      },
      asSheet && !reduced ? LEAVE_MS.sheet : LEAVE_MS.alert
    )
    return () => clearTimeout(timer)
    // Runs once, when a button is pressed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving])

  const press = (action) => {
    if (leaving) return
    setLeaving(true)
    action.onPress?.()
  }

  const button = (action, className) => (
    <button
      key={action.label}
      type="button"
      data-safe={action === safe ? '' : undefined}
      onClick={() => press(action)}
      className={`min-w-0 break-words focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      {action.label}
    </button>
  )

  const hiddenAlert = reduced ? { opacity: 0 } : { opacity: 0, scale: 1.12 }
  const hiddenSheet = reduced ? { opacity: 0 } : { y: '120%' }

  return createPortal(
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={message ? messageId : undefined}
      // React passes these up through the tree, not the page, so without stopping
      // them an alert opened from inside a sheet would close the sheet as well.
      onCancel={(e) => {
        e.preventDefault()
        e.stopPropagation()
        press(safe)
      }}
      onClose={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-clip bg-transparent p-0 backdrop:bg-transparent"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={FADE}
        onClick={asSheet ? () => press(safe) : undefined}
      />

      {asSheet ? (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <motion.div
            className="pointer-events-auto w-full max-w-[28rem] space-y-2"
            initial={hiddenSheet}
            animate={leaving ? hiddenSheet : { opacity: 1, y: 0 }}
            transition={reduced ? FADE : leaving ? DROP : RISE}
          >
            <div className="alert-glass overflow-hidden rounded-[0.875rem] text-center">
              <div className="px-4 py-3.5">
                <h2 id={titleId} className="break-words text-foot font-semibold text-muted">
                  {title}
                </h2>
                {message && (
                  <p id={messageId} className="mt-0.5 whitespace-pre-line break-words text-foot text-muted">
                    {message}
                  </p>
                )}
              </div>
              {others.map((action) =>
                button(
                  action,
                  `row-press block min-h-14 w-full border-t border-line px-4 py-3 text-action ${action.destructive ? 'text-late' : 'text-accent'}`
                )
              )}
            </div>
            {button(safe, 'block min-h-14 w-full rounded-[0.875rem] bg-raised px-4 py-3 text-action font-semibold text-accent transition-colors active:bg-fill')}
          </motion.div>
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
          <motion.div
            className="alert-glass pointer-events-auto flex max-h-full w-[16.875rem] max-w-full flex-col overflow-hidden rounded-[0.875rem] text-center shadow-[0_16px_48px_rgba(0,0,0,0.24)]"
            initial={hiddenAlert}
            animate={leaving ? { opacity: 0 } : { opacity: 1, scale: 1 }}
            transition={leaving || reduced ? FADE : POP}
          >
            <div className="min-h-0 overflow-y-auto px-4 pb-[1.125rem] pt-[1.1875rem]">
              <h2 id={titleId} className="break-words text-headline text-ink">
                {title}
              </h2>
              {message && (
                <p id={messageId} className="mt-1 whitespace-pre-line break-words text-foot text-ink">
                  {message}
                </p>
              )}
            </div>
            <div className={`grid shrink-0 divide-x divide-line border-t border-line ${actions.length > 1 ? 'grid-cols-2' : ''}`}>
              {actions.map((action) =>
                button(
                  action,
                  `row-press min-h-11 px-2 py-2.5 text-headline ${action.bold ? '' : 'font-normal'} ${action.destructive ? 'text-late' : 'text-accent'}`
                )
              )}
            </div>
          </motion.div>
        </div>
      )}
    </dialog>,
    document.body
  )
}

/** One problem, one OK. */
export function ProblemAlert({ title, message, onClose }) {
  return <Alert title={title} message={message} actions={[{ label: 'OK', bold: true }]} onClose={onClose} />
}

/** Shows the `error` an action returned as an alert, once for each time it comes back. */
export function ActionErrorAlert({ state, title }) {
  const [dismissed, setDismissed] = useState(null)
  if (!state?.error || state === dismissed) return null
  return <ProblemAlert title={title} message={state.error} onClose={() => setDismissed(state)} />
}
