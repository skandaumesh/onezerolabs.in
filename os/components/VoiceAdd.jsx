'use client'

import { startTransition, useActionState, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Check, Mic, MicOff, Square } from 'lucide-react'
import { ProblemAlert } from '@/components/Alert'
import { showBanner } from '@/components/Banner'
import { SheetButton, useSheet } from '@/components/Sheet'
import { Badge, BUTTON_PRIMARY, BUTTON_SECONDARY, CONTROL } from '@/components/ui'
import { quickAddTask, undoQuickTask } from '@/lib/actions/tasks'
import { RECURRENCES } from '@/lib/constants.mjs'
import { minutesIST, todayIST } from '@/lib/dates.mjs'
import { parseTask, whenText } from '@/lib/parse-task.mjs'
import { announceSaved } from '@/components/AppBridge'

const REPEATS = Object.fromEntries(RECURRENCES.map((r) => [r.value, r.label]))
const EXAMPLE = '“I have meeting today at 7”'
const TRY_AGAIN = { title: 'That Didn’t Work', message: 'Try again, or type instead.' }
const BLOCKED = { title: 'Microphone Blocked', message: 'Allow the microphone in your browser settings, or type instead.' }
const PROBLEMS = {
  'not-allowed': BLOCKED,
  'service-not-allowed': BLOCKED,
  'audio-capture': { title: 'No Microphone Found', message: 'You can type instead.' },
  network: { title: 'No Connection', message: 'Voice needs the internet. You can type instead.' },
}

const recogniserClass = () =>
  (typeof window !== 'undefined' && window.isSecureContext && (window.SpeechRecognition || window.webkitSpeechRecognition)) || null

/** What the sentence was understood as, updating as it is spoken or typed. */
function Preview({ said, users, meId }) {
  const task = useMemo(
    () => (said.trim() ? parseTask(said, { today: todayIST(), minutesNow: minutesIST(), users, meId }) : null),
    [said, users, meId]
  )
  if (!task?.title) return null
  const when = whenText(task.dueDate, task.dueTime, todayIST())
  return (
    <div aria-label="Understood as" className="flex flex-wrap items-center gap-1.5">
      <span className="min-w-0 break-words text-sub font-semibold text-ink">{task.title}</span>
      {when && <Badge tone="soon">{when}</Badge>}
      {task.forBoth ? <Badge>For both</Badge> : task.assigneeId !== meId && task.assigneeName && <Badge>For {task.assigneeName}</Badge>}
      {task.priority === 'critical' && <Badge tone="late">Critical</Badge>}
      {task.priority === 'high' && <Badge tone="soon">High</Badge>}
      {task.priority === 'low' && <Badge>Low</Badge>}
      {task.recurrence !== 'none' && <Badge>{REPEATS[task.recurrence]}</Badge>}
    </div>
  )
}

