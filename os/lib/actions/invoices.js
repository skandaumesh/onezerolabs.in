'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { logChange } from '@/lib/audit'
import { requireUser } from '@/lib/auth'
import { tx } from '@/lib/db.mjs'
import { day, text, uuid } from '@/lib/forms'
import { financialYear, invoiceNumber, invoiceTotals } from '@/lib/invoice.mjs'
import { formatINR, parseAmount } from '@/lib/money.mjs'

const NUMBER_LOCK = 727402

/** The line rows, as submitted in order. Rows left wholly blank are ignored. */
const readItems = (form) => {
  const descriptions = form.getAll('item_description')
  const quantities = form.getAll('item_quantity')
  const rates = form.getAll('item_rate')
  const items = []
  for (let i = 0; i < descriptions.length; i++) {
    const description = String(descriptions[i] ?? '').trim()
    const rateText = String(rates[i] ?? '').trim()
    if (!description && !rateText) continue
    const quantity = parseAmount(String(quantities[i] ?? '').trim() || '1')
    const rate = parseAmount(rateText)
    if (!description) return { error: `Line ${i + 1} needs a description.` }
    if (!quantity) return { error: `Line ${i + 1} needs a quantity above zero.` }
    if (!rate) return { error: `Line ${i + 1} needs a rate above zero, as a number.` }
    items.push({ description, quantity, rate })
  }
  if (!items.length) return { error: 'Add at least one line.' }
  return { items }
}

const readDraft = (form) => {
  const companyId = uuid(form, 'company_id')
  const issueDate = day(form, 'issue_date')
  const dueDate = day(form, 'due_date')
  const billToName = text(form, 'bill_to_name')
  const gstRate = parseAmount(text(form, 'gst_rate') ?? '0')
  if (!companyId) return { error: 'Choose the client.' }
  if (!issueDate) return { error: 'Choose the invoice date.' }
  if (!billToName) return { error: 'Enter who the invoice is billed to.' }
  if (dueDate && dueDate < issueDate) return { error: 'The due date cannot be before the invoice date.' }
  if (gstRate === null || gstRate > 50) return { error: 'Choose a valid GST rate.' }
  const lines = readItems(form)
  if (lines.error) return lines
  return {
    companyId,
    issueDate,
    dueDate,
    billToName,
    gstRate,
    incomeId: uuid(form, 'income_id'),
    billToAddress: text(form, 'bill_to_address'),
    billToState: text(form, 'bill_to_state'),
    billToGstin: text(form, 'bill_to_gstin')?.toUpperCase() ?? null,
    notes: text(form, 'notes'),
    items: lines.items,
  }
}

const writeItems = async (t, invoiceId, items) => {
  await t.query('DELETE FROM invoice_items WHERE invoice_id = $1', [invoiceId])
  for (const [position, item] of items.entries()) {
    await t.query(
      'INSERT INTO invoice_items (invoice_id, position, description, quantity, rate) VALUES ($1, $2, $3, $4, $5)',
      [invoiceId, position, item.description, item.quantity, item.rate]
    )
  }
}

