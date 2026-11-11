'use client'

import { useState } from 'react'
import { ActionForm, ConfirmSubmit, Submit } from '@/components/forms'
import { BUTTON_DANGER, BUTTON_PRIMARY, Field, Input, Select, Switch } from '@/components/ui'
import { createGoal, removeGoal, updateGoal } from '@/lib/actions/goals'
import { GOAL_PERIODS, PERIOD } from '@/lib/goals.mjs'

const UNITS = ['calls', 'meetings', 'leads', 'clients', 'posts', 'videos', 'hours', '₹']

function OwnerSelect({ users, defaultValue }) {
  return (
    <Field label="For">
      <Select name="owner_id" defaultValue={defaultValue} options={[...users.map((u) => ({ value: u.id, label: u.name })), { value: 'both', label: 'Both' }]} />
    </Field>
  )
}

function TargetFields({ goal }) {
  return (
    <>
      <Field label="Target" hint="Leave empty for a goal that is simply done or not.">
        <Input name="target" inputMode="decimal" autoComplete="off" placeholder="20" defaultValue={goal?.target ?? ''} />
      </Field>
      <Field label="Counted in">
        <Input name="unit" list="goal-units" autoComplete="off" placeholder="calls" defaultValue={goal?.unit ?? ''} />
        <datalist id="goal-units">
          {UNITS.map((u) => (
            <option key={u} value={u} />
          ))}
        </datalist>
      </Field>
    </>
  )
}

/** Adds a goal to the period being looked at. Goes in a sheet. */
export function GoalForm({ users, meId, period, on }) {
  const [chosen, setChosen] = useState(period)
  return (
    <ActionForm action={createGoal} reset success="Goal added" className="grid grid-cols-2 gap-3 px-4 pb-4 pt-1">
      <input type="hidden" name="on" value={on} />
      <div className="col-span-2">
        <Input name="title" required aria-label="Goal" placeholder="Make 20 cold calls" autoComplete="off" data-autofocus />
      </div>
      <OwnerSelect users={users} defaultValue={meId} />
      <Field label="Goal for a">
        <Select
          name="period"
          value={chosen}
          onChange={(e) => setChosen(e.target.value)}
          options={GOAL_PERIODS.map((p) => ({ value: p.value, label: p.noun[0].toUpperCase() + p.noun.slice(1) }))}
        />
      </Field>
      <TargetFields />
      <div className="col-span-2">
        <Switch name="repeats" label={`Repeat every ${PERIOD[chosen].noun}`} hint={`Starts afresh each ${PERIOD[chosen].noun}. Earlier results are kept.`} />
      </div>
      <div className="col-span-2">
        <Submit className={`${BUTTON_PRIMARY} w-full`}>Add goal</Submit>
      </div>
    </ActionForm>
  )
}

/** Edits a goal, and types in progress for targets too big to tap up. Goes in a sheet. */
export function GoalEditForm({ goal, users, start, periodPhrase }) {
  const stops = goal.repeats && start > goal.starts_on
  return (
    <div className="px-4 pb-4 pt-1">
      <ActionForm action={updateGoal} closeOnSuccess success="Saved" className="grid grid-cols-2 gap-3">
        <input type="hidden" name="id" value={goal.id} />
        <input type="hidden" name="period_start" value={start} />
        <div className="col-span-2">
          <Field label="Goal">
            <Input name="title" required autoComplete="off" defaultValue={goal.title} />
          </Field>
        </div>
        <div className="col-span-2">
          <OwnerSelect users={users} defaultValue={goal.for_both ? 'both' : (goal.owner_id ?? '')} />
        </div>
        <TargetFields goal={goal} />
        {goal.target && (
          <div className="col-span-2">
            <Field label={`Progress, ${periodPhrase}`}>
              <Input name="value" inputMode="decimal" autoComplete="off" defaultValue={goal.value} />
            </Field>
          </div>
        )}
        <div className="col-span-2">
          <Submit className={`${BUTTON_PRIMARY} w-full`}>Save</Submit>
        </div>
      </ActionForm>

      <ActionForm action={removeGoal} closeOnSuccess errorTitle="Couldn’t Remove" className="mt-3">
        <input type="hidden" name="id" value={goal.id} />
        <input type="hidden" name="period_start" value={start} />
        <ConfirmSubmit
          title={stops ? 'Stop This Goal?' : 'Delete Goal?'}
          message={stops ? `It won’t come back from ${periodPhrase} on. Earlier results are kept.` : `“${goal.title}” and its progress will be deleted.`}
          confirm={stops ? 'Stop Goal' : 'Delete'}
          className={`${BUTTON_DANGER} w-full`}
        >
          {stops ? 'Stop repeating' : 'Delete goal'}
        </ConfirmSubmit>
      </ActionForm>
    </div>
  )
}
