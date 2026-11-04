import assert from 'node:assert/strict'
import { after, before, describe, test } from 'node:test'
import { PGlite } from '@electric-sql/pglite'
import { migrations } from '../lib/migrations.mjs'
import { formatINR, parseAmount, receivedStatus, summariseIncome } from '../lib/money.mjs'

describe('money', () => {
  test('amounts use Indian grouping, with paise only when there are some', () => {
    assert.equal(formatINR(125000), '₹1,25,000')
    assert.equal(formatINR(12500), '₹12,500')
    assert.equal(formatINR(1500.5), '₹1,500.50')
  })

  test('typed amounts are read however they were written', () => {
    for (const [typed, amount] of [['35000', 35000], ['₹1,25,000', 125000], ['1,500.50', 1500.5], ['Rs. 7000', 7000]]) {
      assert.equal(parseAmount(typed), amount, typed)
    }
  })

  test('anything that is not an amount is refused', () => {
    for (const typed of ['', 'abc', '-500', '12.345', '1e5', null, undefined]) {
      assert.equal(parseAmount(typed), null, String(typed))
    }
  })

  test('totals keep value and money received apart', () => {
    const totals = summariseIncome([
      { company_id: 'a', kind: 'project', amount: 120000, received: null },
      { company_id: 'b', kind: 'project', amount: 40000, received: 40000 },
      { company_id: 'b', kind: 'monthly', amount: 5000, received: null },
      { company_id: 'c', kind: 'other', amount: 7000, received: null },
    ])
    assert.deepEqual(totals, { projectValue: 160000, monthly: 5000, other: 7000, received: 40000, unrecorded: 2, clients: 3 })
  })

  test('a job nobody has recorded is not treated as unpaid', () => {
    assert.equal(receivedStatus({ amount: 100, received: null }).text, 'Not recorded')
    assert.equal(receivedStatus({ amount: 100, received: 0 }).text, 'Nothing received')
    assert.equal(receivedStatus({ amount: 100, received: 100 }).text, 'Paid in full')
    assert.equal(receivedStatus({ amount: 100, received: 40 }).text, '₹60 to come')
  })
})

describe('income rules', () => {
  let db
  let client

  before(async () => {
    db = new PGlite()
    for (const m of migrations) await db.exec(m.sql)
    const { rows } = await db.query(`INSERT INTO companies (name, stage) VALUES ('Client', 'won') RETURNING id`)
    client = rows[0].id
  })
  after(() => db.close())

  const add = (kind, amount, received = null) =>
    db.query(
      `INSERT INTO income (company_id, kind, description, amount, received) VALUES ($1, $2, 'Work', $3, $4)`,
      [client, kind, amount, received]
    )

  test('income must be for more than nothing', async () => {
    await assert.rejects(add('project', 0), /check/i)
  })

  test('a monthly fee cannot carry a total received', async () => {
    await assert.rejects(add('monthly', 1500, 1500), /monthly_income_has_no_total_received/)
    await add('monthly', 1500)
  })

  test('a client with income on record cannot be deleted', async () => {
    await assert.rejects(db.query('DELETE FROM companies WHERE id = $1', [client]), /foreign key/)
  })
})
