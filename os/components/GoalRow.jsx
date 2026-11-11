'use client'

import { startTransition, useActionState, useOptimistic } from 'react'
import { Check, Minus, Plus, Repeat } from 'lucide-react'
import { ActionErrorAlert } from '@/components/Alert'
import { GoalEditForm } from '@/components/GoalForm'
import { SheetButton } from '@/components/Sheet'
import { Badge } from '@/components/ui'
import { stepGoal } from '@/lib/actions/goals'
import { countsByTaps, goalState, PERIOD, progressText } from '@/lib/goals.mjs'

const STEP_BUTTON =
  'press flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-fill text-ink hover:bg-fill-hover disabled:opacity-40'

/** A ring that fills as the goal gets closer, with a tick once it is reached. */
function Ring({ percent, done }) {
  const r = 9
  const length = 2 * Math.PI * r
  return (
    <span className="relative flex h-6 w-6 shrink-0 items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="absolute inset-0 -rotate-90">
        <circle cx="12" cy="12" r={r} fill="none" strokeWidth="2.5" className="stroke-fill" />
        <circle
          cx="12"
          cy="12"
          r={r}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length * (1 - percent / 100)}
          className={`transition-[stroke-dashoffset] duration-300 ${done ? 'stroke-good' : 'stroke-accent'}`}
        />
      </svg>
      {done && <Check size={12} strokeWidth={3.25} className="text-good" />}
    </span>
  )
}

/**
 * One goal in one period. A tap changes it on screen at once and the server
 * catches up; if the server refuses, it goes back and says why.
 */
export function GoalRow({ goal, period, start, users, periodPhrase }) {
  const [state, run] = useActionState(stepGoal, null)
  const [shown, change] = useOptimistic({ value: goal.value, done: goal.done }, (current, step) =>
    step === 'toggle' ? { ...current, done: !current.done } : { ...current, value: Math.max(0, current.value + (step === 'down' ? -1 : 1)) }
  )
  const { done, percent } = goalState({ target: goal.target, ...shown })
  const taps = countsByTaps(goal.target)

  const send = (step) => {
    const data = new FormData()
    data.set('id', goal.id)
    data.set('period', period)
    data.set('period_start', start)
    data.set('step', step)
    startTransition(() => {
      change(step)
      run(data)
    })
    if (step !== 'down' && !done) navigator.vibrate?.(10)
  }

  return (
    <li className="flex items-center gap-3 py-3 pl-4 pr-3">
      {goal.target ? (
        <span className="flex h-11 w-6 shrink-0 items-center">
          <Ring percent={percent} done={done} />
        </span>
      ) : (
        <button
          type="button"
          onClick={() => send('toggle')}
          aria-label={done ? `Mark ${goal.title} not done` : `Mark ${goal.title} done`}
          className="press relative -m-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        >
          <span className="tick" data-done={done}>
            <Check size={14} strokeWidth={3.25} aria-hidden="true" />
          </span>
        </button>
      )}

      <div className="min-w-0 flex-1">
        <SheetButton
          title="Goal"
          className="press block w-full text-left"
          label={
            <>
              <span className={`block break-words text-body md:text-sub ${done ? 'text-muted line-through' : 'text-ink'}`}>{goal.title}</span>
              <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-foot text-muted">
                {goal.target && <span className={done ? 'font-medium text-good' : 'tabular-nums'}>{progressText({ ...goal, ...shown })}</span>}
                {goal.repeats && (
                  <span className="inline-flex items-center gap-1">
                    <Repeat size={13} aria-hidden="true" />
                    Every {PERIOD[period].noun}
                  </span>
                )}
                {done && !goal.target && <Badge tone="good">Done</Badge>}
              </span>
            </>
          }
        >
          <GoalEditForm goal={{ ...goal, ...shown }} users={users} start={start} periodPhrase={periodPhrase} />
        </SheetButton>
      </div>

      {taps && (
        <span className="flex shrink-0 items-center gap-1.5">
          <button type="button" onClick={() => send('down')} disabled={shown.value <= 0} aria-label={`One less for ${goal.title}`} className={STEP_BUTTON}>
            <Minus size={18} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => send('up')} aria-label={`One more for ${goal.title}`} className={STEP_BUTTON}>
            <Plus size={18} aria-hidden="true" />
          </button>
        </span>
      )}
      <ActionErrorAlert state={state} title="Couldn’t Update" />
    </li>
  )
}
