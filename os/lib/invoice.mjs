/**
 * Invoice arithmetic and wording. Plain functions with no framework imports, so
 * the form, the page, the PDF, the server actions and the tests all agree.
 */

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100

export const lineAmount = ({ quantity, rate }) => round2(quantity * rate)

export const subtotalOf = (items) => round2(items.reduce((sum, item) => sum + lineAmount(item), 0))

const sameText = (a, b) => (a ?? '').trim().toLowerCase() === (b ?? '').trim().toLowerCase()

/**
 * GST on top of a subtotal. Within one state it splits into CGST and SGST; across
 * states it is one IGST line. An unstated client state is treated as the same
 * state, the common case for a Karnataka business.
 */
export const invoiceTotals = (subtotal, gstRate, sellerState, clientState) => {
  const gst = round2((subtotal * gstRate) / 100)
  const intraState = !clientState?.trim() || sameText(sellerState, clientState)
  const cgst = intraState ? round2(gst / 2) : 0
  return {
    subtotal,
    gst,
    intraState,
    cgst,
    sgst: intraState ? round2(gst - cgst) : 0,
    igst: intraState ? 0 : gst,
    total: round2(subtotal + gst),
  }
}

/** Adds the total and what is still owed to a row from listInvoices. */
export const withBalance = (invoice, settings) => {
  const { total } = invoiceTotals(invoice.subtotal, invoice.gst_rate, invoice.seller?.state ?? settings.state, invoice.bill_to_state)
  return { ...invoice, total, balance: Math.round((total - invoice.paid) * 100) / 100 }
}

/** India's financial year runs April to March: 3 Nov 2026 is '26-27', 3 Feb 2027 too. */
export const financialYear = (day) => {
  const year = Number(day.slice(0, 4))
  const start = Number(day.slice(5, 7)) >= 4 ? year : year - 1
  return `${String(start).slice(2)}-${String(start + 1).slice(2)}`
}

/** OZL/26-27/001. GST rules cap an invoice number at 16 characters. */
export const invoiceNumber = (prefix, year, sequence) => `${prefix}/${year}/${String(sequence).padStart(3, '0')}`

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
  'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

const belowThousand = (n) => {
  const hundreds = Math.floor(n / 100)
  const rest = n % 100
  const parts = []
  if (hundreds) parts.push(`${ONES[hundreds]} Hundred`)
  if (rest) parts.push(rest < 20 ? ONES[rest] : [TENS[Math.floor(rest / 10)], ONES[rest % 10]].filter(Boolean).join(' '))
  return parts.join(' ')
}

/** 235000.5 -> 'Rupees Two Lakh Thirty Five Thousand and Fifty Paise Only', in Indian units. */
export const amountInWords = (amount) => {
  let rupees = Math.floor(amount + 1e-9)
  const paise = Math.round((amount - rupees) * 100)
  const parts = []
  for (const [size, name] of [[10000000, 'Crore'], [100000, 'Lakh'], [1000, 'Thousand']]) {
    const count = Math.floor(rupees / size)
    if (count) parts.push(`${count >= 1000 ? amountInWords(count).replace(/^Rupees | Only$/g, '') : belowThousand(count)} ${name}`)
    rupees %= size
  }
  if (rupees) parts.push(belowThousand(rupees))
  const words = parts.join(' ') || 'Zero'
  return `Rupees ${words}${paise ? ` and ${belowThousand(paise)} Paise` : ''} Only`
}

/** Where an invoice stands, in words. Overdue is worked out from today, not stored. */
export const invoiceState = ({ status, due_date: dueDate, paid, total }, today) => {
  if (status === 'draft') return { text: 'Draft', tone: 'plain' }
  if (status === 'cancelled') return { text: 'Cancelled', tone: 'plain' }
  if (status === 'paid') return { text: 'Paid', tone: 'good' }
  if (dueDate && dueDate < today) return { text: 'Overdue', tone: 'late' }
  if (paid > 0 && paid < total) return { text: 'Part paid', tone: 'soon' }
  return { text: 'Awaiting payment', tone: 'soon' }
}
