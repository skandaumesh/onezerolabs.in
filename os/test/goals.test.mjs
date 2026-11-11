import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { countsByTaps, goalState, periodEnd, periodLabel, periodStart, progressText, shiftPeriod } from '../lib/goals.mjs'

describe('goal periods', () => {
  test('a week starts on Monday', () => {
    // 11 Nov 2026 is a Wednesday; 15 Nov a Sunday, still the same week.
    assert.equal(periodStart('week', '2026-11-11'), '2026-11-09')
    assert.equal(periodStart('week', '2026-11-15'), '2026-11-09')
    assert.equal(periodStart('week', '2026-11-16'), '2026-11-16')
  })

  test('a week can start in the month or year before', () => {
    assert.equal(periodStart('week', '2027-01-01'), '2026-12-28')
  })

  test('months and years start on the 1st', () => {
    assert.equal(periodStart('month', '2026-11-30'), '2026-11-01')
    assert.equal(periodStart('year', '2026-11-30'), '2026-01-01')
    assert.equal(periodStart('day', '2026-11-30'), '2026-11-30')
  })

  test('moving between periods crosses month and year ends', () => {
    assert.equal(shiftPeriod('day', '2026-12-31', 1), '2027-01-01')
    assert.equal(shiftPeriod('week', '2026-12-28', 1), '2027-01-04')
    assert.equal(shiftPeriod('month', '2026-12-01', 1), '2027-01-01')
    assert.equal(shiftPeriod('month', '2026-01-01', -1), '2025-12-01')
    assert.equal(shiftPeriod('month', '2026-11-01', -13), '2025-10-01')
    assert.equal(shiftPeriod('year', '2026-01-01', -1), '2025-01-01')
  })

  test('a period ends the day before the next one starts', () => {
    assert.equal(periodEnd('week', '2026-11-09'), '2026-11-15')
    assert.equal(periodEnd('month', '2026-02-01'), '2026-02-28')
    assert.equal(periodEnd('year', '2026-01-01'), '2026-12-31')
  })
})

describe('goal period names', () => {
  const today = '2026-11-11'

  test('near periods have names, with their dates beside them', () => {
    assert.deepEqual(periodLabel('day', '2026-11-11', today), { name: 'Today', detail: 'Wednesday 11 November' })
    assert.equal(periodLabel('day', '2026-11-10', today).name, 'Yesterday')
    assert.deepEqual(periodLabel('week', '2026-11-09', today), { name: 'This week', detail: '9 – 15 November' })
    assert.equal(periodLabel('week', '2026-11-16', today).name, 'Next week')
    assert.deepEqual(periodLabel('month', '2026-10-01', today), { name: 'Last month', detail: 'October 2026' })
    assert.deepEqual(periodLabel('year', '2026-01-01', today), { name: 'This year', detail: '2026' })
  })

  test('far periods are named by their dates alone', () => {
    assert.deepEqual(periodLabel('month', '2026-06-01', today), { name: 'June 2026', detail: null })
    assert.deepEqual(periodLabel('week', '2026-11-30', today), { name: 'Week of 30 Nov', detail: '30 Nov – 6 Dec' })
    assert.equal(periodLabel('day', '2026-11-20', today).name, '20 Nov')
  })
})

describe('goal progress', () => {
  test('a goal with a target is done once the target is reached', () => {
    assert.deepEqual(goalState({ target: 20, value: 5 }), { done: false, percent: 25 })
    assert.deepEqual(goalState({ target: 20, value: 20 }), { done: true, percent: 100 })
    assert.deepEqual(goalState({ target: 20, value: 26 }), { done: true, percent: 100 })
  })

  test('a goal without a target is simply ticked', () => {
    assert.deepEqual(goalState({ target: null, done: true }), { done: true, percent: 100 })
    assert.deepEqual(goalState({ target: null, done: false }), { done: false, percent: 0 })
  })

  test('progress reads naturally, in Indian number style', () => {
    assert.equal(progressText({ target: 20, value: 6, unit: 'calls' }), '6 of 20 calls')
    assert.equal(progressText({ target: 100000, value: 40000, unit: '₹' }), '₹40,000 of ₹1,00,000')
    assert.equal(progressText({ target: null, value: 0 }), null)
  })

  test('small targets count up by taps; big ones are typed', () => {
    assert.equal(countsByTaps(20), true)
    assert.equal(countsByTaps(100000), false)
    assert.equal(countsByTaps(null), false)
  })
})
