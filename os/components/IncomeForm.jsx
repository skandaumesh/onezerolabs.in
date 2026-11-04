import { ActionForm, ConfirmSubmit, Submit } from '@/components/forms'
import { BUTTON_DANGER, BUTTON_PRIMARY, Field, Input, Select } from '@/components/ui'
import { createIncome, deleteIncome, updateIncome } from '@/lib/actions/revenue'
import { INCOME_KINDS } from '@/lib/constants.mjs'

/** Used in a sheet, to add and to edit. Adding stays open for the next entry; editing closes on save. */
export function IncomeForm({ item, companies }) {
  const i = item || {}
  return (
    <>
      <ActionForm
        action={item ? updateIncome : createIncome}
        reset={!item}
        closeOnSuccess={Boolean(item)}
        success={item ? 'Saved' : 'Added'}
        className="grid grid-cols-2 gap-3 px-4 pb-4 pt-1"
      >
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="col-span-2">
          <Field label="Client">
            <Select
              name="company_id"
              required
              blank="Choose a client"
              defaultValue={i.company_id ?? ''}
              options={companies.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Type">
            <Select name="kind" defaultValue={i.kind ?? 'project'} options={INCOME_KINDS} />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="What it is for">
            <Input name="description" required defaultValue={i.description ?? ''} placeholder="Website" autoComplete="off" />
          </Field>
        </div>
        <Field label="Amount (₹)">
          <Input name="amount" required inputMode="decimal" defaultValue={i.amount ?? ''} autoComplete="off" />
        </Field>
        <Field label="Received so far (₹)" hint="Blank if not recorded.">
          <Input name="received" inputMode="decimal" defaultValue={i.received ?? ''} autoComplete="off" />
        </Field>
        <div className="col-span-2">
          <Submit className={`${BUTTON_PRIMARY} w-full`}>{item ? 'Save changes' : 'Add income'}</Submit>
        </div>
      </ActionForm>

      {item && (
        <ActionForm action={deleteIncome} closeOnSuccess errorTitle="Couldn’t Delete" className="px-4 pb-4">
          <input type="hidden" name="id" value={item.id} />
          <ConfirmSubmit title="Delete Income?" message={`This entry from ${item.company_name} will be removed. This can’t be undone.`} className={`${BUTTON_DANGER} w-full`}>
            Delete
          </ConfirmSubmit>
        </ActionForm>
      )}
    </>
  )
}
