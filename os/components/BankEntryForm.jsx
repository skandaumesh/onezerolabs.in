'use client'

import { ActionForm, ConfirmSubmit } from '@/components/forms'
import { BUTTON_PRIMARY, Field, Input, Select, Switch } from '@/components/ui'
import { addBankEntry } from '@/lib/actions/bank'
import { SPEND_CATEGORIES, SPEND_LABEL, whoseOptions } from '@/lib/bank.mjs'
import { formatDay } from '@/lib/dates.mjs'
import { formatINR, parseAmount } from '@/lib/money.mjs'

/**
 * Money into or out of the company bank, other than the partners' shares. Asks
 * whose money it is, and asks once more, with the amount, before saving.
 * Goes in a sheet.
 */
export function BankEntryForm({ direction, today, users }) {
  const out = direction === 'out'
  const options = whoseOptions(users)

  const question = (data) => {
    const amount = formatINR(parseAmount(data.get('amount')) ?? 0)
    return out ? `Take ${amount} Out of the Bank?` : `Add ${amount} to the Bank?`
  }
  const details = (data) => {
    const whose = options.find((o) => o.value === data.get('whose'))?.label
    const what = data.get('description')
    const category = out ? ` (${SPEND_LABEL[data.get('category')]})` : ''
    const when = data.get('entry_date') ? `, on ${formatDay(data.get('entry_date'), today)}` : ''
    return `${whose}: ${what}${category}${when}.${out ? ' Both of you agreed to it.' : ''}`
  }

  return (
    <ActionForm
      action={addBankEntry}
      reset
      closeOnSuccess
      success={out ? 'Spending added' : 'Money in added'}
      className="grid grid-cols-2 gap-3 px-4 pb-4 pt-1"
    >
      <input type="hidden" name="direction" value={direction} />
      <Field label="Amount (₹)">
        <Input name="amount" required inputMode="decimal" autoComplete="off" placeholder={out ? '1200' : '5000'} data-autofocus />
      </Field>
      <Field label="Date">
        <Input type="date" name="entry_date" required defaultValue={today} />
      </Field>
      <div className="col-span-2">
        <Field label="Whose money">
          <Select name="whose" required blank="Choose…" defaultValue="" options={options} />
        </Field>
      </div>
      <div className="col-span-2">
        <Field label={out ? 'What it was spent on' : 'Where it came from'}>
          <Input name="description" required autoComplete="off" placeholder={out ? 'Domain renewal, Canva, camera' : 'Opening balance, client paid the company'} />
        </Field>
      </div>
      {out && (
        <>
          <div className="col-span-2">
            <Field label="Category">
              <Select name="category" defaultValue="tools" options={SPEND_CATEGORIES} />
            </Field>
          </div>
          <div className="col-span-2">
            <Switch name="agreed" required label="Both of us agreed to this payment" hint="The partners agreement needs both of you to agree to every payment from the company bank." />
          </div>
        </>
      )}
      <div className="col-span-2">
        <ConfirmSubmit destructive={false} confirm={out ? 'Take Out' : 'Add'} title={question} message={details} className={`${BUTTON_PRIMARY} w-full`}>
          {out ? 'Add spending' : 'Add money in'}
        </ConfirmSubmit>
      </div>
    </ActionForm>
  )
}
