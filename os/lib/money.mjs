/** Money. Amounts are shown in Indian grouping (₹1,25,000) and paise only when there are some. */

const whole = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const exact = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })

export const formatINR = (amount) => (Number.isInteger(amount) ? whole : exact).format(amount)

/** Reads what someone typed, such as "₹1,25,000" or "1500.50". Null if it is not a usable amount. */
export const parseAmount = (value) => {
  if (typeof value !== 'string') return null
  const cleaned = value.replace(/[₹,\s]/g, '').replace(/^rs\.?/i, '')
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null
  const amount = Number(cleaned)
  return amount <= 9999999999.99 ? amount : null
}

/**
 * Totals for the Revenue page. Project values and money received are kept apart:
 * a job being worth something does not mean the money has arrived. `unrecorded`
 * counts the jobs nobody has entered a received figure for yet.
 */
export const summariseIncome = (items) => {
  const sum = (list, key = 'amount') => list.reduce((total, item) => total + (item[key] ?? 0), 0)
  const projects = items.filter((i) => i.kind === 'project')
  const oneOff = items.filter((i) => i.kind !== 'monthly')
  return {
    projectValue: sum(projects),
    monthly: sum(items.filter((i) => i.kind === 'monthly')),
    other: sum(items.filter((i) => i.kind === 'other')),
    received: sum(oneOff, 'received'),
    unrecorded: oneOff.filter((i) => i.received === null).length,
    clients: new Set(items.map((i) => i.company_id)).size,
  }
}

/** How much of a job has come in, as words and a status. Never colour alone. */
export const receivedStatus = ({ amount, received }) => {
  if (received === null) return { text: 'Not recorded', tone: 'plain' }
  if (received >= amount) return { text: 'Paid in full', tone: 'good' }
  if (received === 0) return { text: 'Nothing received', tone: 'late' }
  return { text: `${formatINR(amount - received)} to come`, tone: 'soon' }
}
