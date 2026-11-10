import { ActionForm, Submit } from '@/components/forms'
import { BUTTON_PRIMARY, Field, Input, Select, Switch } from '@/components/ui'
import { addBankEntry } from '@/lib/actions/bank'
import { SPEND_CATEGORIES } from '@/lib/bank.mjs'

/** Money into or out of the company bank, other than the partners' shares. Goes in a sheet. */
export function BankEntryForm({ direction, today }) {
  const out = direction === 'out'
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
        <Submit className={`${BUTTON_PRIMARY} w-full`}>{out ? 'Add spending' : 'Add money in'}</Submit>
      </div>
    </ActionForm>
  )
}
