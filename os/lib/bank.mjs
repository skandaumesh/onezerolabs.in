/**
 * The OneZeroLabs fund, as the partners agreement sets it out: each partner pays
 * 25% of everything they earn from OneZeroLabs work into the company bank account
 * within 7 days, and every payment out of it needs both partners to agree.
 */

import { addDays, daysBetween, formatDay } from './dates.mjs'

export const SHARE_PERCENT = 25
export const PAY_WITHIN_DAYS = 7

/** What the fund may be spent on, from the agreement's own list. */
export const SPEND_CATEGORIES = [
  { value: 'tools', label: 'Software and tools' },
  { value: 'hosting', label: 'Hosting and domains' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'legal', label: 'Legal and accounting' },
  { value: 'other', label: 'Other' },
]
export const SPEND_LABEL = Object.fromEntries(SPEND_CATEGORIES.map((c) => [c.value, c.label]))

/** 25% of an earning, to the paisa, rounding half a paisa up. */
export const shareOf = (amount, percent = SHARE_PERCENT) => Math.round(amount * percent + 1e-6) / 100

/** What the partner keeps once the share is paid in. */
export const keepOf = (amount, percent = SHARE_PERCENT) => Math.round((amount - shareOf(amount, percent)) * 100) / 100

/** The last day the share may be paid in, 7 days after the money arrived. */
export const dueBy = (receivedOn) => addDays(receivedOn, PAY_WITHIN_DAYS)

/** Paid in, due by a date, or late. */
export const shareStatus = ({ received_on, paid_on }, today) => {
  if (paid_on) return { text: 'Paid in', tone: 'good' }
  const due = dueBy(received_on)
  const late = daysBetween(due, today)
  if (late > 0) return { text: `${late} day${late === 1 ? '' : 's'} late`, tone: 'late' }
  return { text: `Due by ${formatDay(due, today)}`, tone: 'soon' }
}

export const monthKey = (day) => day.slice(0, 7)

/** '2026-11' -> 'November 2026'. */
export const formatMonth = (key) =>
  new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${key}-01T00:00:00Z`))

const cents = (n) => Math.round(n * 100) / 100

/**
 * Everything the Bank page shows, from the raw rows.
 * `earnings`: { user_id, amount, share, received_on, paid_on }
 * `entries`:  { direction: 'in' | 'out', amount, entry_date }
 * Only shares already paid in count towards the balance.
 */
export const summariseBank = ({ earnings, entries, users, today }) => {
  const thisMonth = monthKey(today)
  const paidShares = earnings.filter((e) => e.paid_on)
  const moneyIn = entries.filter((e) => e.direction === 'in')
  const moneyOut = entries.filter((e) => e.direction === 'out')
  const sum = (list) => list.reduce((total, item) => total + item.amount, 0)

  const balance = cents(paidShares.reduce((t, e) => t + e.share, 0) + sum(moneyIn) - sum(moneyOut))
  const toPay = cents(earnings.filter((e) => !e.paid_on).reduce((t, e) => t + e.share, 0))

  const inMonth = (day) => day && monthKey(day) === thisMonth
  const monthIn = cents(paidShares.filter((e) => inMonth(e.paid_on)).reduce((t, e) => t + e.share, 0) + sum(moneyIn.filter((e) => inMonth(e.entry_date))))
  const monthOut = cents(sum(moneyOut.filter((e) => inMonth(e.entry_date))))

  // Each month that has an earning, newest first, with every founder listed.
  const months = new Map()
  for (const e of earnings) {
    const key = monthKey(e.received_on)
    if (!months.has(key)) months.set(key, new Map(users.map((u) => [u.id, { name: u.name, earned: 0, share: 0 }])))
    const person = months.get(key).get(e.user_id) ?? { name: '', earned: 0, share: 0 }
    person.earned = cents(person.earned + e.amount)
    person.share = cents(person.share + e.share)
    months.get(key).set(e.user_id, person)
  }
  const byMonth = [...months.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, people]) => {
      const list = [...people.values()]
      return { key, label: formatMonth(key), people: list, toCompany: cents(list.reduce((t, p) => t + p.share, 0)) }
    })

  const current = byMonth.find((m) => m.key === thisMonth) ?? {
    key: thisMonth,
    label: formatMonth(thisMonth),
    people: users.map((u) => ({ name: u.name, earned: 0, share: 0 })),
    toCompany: 0,
  }

  return { balance, toPay, monthIn, monthOut, byMonth, thisMonth: current }
}
