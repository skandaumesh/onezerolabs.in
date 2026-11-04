import Link from 'next/link'
import { ActionForm, Submit } from '@/components/forms'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, Input, Select, Textarea } from '@/components/ui'
import { SOURCES, STAGES } from '@/lib/constants.mjs'

/** Used to add and to edit. New records also capture the first contact. */
export function CompanyForm({ action, company, users, cancelHref, defaultStage = 'new', today }) {
  const c = company || {}
  return (
    <ActionForm action={action} className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:p-5">
      {company && <input type="hidden" name="id" value={company.id} />}

      <Field label="Company name" wide>
        <Input name="name" required defaultValue={c.name ?? ''} autoComplete="off" />
      </Field>
      <Field label="Stage">
        <Select name="stage" defaultValue={c.stage ?? defaultStage} options={STAGES} />
      </Field>
      <Field label="Next follow-up" hint="Required until the lead is won or lost.">
        <Input type="date" name="next_follow_up" min={company ? undefined : today} defaultValue={c.next_follow_up ?? ''} />
      </Field>
      <Field label="Owner">
        <Select
          name="owner_id"
          blank="No owner"
          defaultValue={c.owner_id ?? ''}
          options={users.map((u) => ({ value: u.id, label: u.name }))}
        />
      </Field>
      <Field label="How they found us">
        <Select name="source" blank="Not recorded" defaultValue={c.source ?? ''} options={SOURCES} />
      </Field>
      <Field label="Sector">
        <Input name="sector" defaultValue={c.sector ?? ''} />
      </Field>
      <Field label="Website">
        <Input name="website" inputMode="url" autoCapitalize="none" defaultValue={c.website ?? ''} placeholder="example.com" />
      </Field>
      <Field label="Address" wide>
        <Input name="address" defaultValue={c.address ?? ''} />
      </Field>
      <Field label="Services purchased or discussed" wide>
        <Textarea name="services" rows={2} defaultValue={c.services ?? ''} />
      </Field>

      {company ? (
        <Field label="Reason lost" hint="Only needed if the stage is Lost." wide>
          <Input name="lost_reason" defaultValue={c.lost_reason ?? ''} />
        </Field>
      ) : (
        <>
          <Field label="Contact name">
            <Input name="contact_name" autoComplete="off" />
          </Field>
          <Field label="Contact role">
            <Input name="contact_role" autoComplete="off" />
          </Field>
          <Field label="Contact email">
            <Input type="email" name="contact_email" autoComplete="off" autoCapitalize="none" />
          </Field>
          <Field label="Contact phone">
            <Input type="tel" name="contact_phone" autoComplete="off" />
          </Field>
        </>
      )}

      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <Submit className={`${BUTTON_PRIMARY} flex-1 sm:flex-none`}>{company ? 'Save changes' : 'Add to CRM'}</Submit>
        <Link href={cancelHref} className={`${BUTTON_SECONDARY} flex-1 sm:flex-none`}>
          Cancel
        </Link>
      </div>
    </ActionForm>
  )
}
