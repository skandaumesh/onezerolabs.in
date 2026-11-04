import assert from 'node:assert/strict'
import { after, before, describe, test } from 'node:test'
import { PGlite } from '@electric-sql/pglite'
import { amountInWords, financialYear, invoiceNumber, invoiceState, invoiceTotals, lineAmount, subtotalOf } from '../lib/invoice.mjs'
import { migrations } from '../lib/migrations.mjs'

describe('invoice sums', () => {
  test('lines and subtotal round to the paisa', () => {
    assert.equal(lineAmount({ quantity: 3, rate: 33.33 }), 99.99)
    assert.equal(subtotalOf([{ quantity: 1, rate: 0.1 }, { quantity: 1, rate: 0.2 }]), 0.3)
  })

  test('GST splits into CGST and SGST within the same state', () => {
    const t = invoiceTotals(10000, 18, 'Karnataka', 'karnataka ')
    assert.deepEqual([t.cgst, t.sgst, t.igst, t.total], [900, 900, 0, 11800])
  })

  test('GST is one IGST line across states', () => {
    const t = invoiceTotals(10000, 18, 'Karnataka', 'Maharashtra')
    assert.deepEqual([t.cgst, t.sgst, t.igst, t.total], [0, 0, 1800, 11800])
  })

  test('an unstated client state counts as the same state', () => {
    assert.equal(invoiceTotals(10000, 18, 'Karnataka', '').intraState, true)
  })

  test('CGST and SGST always add back up to the full GST', () => {
    const t = invoiceTotals(333.33, 18, 'Karnataka', 'Karnataka')
    assert.equal(Math.round((t.cgst + t.sgst) * 100) / 100, t.gst)
  })

  test('no GST means the total is the subtotal', () => {
    assert.equal(invoiceTotals(25000, 0, 'Karnataka', '').total, 25000)
  })
})

describe('invoice numbers', () => {
  test('the financial year turns over in April', () => {
    assert.equal(financialYear('2026-11-04'), '26-27')
    assert.equal(financialYear('2027-03-31'), '26-27')
    assert.equal(financialYear('2027-04-01'), '27-28')
  })

  test('numbers fit the 16 character GST limit', () => {
    const n = invoiceNumber('OZL', '26-27', 1)
    assert.equal(n, 'OZL/26-27/001')
    assert.ok(n.length <= 16)
    assert.ok(invoiceNumber('ABCDE', '26-27', 999).length <= 16)
  })
})

describe('amount in words', () => {
  for (const [amount, words] of [
    [235000, 'Rupees Two Lakh Thirty Five Thousand Only'],
    [11500, 'Rupees Eleven Thousand Five Hundred Only'],
    [150000, 'Rupees One Lakh Fifty Thousand Only'],
    [1500.5, 'Rupees One Thousand Five Hundred and Fifty Paise Only'],
    [10000000, 'Rupees One Crore Only'],
    [12345678, 'Rupees One Crore Twenty Three Lakh Forty Five Thousand Six Hundred Seventy Eight Only'],
    [19, 'Rupees Nineteen Only'],
    [0, 'Rupees Zero Only'],
  ]) {
    test(String(amount), () => assert.equal(amountInWords(amount), words))
  }
})

describe('invoice state', () => {
  const today = '2026-11-04'
  const state = (over) => invoiceState({ status: 'issued', paid: 0, total: 100, due_date: '2026-11-20', ...over }, today).text

  test('reads correctly at each stage', () => {
    assert.equal(state({ status: 'draft' }), 'Draft')
    assert.equal(state({ status: 'paid', paid: 100 }), 'Paid')
    assert.equal(state({ status: 'cancelled' }), 'Cancelled')
    assert.equal(state({}), 'Awaiting payment')
    assert.equal(state({ paid: 40 }), 'Part paid')
  })

  test('overdue is worked out from today', () => {
    assert.equal(state({ due_date: '2026-11-03' }), 'Overdue')
    assert.equal(state({ due_date: '2026-11-04' }), 'Awaiting payment')
    assert.equal(state({ due_date: null }), 'Awaiting payment')
  })

  test('a draft or paid invoice is never overdue', () => {
    assert.equal(state({ status: 'draft', due_date: '2020-01-01' }), 'Draft')
    assert.equal(state({ status: 'paid', due_date: '2020-01-01' }), 'Paid')
  })
})

describe('invoice database rules', () => {
  let db
  let client

  before(async () => {
    db = new PGlite()
    for (const m of migrations) await db.exec(m.sql)
    const { rows } = await db.query(`INSERT INTO companies (name, stage) VALUES ('Client', 'won') RETURNING id`)
    client = rows[0].id
  })
  after(() => db.close())

  const draft = () =>
    db.query(`INSERT INTO invoices (company_id, issue_date, bill_to_name) VALUES ($1, '2026-11-04', 'Client') RETURNING id`, [client])

  test('settings start with the public business details and no bank details', async () => {
    const { rows } = await db.query('SELECT * FROM company_settings WHERE id')
    assert.equal(rows.length, 1)
    assert.equal(rows[0].state, 'Karnataka')
    assert.equal(rows[0].account_number, null)
    assert.equal(rows[0].gstin, null)
  })

  test('there can only ever be one settings row', async () => {
    await assert.rejects(db.query(`INSERT INTO company_settings (id) VALUES (false)`), /check/i)
    await assert.rejects(db.query(`INSERT INTO company_settings (id) VALUES (true)`), /duplicate|unique/i)
  })

  test('an issued invoice must have a number and frozen seller details', async () => {
    const { rows } = await draft()
    await assert.rejects(db.query(`UPDATE invoices SET status = 'issued' WHERE id = $1`, [rows[0].id]), /issued_invoices_have_numbers/)
  })

  test('the same number cannot be used twice', async () => {
    const seller = JSON.stringify({ legal_name: 'x' })
    const a = (await draft()).rows[0].id
    const b = (await draft()).rows[0].id
    await db.query(`UPDATE invoices SET status = 'issued', number = 'OZL/26-27/900', seller = $2 WHERE id = $1`, [a, seller])
    await assert.rejects(db.query(`UPDATE invoices SET status = 'issued', number = 'OZL/26-27/900', seller = $2 WHERE id = $1`, [b, seller]), /unique/i)
  })

  test('an invoice with a payment cannot be deleted', async () => {
    const id = (await draft()).rows[0].id
    await db.query(`INSERT INTO invoice_payments (invoice_id, amount, paid_on) VALUES ($1, 100, '2026-11-04')`, [id])
    await assert.rejects(db.query('DELETE FROM invoices WHERE id = $1', [id]), /foreign key/)
  })

  test('a client with an invoice cannot be deleted', async () => {
    await assert.rejects(db.query('DELETE FROM companies WHERE id = $1', [client]), /foreign key/)
  })
})
