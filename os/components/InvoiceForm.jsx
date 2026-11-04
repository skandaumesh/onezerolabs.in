'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import { ActionForm, Submit } from '@/components/forms'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, CONTROL, Field, Input, Select, Textarea } from '@/components/ui'
import { invoiceTotals, subtotalOf } from '@/lib/invoice.mjs'
import { formatINR, parseAmount } from '@/lib/money.mjs'

const GST_RATES = [
  { value: '0', label: 'No GST' },
  { value: '5', label: '5%' },
  { value: '12', label: '12%' },
  { value: '18', label: '18%' },
  { value: '28', label: '28%' },
]

const emptyLine = (key) => ({ key, description: '', quantity: '1', rate: '' })

/** Used to create and to edit a draft. Totals update as you type, using the same sums as the PDF. */
export function InvoiceForm({ action, invoice, items, clients, income, settings, today, defaultDue, defaultClient, cancelHref }) {
  const i = invoice || {}
  const [companyId, setCompanyId] = useState(i.company_id ?? defaultClient ?? '')
  const [billToName, setBillToName] = useState(i.bill_to_name ?? clients.find((c) => c.id === defaultClient)?.name ?? '')
  const [billToAddress, setBillToAddress] = useState(i.bill_to_address ?? clients.find((c) => c.id === defaultClient)?.address ?? '')
  const [clientState, setClientState] = useState(i.bill_to_state ?? '')
  const [gstRate, setGstRate] = useState(String(i.gst_rate ?? (settings.gstin ? 18 : 0)))
  const [lines, setLines] = useState(() =>
    items?.length
      ? items.map((it, index) => ({ key: index, description: it.description, quantity: String(it.quantity), rate: String(it.rate) }))
      : [emptyLine(0)]
  )
  const [nextKey, setNextKey] = useState((items?.length ?? 1) + 1)

  const pickClient = (id) => {
    setCompanyId(id)
    const client = clients.find((c) => c.id === id)
    setBillToName(client?.name ?? '')
    setBillToAddress(client?.address ?? '')
  }

  const update = (key, field, value) => setLines((all) => all.map((l) => (l.key === key ? { ...l, [field]: value } : l)))
  const addLine = () => {
    setLines((all) => [...all, emptyLine(nextKey)])
    setNextKey((k) => k + 1)
  }
  const removeLine = (key) => setLines((all) => (all.length > 1 ? all.filter((l) => l.key !== key) : all))

  const totals = useMemo(() => {
    const valid = lines
      .map((l) => ({ quantity: parseAmount(l.quantity) ?? 0, rate: parseAmount(l.rate) ?? 0 }))
      .filter((l) => l.quantity && l.rate)
    return invoiceTotals(subtotalOf(valid), Number(gstRate), settings.state, clientState)
  }, [lines, gstRate, clientState, settings.state])

  // A job already recorded as fully paid is not offered: a payment here would count the money twice.
  const clientIncome = income.filter(
    (row) =>
      row.company_id === companyId &&
      row.kind !== 'monthly' &&
      (row.id === i.income_id || row.received === null || row.received < row.amount)
  )

  return (
    <ActionForm action={action} className="space-y-4">
      {invoice && <input type="hidden" name="id" value={invoice.id} />}

      <section className="card-surface grid grid-cols-1 gap-4 rounded-card bg-surface p-4 sm:grid-cols-2 md:p-5">
        <Field label="Client" wide>
          <select
            name="company_id"
            required
            value={companyId}
            onChange={(e) => pickClient(e.target.value)}
            className={`${CONTROL} select-arrow`}
          >
            <option value="">Choose a client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Bill to" hint="As it should appear on the invoice." wide>
          <Input name="bill_to_name" required value={billToName} onChange={(e) => setBillToName(e.target.value)} autoComplete="off" />
        </Field>
        <Field label="Address" wide>
          <Input name="bill_to_address" value={billToAddress} onChange={(e) => setBillToAddress(e.target.value)} autoComplete="off" />
        </Field>
        <Field label="Client’s state" hint={`Decides how GST splits. Blank means ${settings.state || 'your state'}.`}>
          <Input name="bill_to_state" value={clientState} onChange={(e) => setClientState(e.target.value)} autoComplete="off" />
        </Field>
        <Field label="Client’s GSTIN" hint="If they have one.">
          <Input name="bill_to_gstin" defaultValue={i.bill_to_gstin ?? ''} autoCapitalize="characters" autoComplete="off" />
        </Field>
        <Field label="Invoice date">
          <Input type="date" name="issue_date" required defaultValue={i.issue_date ?? today} />
        </Field>
        <Field label="Due date">
          <Input type="date" name="due_date" defaultValue={i.due_date ?? defaultDue} />
        </Field>
        {clientIncome.length > 0 && (
          <Field label="Revenue entry" hint="Payments on this invoice will update it." wide>
            <Select
              name="income_id"
              blank="Not linked"
              defaultValue={i.income_id ?? ''}
              options={clientIncome.map((row) => ({ value: row.id, label: `${row.description}, ${formatINR(row.amount)}` }))}
            />
          </Field>
        )}
      </section>

      <section className="card-surface rounded-card bg-surface p-4 md:p-5">
        <h2 className="mb-3 text-headline text-ink">What it’s for</h2>
        <ul className="space-y-4">
          {lines.map((line, index) => (
            <li key={line.key} className="grid grid-cols-[1fr_1fr_auto] gap-2 sm:grid-cols-[minmax(0,1fr)_5rem_7.5rem_auto]">
              <div className="col-span-3 sm:col-span-1">
                <input
                  name="item_description"
                  aria-label={`Line ${index + 1} description`}
                  placeholder="Description"
                  value={line.description}
                  onChange={(e) => update(line.key, 'description', e.target.value)}
                  autoComplete="off"
                  className={CONTROL}
                />
              </div>
              <input
                name="item_quantity"
                aria-label={`Line ${index + 1} quantity`}
                placeholder="Qty"
                inputMode="decimal"
                value={line.quantity}
                onChange={(e) => update(line.key, 'quantity', e.target.value)}
                autoComplete="off"
                className={CONTROL}
              />
              <input
                name="item_rate"
                aria-label={`Line ${index + 1} rate`}
                placeholder="Rate (₹)"
                inputMode="decimal"
                value={line.rate}
                onChange={(e) => update(line.key, 'rate', e.target.value)}
                autoComplete="off"
                className={CONTROL}
              />
              <button
                type="button"
                aria-label={`Remove line ${index + 1}`}
                disabled={lines.length === 1}
                onClick={() => removeLine(line.key)}
                className="press flex h-11 w-11 items-center justify-center rounded-full text-muted hover:text-late disabled:opacity-30 md:h-10 md:w-10"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={addLine} className={`${BUTTON_SECONDARY} mt-4`}>
          <Plus size={16} aria-hidden="true" />
          Add line
        </button>
      </section>

      <section className="card-surface rounded-card bg-surface p-4 md:p-5">
        {settings.gstin ? (
          <div className="mb-4 sm:w-48">
            <Field label="GST">
              <select name="gst_rate" value={gstRate} onChange={(e) => setGstRate(e.target.value)} className={`${CONTROL} select-arrow`}>
                {GST_RATES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        ) : (
          <>
            <input type="hidden" name="gst_rate" value="0" />
            <p className="mb-4 text-foot text-muted">
              No GST is charged because no GSTIN is saved.{' '}
              <Link href="/invoices/settings" className="text-accent">
                Add one in Invoice details
              </Link>{' '}
              if you’re registered.
            </p>
          </>
        )}

        <dl className="space-y-1.5 text-body md:text-sub">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Subtotal</dt>
            <dd className="text-ink tabular-nums">{formatINR(totals.subtotal)}</dd>
          </div>
          {totals.gst > 0 && totals.intraState && (
            <>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">CGST {Number(gstRate) / 2}%</dt>
                <dd className="text-ink tabular-nums">{formatINR(totals.cgst)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">SGST {Number(gstRate) / 2}%</dt>
                <dd className="text-ink tabular-nums">{formatINR(totals.sgst)}</dd>
              </div>
            </>
          )}
          {totals.gst > 0 && !totals.intraState && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">IGST {gstRate}%</dt>
              <dd className="text-ink tabular-nums">{formatINR(totals.igst)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 border-t border-line pt-2 text-headline text-ink">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatINR(totals.total)}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <Field label="Notes" hint="Printed on the invoice.">
            <Textarea name="notes" rows={2} defaultValue={i.notes ?? ''} />
          </Field>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Submit className={`${BUTTON_PRIMARY} flex-1 sm:flex-none`}>Save draft</Submit>
        <Link href={cancelHref} className={`${BUTTON_SECONDARY} flex-1 sm:flex-none`}>
          Cancel
        </Link>
      </div>
    </ActionForm>
  )
}