export async function createInvoice(_prev, form) {
  const user = await requireUser()
  const f = readDraft(form)
  if (f.error) return f

  const id = await tx(async (t) => {
    const [row] = await t.query(
      `INSERT INTO invoices (company_id, income_id, issue_date, due_date, bill_to_name, bill_to_address, bill_to_state,
                             bill_to_gstin, gst_rate, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
      [f.companyId, f.incomeId, f.issueDate, f.dueDate, f.billToName, f.billToAddress, f.billToState, f.billToGstin, f.gstRate, f.notes, user.id]
    )
    await writeItems(t, row.id, f.items)
    await logChange(t, user, {
      action: 'create',
      entity: 'invoice',
      entityId: row.id,
      summary: `Draft created for ${f.billToName}`,
      after: f,
    })
    return row.id
  })

  revalidatePath('/', 'layout')
  redirect(`/invoices/${id}`)
}

export async function updateInvoice(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')
  const f = readDraft(form)
  if (f.error) return f

  const refused = await tx(async (t) => {
    const [current] = await t.query('SELECT * FROM invoices WHERE id = $1 FOR UPDATE', [id])
    if (!current) return 'This invoice no longer exists.'
    // An issued invoice has been sent to someone. Its record must not change underneath them.
    if (current.status !== 'draft') return 'Only a draft can be edited. Cancel this invoice and issue a new one.'
    await t.query(
      `UPDATE invoices
       SET company_id = $2, income_id = $3, issue_date = $4, due_date = $5, bill_to_name = $6, bill_to_address = $7,
           bill_to_state = $8, bill_to_gstin = $9, gst_rate = $10, notes = $11, updated_at = now()
       WHERE id = $1`,
      [id, f.companyId, f.incomeId, f.issueDate, f.dueDate, f.billToName, f.billToAddress, f.billToState, f.billToGstin, f.gstRate, f.notes]
    )
    await writeItems(t, id, f.items)
    await logChange(t, user, { action: 'update', entity: 'invoice', entityId: id, summary: 'Draft edited', before: current, after: f })
    return null
  })
  if (refused) return { error: refused }

  revalidatePath('/', 'layout')
  redirect(`/invoices/${id}`)
}

/** Gives the draft its number and freezes the seller's details. After this it cannot be edited. */
export async function issueInvoice(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')

  const refused = await tx(async (t) => {
    await t.query(`SELECT pg_advisory_xact_lock(${NUMBER_LOCK})`) // two people cannot take the same number
    const [invoice] = await t.query('SELECT * FROM invoices WHERE id = $1 FOR UPDATE', [id])
    if (!invoice) return 'This invoice no longer exists.'
    if (invoice.status !== 'draft') return 'This invoice has already been issued.'
    const [settings] = await t.query('SELECT * FROM company_settings WHERE id')
    if (Number(invoice.gst_rate) > 0 && !settings.gstin) {
      return 'GST can only be charged with a GSTIN. Add yours in Invoice details, or set GST to none.'
    }

    const year = financialYear(invoice.issue_date)
    const series = `${settings.invoice_prefix}/${year}/`
    const [{ used }] = await t.query('SELECT count(*)::int AS used FROM invoices WHERE number LIKE $1', [`${series}%`])
    const number = invoiceNumber(settings.invoice_prefix, year, used + 1)

    await t.query(
      `UPDATE invoices SET number = $2, status = 'issued', seller = $3::jsonb, updated_at = now() WHERE id = $1`,
      [id, number, JSON.stringify(settings)]
    )
    await logChange(t, user, { action: 'issue', entity: 'invoice', entityId: id, summary: `Issued as ${number}` })
    return null
  })
  if (refused) return { error: refused }

  revalidatePath('/', 'layout')
  return { ok: true }
}

/** The number stays used, so the series keeps no gaps and the record stays honest. */
export async function cancelInvoice(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')

  const refused = await tx(async (t) => {
    const [invoice] = await t.query('SELECT number, status FROM invoices WHERE id = $1 FOR UPDATE', [id])
    if (!invoice) return 'This invoice no longer exists.'
    if (invoice.status === 'draft') return 'Delete a draft instead of cancelling it.'
    if (invoice.status === 'cancelled') return 'This invoice is already cancelled.'
    const [{ paid }] = await t.query('SELECT count(*)::int AS paid FROM invoice_payments WHERE invoice_id = $1', [id])
    if (paid > 0) return 'This invoice has payments recorded. Remove them first.'
    await t.query(`UPDATE invoices SET status = 'cancelled', updated_at = now() WHERE id = $1`, [id])
    await logChange(t, user, { action: 'cancel', entity: 'invoice', entityId: id, summary: `${invoice.number} cancelled` })
    return null
  })
  if (refused) return { error: refused }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteDraft(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')

  const refused = await tx(async (t) => {
    const [invoice] = await t.query('SELECT * FROM invoices WHERE id = $1 FOR UPDATE', [id])
    if (!invoice) return 'This invoice no longer exists.'
    if (invoice.status !== 'draft') return 'Only a draft can be deleted. Cancel an issued invoice instead.'
    await logChange(t, user, {
      action: 'delete',
      entity: 'invoice',
      entityId: id,
      summary: `Draft for ${invoice.bill_to_name} deleted`,
      before: invoice,
    })
    await t.query('DELETE FROM invoices WHERE id = $1', [id])
    return null
  })
  if (refused) return { error: refused }

  revalidatePath('/', 'layout')
  redirect('/invoices')
}

const balanceOf = async (t, invoice) => {
  const [{ subtotal, paid }] = await t.query(
    `SELECT COALESCE((SELECT sum(round(quantity * rate, 2)) FROM invoice_items WHERE invoice_id = $1), 0)::float8 AS subtotal,
            COALESCE((SELECT sum(amount) FROM invoice_payments WHERE invoice_id = $1), 0)::float8 AS paid`,
    [invoice.id]
  )
  const { total } = invoiceTotals(subtotal, Number(invoice.gst_rate), invoice.seller?.state, invoice.bill_to_state)
  return { total, paid, balance: Math.round((total - paid) * 100) / 100 }
}

/** Keeps the linked Revenue entry in step, so money received is only ever entered once. */
const adjustIncome = async (t, user, incomeId, change) => {
  if (!incomeId) return
  const [income] = await t.query('SELECT received::float8 AS received, kind FROM income WHERE id = $1', [incomeId])
  if (!income || income.kind === 'monthly') return
  const received = Math.max(0, Math.round(((income.received ?? 0) + change) * 100) / 100)
  await t.query('UPDATE income SET received = $2, updated_at = now() WHERE id = $1', [incomeId, received])
  await logChange(t, user, {
    action: 'update',
    entity: 'income',
    entityId: incomeId,
    summary: `Received set to ${formatINR(received)} by an invoice payment`,
    before: { received: income.received },
    after: { received },
  })
}

export async function recordPayment(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'invoice_id')
  const amount = parseAmount(text(form, 'amount'))
  const paidOn = day(form, 'paid_on')
  if (!amount) return { error: 'Enter the amount received, as a number.' }
  if (!paidOn) return { error: 'Choose the date it was received.' }

  const refused = await tx(async (t) => {
    const [invoice] = await t.query('SELECT * FROM invoices WHERE id = $1 FOR UPDATE', [id])
    if (!invoice) return 'This invoice no longer exists.'
    if (invoice.status !== 'issued') return 'Payments can only be recorded on an issued, unpaid invoice.'
    const { balance } = await balanceOf(t, invoice)
    if (amount > balance) return `That is more than the ${formatINR(balance)} still owed.`

    const [payment] = await t.query(
      `INSERT INTO invoice_payments (invoice_id, amount, paid_on, method, reference, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [id, amount, paidOn, text(form, 'method'), text(form, 'reference'), user.id]
    )
    if (amount === balance) await t.query(`UPDATE invoices SET status = 'paid', updated_at = now() WHERE id = $1`, [id])
    await adjustIncome(t, user, invoice.income_id, amount)
    await logChange(t, user, {
      action: 'payment',
      entity: 'invoice',
      entityId: id,
      summary: `${formatINR(amount)} received`,
      after: { paymentId: payment.id, amount, paidOn },
    })
    return null
  })
  if (refused) return { error: refused }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deletePayment(_prev, form) {
  const user = await requireUser()
  const paymentId = uuid(form, 'id')

  const refused = await tx(async (t) => {
    const [payment] = await t.query(
      'SELECT invoice_id, amount::float8 AS amount, paid_on FROM invoice_payments WHERE id = $1',
      [paymentId]
    )
    if (!payment) return 'This payment no longer exists.'
    const [invoice] = await t.query('SELECT income_id FROM invoices WHERE id = $1 FOR UPDATE', [payment.invoice_id])
    await t.query('DELETE FROM invoice_payments WHERE id = $1', [paymentId])
    await t.query(`UPDATE invoices SET status = 'issued', updated_at = now() WHERE id = $1 AND status = 'paid'`, [payment.invoice_id])
    await adjustIncome(t, user, invoice.income_id, -payment.amount)
    await logChange(t, user, {
      action: 'payment-removed',
      entity: 'invoice',
      entityId: payment.invoice_id,
      summary: `${formatINR(payment.amount)} payment removed`,
      before: payment,
    })
    return null
  })
  if (refused) return { error: refused }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function saveSettings(_prev, form) {
  const user = await requireUser()
  const legalName = text(form, 'legal_name')
  const prefix = text(form, 'invoice_prefix')?.toUpperCase()
  const gstin = text(form, 'gstin')?.toUpperCase() ?? null
  if (!legalName) return { error: 'Enter the business name.' }
  if (!prefix || !/^[A-Z0-9]{1,5}$/.test(prefix)) return { error: 'The invoice prefix must be 1 to 5 letters or numbers.' }
  if (gstin && !/^[0-9A-Z]{15}$/.test(gstin)) return { error: 'A GSTIN has exactly 15 letters and numbers.' }

  await tx(async (t) => {
    const [before] = await t.query('SELECT * FROM company_settings WHERE id')
    await t.query(
      `UPDATE company_settings
       SET legal_name = $1, address = $2, state = $3, email = $4, phone = $5, udyam = $6, gstin = $7, bank_name = $8,
           account_name = $9, account_number = $10, ifsc = $11, upi_id = $12, invoice_prefix = $13, invoice_terms = $14,
           updated_at = now()
       WHERE id`,
      [
        legalName,
        text(form, 'address'),
        text(form, 'state'),
        text(form, 'email'),
        text(form, 'phone'),
        text(form, 'udyam'),
        gstin,
        text(form, 'bank_name'),
        text(form, 'account_name'),
        text(form, 'account_number'),
        text(form, 'ifsc')?.toUpperCase() ?? null,
        text(form, 'upi_id'),
        prefix,
        text(form, 'invoice_terms'),
      ]
    )
    await logChange(t, user, { action: 'update', entity: 'settings', entityId: null, summary: 'Invoice details changed', before })
  })

  revalidatePath('/', 'layout')
  return { ok: true }
}
