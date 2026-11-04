import { ActionForm, Submit } from '@/components/forms'
import { BUTTON_PRIMARY, Card, Field, Input, PageHeader, Textarea } from '@/components/ui'
import { saveSettings } from '@/lib/actions/invoices'
import { requireUser } from '@/lib/auth'
import { getSettings } from '@/lib/queries'

export const metadata = { title: 'Invoice details' }

export default async function InvoiceSettingsPage() {
  await requireUser()
  const s = await getSettings()

  return (
    <div className="max-w-3xl">
      <PageHeader
        back={{ href: '/invoices', label: 'Invoices' }}
        title="Invoice details"
        description="Printed on new invoices. Changing them never alters an invoice already issued."
      />
      <ActionForm action={saveSettings} success="Saved" className="space-y-4">
        <Card title="Your business">
          <div className="grid grid-cols-1 gap-4 p-4 pt-1 sm:grid-cols-2">
            <Field label="Business name" wide>
              <Input name="legal_name" required defaultValue={s.legal_name} />
            </Field>
            <Field label="Address" wide>
              <Input name="address" defaultValue={s.address ?? ''} />
            </Field>
            <Field label="State" hint="Decides how GST splits.">
              <Input name="state" defaultValue={s.state ?? ''} />
            </Field>
            <Field label="Udyam number">
              <Input name="udyam" defaultValue={s.udyam ?? ''} />
            </Field>
            <Field label="Email">
              <Input type="email" name="email" autoCapitalize="none" defaultValue={s.email ?? ''} />
            </Field>
            <Field label="Phone">
              <Input type="tel" name="phone" defaultValue={s.phone ?? ''} />
            </Field>
            <Field label="GSTIN" hint="Leave blank if not registered. GST can’t be charged without it." wide>
              <Input name="gstin" autoCapitalize="characters" defaultValue={s.gstin ?? ''} />
            </Field>
          </div>
        </Card>

        <Card title="How you get paid">
          <div className="grid grid-cols-1 gap-4 p-4 pt-1 sm:grid-cols-2">
            <Field label="Bank">
              <Input name="bank_name" defaultValue={s.bank_name ?? ''} autoComplete="off" />
            </Field>
            <Field label="Account name">
              <Input name="account_name" defaultValue={s.account_name ?? ''} autoComplete="off" />
            </Field>
            <Field label="Account number">
              <Input name="account_number" inputMode="numeric" defaultValue={s.account_number ?? ''} autoComplete="off" />
            </Field>
            <Field label="IFSC">
              <Input name="ifsc" autoCapitalize="characters" defaultValue={s.ifsc ?? ''} autoComplete="off" />
            </Field>
            <Field label="UPI ID" wide>
              <Input name="upi_id" autoCapitalize="none" defaultValue={s.upi_id ?? ''} autoComplete="off" />
            </Field>
          </div>
        </Card>

        <Card title="Invoices">
          <div className="grid grid-cols-1 gap-4 p-4 pt-1 sm:grid-cols-2">
            <Field label="Number prefix" hint="OZL gives OZL/26-27/001.">
              <Input name="invoice_prefix" required autoCapitalize="characters" defaultValue={s.invoice_prefix} />
            </Field>
            <Field label="Terms" hint="Printed at the foot of every invoice." wide>
              <Textarea name="invoice_terms" rows={3} defaultValue={s.invoice_terms ?? ''} />
            </Field>
          </div>
        </Card>

        <Submit className={`${BUTTON_PRIMARY} w-full sm:w-auto`}>Save details</Submit>
      </ActionForm>
    </div>
  )
}