function Capture({ users, meId }) {
  const sheet = useSheet()
  const [Recogniser] = useState(recogniserClass)
  const [said, setSaid] = useState('')
  const [listening, setListening] = useState(false)
  const [notice, setNotice] = useState(null)
  const [problem, setProblem] = useState(null)
  const [saved, setSaved] = useState(null)
  const recognition = useRef(null)
  const finalText = useRef('')

  const [result, runSave, saving] = useActionState(quickAddTask, null)
  const [undone, runUndo, undoing] = useActionState(undoQuickTask, null)

  const save = (value) => {
    const data = new FormData()
    data.set('said', value)
    startTransition(() => runSave(data))
  }

  useEffect(() => {
    if (!result) return
    if (result.ok) {
      announceSaved()
      setSaved(result)
      setSaid('')
      setNotice(null)
      navigator.vibrate?.(10)
    } else {
      setProblem({ title: 'Didn’t Catch That', message: result.error })
    }
  }, [result])

  useEffect(() => {
    if (undone?.ok) {
      setSaved(null)
      showBanner('Removed')
    }
  }, [undone])

  const stop = () => recognition.current?.stop()

  /** Turns the mic off and forgets the session, so nothing it does later counts. */
  const cancel = () => {
    const r = recognition.current
    recognition.current = null
    r?.abort()
    setListening(false)
  }

  const listen = () => {
    if (!Recogniser) return
    cancel()
    setNotice(null)
    setSaved(null)
    setSaid('')
    finalText.current = ''

    const r = new Recogniser()
    r.lang = 'en-IN'
    r.interimResults = true
    r.continuous = false
    r.maxAlternatives = 1
    // An old session can still report in after a new one starts. Only the current one counts.
    const current = () => recognition.current === r
    r.onstart = () => {
      if (current()) setListening(true)
    }
    r.onresult = (event) => {
      if (!current()) return
      const transcript = Array.from(event.results, (item) => item[0].transcript).join(' ').trim()
      setSaid(transcript)
      if (event.results[event.results.length - 1].isFinal) finalText.current = transcript
    }
    r.onerror = (event) => {
      if (!current() || event.error === 'aborted') return
      // Silence is not a problem worth stopping for: it only needs another go.
      if (event.error === 'no-speech') setNotice('I didn’t hear anything. Tap the mic and try again.')
      else setProblem(PROBLEMS[event.error] ?? TRY_AGAIN)
    }
    // Saves straight away, because the point is not having to touch anything. Undo is
    // right there if it misheard.
    r.onend = () => {
      if (!current()) return
      recognition.current = null
      setListening(false)
      if (finalText.current) save(finalText.current)
    }
    recognition.current = r
    try {
      r.start()
    } catch {
      recognition.current = null
      setProblem(TRY_AGAIN)
    }
  }

  // Opening the sheet starts listening, so one tap on the mic is all it takes. The
  // short wait means a mount React immediately repeats in development only starts once.
  useEffect(() => {
    const timer = setTimeout(listen, 120)
    return () => {
      clearTimeout(timer)
      const r = recognition.current
      recognition.current = null
      r?.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    if (said.trim() && !saving) save(said)
  }

  return (
    <div className="space-y-4 px-4 pb-4 pt-1">
      {Recogniser && (
        <div className="flex flex-col items-center gap-2 pt-1 text-center">
          <button
            type="button"
            onClick={listening ? stop : listen}
            aria-label={listening ? 'Stop listening' : 'Start listening'}
            aria-pressed={listening}
            className={`press flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full ${
              listening ? 'mic-listening bg-late text-canvas' : 'bg-accent-fill text-white'
            }`}
          >
            {listening ? <Square size={22} fill="currentColor" aria-hidden="true" /> : <Mic size={30} aria-hidden="true" />}
          </button>
          <p role="status" className="text-sub text-muted">
            {saving ? 'Saving…' : listening ? `Listening. Try ${EXAMPLE}` : saved ? 'Tap to add another' : 'Tap the mic and speak'}
          </p>
        </div>
      )}

      {!Recogniser && (
        <p className="flex items-start gap-2 text-foot text-muted">
          <MicOff size={15} className="mt-px shrink-0" aria-hidden="true" />
          Voice isn’t available {window.isSecureContext ? 'in this browser' : 'on this connection'}. Type it the same way, like {EXAMPLE}.
        </p>
      )}

      {saved && (
        <div role="status" className="rounded-2xl bg-good-soft p-3">
          <div className="flex items-start gap-2 text-sub font-medium text-good">
            <Check size={17} strokeWidth={2.5} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 break-words">
              Saved: {saved.summary}
              {saved.assigneeName ? `, for ${saved.assigneeName}` : ''}
            </span>
          </div>
          <div className="mt-1 flex gap-2 pl-4">
            <button
              type="button"
              disabled={undoing}
              onClick={() => {
                const data = new FormData()
                data.set('id', saved.id)
                startTransition(() => runUndo(data))
              }}
              className="press inline-flex min-h-11 items-center px-2 text-sub font-semibold text-ink underline underline-offset-2 md:min-h-9"
            >
              Undo
            </button>
            <Link
              href={`/tasks/${saved.id}`}
              onClick={() => sheet?.close()}
              className="press inline-flex min-h-11 items-center px-2 text-sub font-semibold text-ink underline underline-offset-2 md:min-h-9"
            >
              Open
            </Link>
          </div>
        </div>
      )}

      {notice && !saved && (
        <p role="alert" className="text-center text-foot text-late">
          {notice}
        </p>
      )}
      <p role="status" className="sr-only">
        {undone?.ok && !saved ? 'Removed' : ''}
      </p>
      {problem && <ProblemAlert {...problem} onClose={() => setProblem(null)} />}

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          name="said"
          value={said}
          onChange={(e) => setSaid(e.target.value)}
          onFocus={() => {
            if (recognition.current) cancel() // choosing to type turns the mic off
          }}
          aria-label="What needs doing"
          placeholder={Recogniser ? 'Or type it here' : 'Meeting today at 7'}
          autoComplete="off"
          data-autofocus={Recogniser ? undefined : true}
          className={CONTROL}
        />
        <Preview said={said} users={users} meId={meId} />
        {!listening && (
          <button type="submit" disabled={!said.trim() || saving} className={`${said.trim() ? BUTTON_PRIMARY : BUTTON_SECONDARY} w-full`}>
            Add task
          </button>
        )}
      </form>
    </div>
  )
}

/** The mic button on every screen. One tap, say it, and it is saved. */
export function VoiceAdd({ users, meId }) {
  return (
    <SheetButton
      title="Add a task"
      aria-label="Add a task by voice"
      className="press fixed bottom-[calc(max(0.625rem,env(safe-area-inset-bottom))+4.875rem)] right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-accent-fill text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)] md:bottom-6 md:right-6"
      label={<Mic size={24} aria-hidden="true" />}
    >
      <Capture users={users} meId={meId} />
    </SheetButton>
  )
}
