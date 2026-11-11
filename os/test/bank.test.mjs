import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { dueBy, formatMonth, keepOf, shareOf, shareStatus, summariseBank, whoseLabel, whoseOptions } from '../lib/bank.mjs'

describe('the 25% share', () => {
  test('matches the partners agreement examples', () => {
    assert.equal(shareOf(40000), 10000)
    assert.equal(keepOf(40000), 30000)
    assert.equal(shareOf(2000), 500)
    assert.equal(keepOf(2000), 1500)
  })

  test('is worked out to the paisa, rounding half a paisa up', () => {
    assert.equal(shareOf(10000.5), 2500.13)
    assert.equal(keepOf(10000.5), 7500.37)
    assert.equal(shareOf(0.1), 0.03)
    assert.equal(shareOf(333.33), 83.33)
  })

  test('share and keep always add back up to the earning', () => {
    for (const amount of [1, 7, 99.99, 1234.56, 10000.01, 125000]) {
      assert.equal(Math.round((shareOf(amount) + keepOf(amount)) * 100) / 100, amount, String(amount))
    }
  })
})

describe('when the share is due', () => {
  test('within 7 days of the money arriving', () => {
    assert.equal(dueBy('2026-11-10'), '2026-11-17')
    assert.equal(dueBy('2026-11-28'), '2026-12-05')
  })

  test('paid, due, or late', () => {
    assert.deepEqual(shareStatus({ received_on: '2026-11-01', paid_on: '2026-11-02' }, '2026-11-20'), { text: 'Paid in', tone: 'good' })
    assert.deepEqual(shareStatus({ received_on: '2026-11-10', paid_on: null }, '2026-11-12'), { text: 'Due by 17 Nov', tone: 'soon' })
    assert.deepEqual(shareStatus({ received_on: '2026-11-10', paid_on: null }, '2026-11-17'), { text: 'Due by 17 Nov', tone: 'soon' })
    assert.deepEqual(shareStatus({ received_on: '2026-11-10', paid_on: null }, '2026-11-18'), { text: '1 day late', tone: 'late' })
    assert.deepEqual(shareStatus({ received_on: '2026-11-01', paid_on: null }, '2026-11-12'), { text: '4 days late', tone: 'late' })
  })
})

describe('the bank summary', () => {
  const users = [{ id: 's', name: 'Skanda' }, { id: 't', name: 'Tanisha' }]
  const today = '2026-11-10'
  const earnings = [
    { user_id: 's', amount: 10000, share: 2500, received_on: '2026-11-03', paid_on: '2026-11-03' },
    { user_id: 't', amount: 8000, share: 2000, received_on: '2026-11-08', paid_on: null },
    { user_id: 't', amount: 4000, share: 1000, received_on: '2026-10-20', paid_on: '2026-10-21' },
  ]
  const entries = [
    { direction: 'in', amount: 5000, entry_date: '2026-10-01' },
    { direction: 'out', amount: 1200, entry_date: '2026-11-05' },
  ]
  const summary = summariseBank({ earnings, entries, users, today })

  test('the balance counts only shares already paid in', () => {
    assert.equal(summary.balance, 2500 + 1000 + 5000 - 1200)
    assert.equal(summary.toPay, 2000)
  })

  test('this month in and out', () => {
    assert.equal(summary.monthIn, 2500)
    assert.equal(summary.monthOut, 1200)
  })

  test('each month lists both founders, newest first', () => {
    assert.deepEqual(summary.byMonth.map((m) => m.key), ['2026-11', '2026-10'])
    assert.deepEqual(summary.byMonth[0].people, [
      { name: 'Skanda', earned: 10000, share: 2500 },
      { name: 'Tanisha', earned: 8000, share: 2000 },
    ])
    assert.equal(summary.byMonth[0].toCompany, 4500)
    assert.deepEqual(summary.byMonth[1].people[0], { name: 'Skanda', earned: 0, share: 0 })
  })

  test('a month with nothing yet still shows both founders at zero', () => {
    const empty = summariseBank({ earnings: [], entries: [], users, today })
    assert.equal(empty.balance, 0)
    assert.equal(empty.thisMonth.label, 'November 2026')
    assert.deepEqual(empty.thisMonth.people.map((p) => p.earned), [0, 0])
  })

  test('a balance can go below zero, and shows it', () => {
    const owing = summariseBank({ earnings: [], entries: [{ direction: 'out', amount: 300, entry_date: today }], users, today })
    assert.equal(owing.balance, -300)
  })

  test('months read naturally', () => {
    assert.equal(formatMonth('2026-11'), 'November 2026')
    assert.equal(formatMonth('2027-01'), 'January 2027')
  })
})

describe('whose money', () => {
  const users = [{ id: 's', name: 'Skanda' }, { id: 't', name: 'Tanisha' }]
  test('each founder, both, or the company', () => {
    assert.deepEqual(whoseOptions(users).map((o) => o.label), ['Skanda’s money', 'Tanisha’s money', 'Both of ours', 'The company’s money'])
  })
  test('an entry says whose it was; older ones say nothing', () => {
    assert.equal(whoseLabel({ owner_kind: 'person', owner_name: 'Tanisha' }), 'Tanisha’s money')
    assert.equal(whoseLabel({ owner_kind: 'both' }), 'Both of ours')
    assert.equal(whoseLabel({ owner_kind: 'company' }), 'The company’s money')
    assert.equal(whoseLabel({ owner_kind: null }), null)
  })
})
