/**
 * Goals for a day, a week, a month or a year. A period is named by the date it
 * starts on: the day itself, the Monday of the week, the 1st of the month, or
 * 1 January. Dates stay 'YYYY-MM-DD' strings, as everywhere else in the app.
 */

import { addDays, formatDay } from './dates.mjs'

export const GOAL_PERIODS = [
  { value: 'day', label: 'Daily', noun: 'day', current: 'Today', previous: 'Yesterday', next: 'Tomorrow' },
  { value: 'week', label: 'Weekly', noun: 'week', current: 'This week', previous: 'Last week', next: 'Next week' },
  { value: 'month', label: 'Monthly', noun: 'month', current: 'This month', previous: 'Last month', next: 'Next month' },
  { value: 'year', label: 'Yearly', noun: 'year', current: 'This year', previous: 'Last year', next: 'Next year' },
]
export const PERIOD = Object.fromEntries(GOAL_PERIODS.map((p) => [p.value, p]))

const toUTC = (day) => new Date(`${day}T00:00:00Z`)
const pad = (n) => String(n).padStart(2, '0')

/** The start of the period that `day` falls in. */
export const periodStart = (period, day) => {
  if (period === 'week') return addDays(day, -((toUTC(day).getUTCDay() + 6) % 7))
  if (period === 'month') return `${day.slice(0, 7)}-01`
  if (period === 'year') return `${day.slice(0, 4)}-01-01`
  return day
}

/** The start of the period `n` periods after (or before) the one starting on `start`. */
export const shiftPeriod = (period, start, n) => {
  if (period === 'day') return addDays(start, n)
  if (period === 'week') return addDays(start, 7 * n)
  const [year, month] = start.split('-').map(Number)
  if (period === 'year') return `${year + n}-01-01`
  const months = year * 12 + (month - 1) + n
  return `${Math.floor(months / 12)}-${pad((months % 12) + 1)}-01`
}

export const periodEnd = (period, start) => addDays(shiftPeriod(period, start, 1), -1)

const long = (day, options) => new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...options }).format(toUTC(day))

/**
 * How a period reads: "Today" or "Last week" near now, otherwise its dates.
 * `detail` spells out the dates the name covers.
 */
export const periodLabel = (period, start, today) => {
  const now = periodStart(period, today)
  const names = PERIOD[period]
  const end = periodEnd(period, start)
  const detail =
    period === 'day'
      ? long(start, { weekday: 'long', day: 'numeric', month: 'long' })
      : period === 'week'
        ? start.slice(0, 7) === end.slice(0, 7)
          ? `${Number(start.slice(8))} – ${long(end, { day: 'numeric', month: 'long' })}`
          : `${long(start, { day: 'numeric', month: 'short' })} – ${long(end, { day: 'numeric', month: 'short' })}`
        : period === 'month'
          ? long(start, { month: 'long', year: 'numeric' })
          : start.slice(0, 4)

  let name
  if (start === now) name = names.current
  else if (start === shiftPeriod(period, now, -1)) name = names.previous
  else if (start === shiftPeriod(period, now, 1)) name = names.next
  else if (period === 'day') name = formatDay(start, today)
  else if (period === 'week') name = `Week of ${formatDay(start, today)}`
  else name = detail
  return { name, detail: name === detail ? null : detail }
}

/** Where a goal stands in one period. With a target it is done once the target is reached. */
export const goalState = ({ target, value = 0, done = false }) => {
  if (!target) return { done: Boolean(done), percent: done ? 100 : 0 }
  const percent = Math.min(100, Math.round((value / target) * 100))
  return { done: value >= target, percent }
}

/** "6 of 20 calls", or "₹40,000 of ₹1,00,000" style when the unit is a currency sign. */
export const progressText = ({ target, value = 0, unit }) => {
  if (!target) return null
  const n = (x) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(x)
  if (unit === '₹') return `₹${n(value)} of ₹${n(target)}`
  return `${n(value)} of ${n(target)}${unit ? ` ${unit}` : ''}`
}

/** Small targets go up a tap at a time; big ones, such as money, are typed in. */
export const countsByTaps = (target) => Boolean(target) && target <= 100
