'use client'

import { useState } from 'react'
import { ActionForm, ConfirmSubmit } from '@/components/forms'
import { BUTTON_PRIMARY, Field, Input, Select, Switch } from '@/components/ui'
import { addEarning } from '@/lib/actions/bank'
import { keepOf, PAY_WITHIN_DAYS, SHARE_PERCENT, shareOf } from '@/lib/bank.mjs'
import { formatINR, parseAmount } from '@/lib/money.mjs'

/** Adds what a partner earned, showing the company's 25% as it is typed. Goes in a sheet. */
export function EarningForm({ users, meId, companies, today }) {
  const [typed, setTyped] = useState('')
  const amount = parseAmount(typed)

  return (
    <ActionForm
      action={addEarning}
      reset
      success="Earning added"
      onReset={() => setTyped('')}
      className="grid grid-cols-2 gap-3 px-4 pb-4 pt-1"
    >
      <div className="col-span-2">
        <Field label="Who earned it">
          <Select name="user_id" defaultValue={meId} options={users.map((u) => ({ value: u.id, label: u.name }))} />
        </Field>
      </div>
      <Field label="Amount earned (₹)" hint="Leave out any GST.">
        <Input name="amount" required inputMode="decimal" autoComplete="off" placeholder="10000" onChange={(e) => setTyped(e.target.value)} data-autofocus />
      </Field>
      <Field label="Received on">
        <Input type="date" name="received_on" required defaultValue={today} max={today} />
      </Field>

      <div role="status" aria-live="polite" className="col-span-2 rounded-xl bg-good-soft px-3.5 py-3">
        {amount ? (
          <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <span className="text-sub font-semibold text-good">
              {SHARE_PERCENT}% to the company: {formatINR(shareOf(amount))}
            </span>
            <span className="text-foot text-ink2">Keeps {formatINR(keepOf(amount))}</span>
          </span>
        ) : (
          <span className="text-foot text-ink2">{SHARE_PERCENT}% of what you enter goes to the company bank.</span>
        )}
      </div>

      <div className="col-span-2">
        <Field label="Client">
          <Select name="company_id" blank="None" options={companies.map((c) => ({ value: c.id, label: c.name }))} />
        </Field>
      </div>
      <div className="col-span-2">
        <Field label="What it was for">
          <Input name="note" autoComplete="off" placeholder="Website, monthly maintenance, reels" />
        </Field>
      </div>
      <div className="col-span-2">
        <Switch
          name="paid"
          defaultChecked
          label="25% paid into the company bank"
          hint={`Turn off if it is still to be paid in. It is due within ${PAY_WITHIN_DAYS} days.`}
        />
      </div>
      <div className="col-span-2">
        <ConfirmSubmit
          destructive={false}
          confirm="Add"
          title={(data) => {
            const who = users.find((u) => u.id === data.get('user_id'))?.name ?? 'This'
            return `Add ${who}’s ${formatINR(parseAmount(data.get('amount')) ?? 0)}?`
          }}
          message={(data) => {
            const earned = parseAmount(data.get('amount')) ?? 0
            const paid = data.get('paid') === 'on'
            return `${SHARE_PERCENT}%, ${formatINR(shareOf(earned))}, goes to the company bank${paid ? ' now' : `, to be paid in within ${PAY_WITHIN_DAYS} days`}. ${formatINR(keepOf(earned))} is kept.`
          }}
          className={`${BUTTON_PRIMARY} w-full`}
        >
          Add earning
        </ConfirmSubmit>
      </div>
    </ActionForm>
  )
}
