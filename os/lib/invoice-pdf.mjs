/**
 * The invoice as a PDF. A clean sans-serif with a real rupee sign, laid out to use
 * the whole A4 page: details at the top, the lines filling the middle, totals
 * below them and how to pay anchored to the foot.
 */

import path from 'node:path'
import { amountInWords, invoiceTotals, lineAmount } from './invoice.mjs'

const INK = '#1D1D1F'
const MUTED = '#6E6E73'
const LINE = '#D9D9DE'
const BAND = '#F5F5F7'

const PAGE = { width: 595.28, height: 841.89 }
const SIDE = 44
const TOP = 42
const BOTTOM = 34 // clear space under the anchored how-to-pay block
const FLOWING_FOOT = 40
const WIDTH = PAGE.width - SIDE * 2
const COLUMNS = ['*', 40, 86, 96]

const FONT_DIR = ['node_modules', 'pdfmake', 'fonts', 'Roboto']

/** Roboto ships with pdfmake and includes ₹. Absolute paths, so it works from any folder. */
export const pdfFonts = (root = process.cwd()) => {
  const file = (name) => path.join(root, ...FONT_DIR, `Roboto-${name}.ttf`)
  return {
    Roboto: { normal: file('Regular'), bold: file('Medium'), italics: file('Italic'), bolditalics: file('MediumItalic') },
  }
}

const money = (amount) =>
  `₹${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`

const dateText = (value) =>
  value
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
    : '—'

const label = (text, extra = {}) => ({ text: text.toUpperCase(), fontSize: 7.5, bold: true, color: MUTED, characterSpacing: 0.6, ...extra })

const rule = (color = LINE, weight = 0.75, after = 0) => ({
  canvas: [{ type: 'line', x1: 0, y1: 0, x2: WIDTH, y2: 0, lineWidth: weight, lineColor: color }],
  margin: [0, 0, 0, after],
})

const fact = (title, value) => ({
  stack: [label(title), { text: value, fontSize: 10.5, bold: true, margin: [0, 3, 0, 0] }],
})

/**
 * `stretch` is the extra height given to the lines area. `anchorFoot` pins how to pay
 * to the bottom of a one-page invoice; a longer one lets it follow the content, so
 * the pages before it are not left with an empty foot. `onPages` reports the length.
 */
export const buildInvoicePdf = ({ invoice, items, settings, logo, stretch = 0, anchorFoot = true, onPages }) => {
  const seller = invoice.seller ?? settings
  const totals = invoiceTotals(invoice.subtotal, invoice.gst_rate, seller.state, invoice.bill_to_state)
  const isDraft = invoice.status === 'draft'
  const half = invoice.gst_rate / 2
  const title = seller.gstin ? 'TAX INVOICE' : 'INVOICE'

  const taxRows = [
    ...(totals.cgst > 0 ? [[`CGST ${half}%`, money(totals.cgst)], [`SGST ${half}%`, money(totals.sgst)]] : []),
    ...(totals.igst > 0 ? [[`IGST ${invoice.gst_rate}%`, money(totals.igst)]] : []),
  ]
  const billTo = [invoice.bill_to_address, invoice.bill_to_state, invoice.bill_to_gstin && `GSTIN ${invoice.bill_to_gstin}`].filter(Boolean)
  const from = [seller.address, seller.email, seller.phone, seller.gstin && `GSTIN ${seller.gstin}`, seller.udyam && `Udyam ${seller.udyam}`].filter(Boolean)
  const bank = [
    ['Bank', seller.bank_name],
    ['Account name', seller.account_name],
    ['Account number', seller.account_number],
    ['IFSC', seller.ifsc],
    ['UPI', seller.upi_id],
  ].filter(([, value]) => value)

  const fillerRow = items.length + 1
  // The block's own height, so the page's bottom margin fits it snugly.
  const foot = BOTTOM + 36 + Math.max(bank.length, 3) * 15

  const howToPay = [
    rule(LINE, 0.75, 12),
    {
      columns: [
        bank.length
          ? {
              width: '*',
              stack: [
                label('How to pay', { margin: [0, 0, 0, 6] }),
                ...bank.map(([name, value]) => ({
                  columns: [
                    { text: name, width: 92, color: MUTED, fontSize: 9.5 },
                    { text: value, width: '*', fontSize: 9.5, bold: true },
                  ],
                  margin: [0, 0, 0, 2.5],
                })),
              ],
            }
          : { width: '*', text: '' },
        {
          width: 200,
          stack: [
            label('Terms', { margin: [0, 0, 0, 6] }),
            { text: seller.invoice_terms || 'Payment is due by the date shown above.', fontSize: 9.5, color: MUTED },
            { text: 'Computer-generated invoice. No signature needed.', fontSize: 8.5, color: MUTED, margin: [0, 8, 0, 0] },
          ],
        },
      ],
      columnGap: 24,
    },
  ]

  return {
    pageSize: 'A4',
    pageMargins: [SIDE, TOP, SIDE, anchorFoot ? foot : FLOWING_FOOT],
    info: { title: invoice.number ?? 'Draft invoice', author: seller.legal_name },
    defaultStyle: { font: 'Roboto', fontSize: 10, lineHeight: 1.22, color: INK },
    ...(isDraft ? { watermark: { text: 'DRAFT', font: 'Roboto', bold: true, opacity: 0.06, angle: -45 } } : {}),

    // How to pay, anchored to the foot of the page.
    footer: (currentPage, pageCount) => {
      onPages?.(pageCount)
      return anchorFoot ? { margin: [SIDE, 0, SIDE, 0], stack: howToPay } : null
    },

    content: [
      // Brand on the left, what this document is on the right.
      {
        columns: [
          {
            width: '*',
            columns: [
              ...(logo ? [{ image: logo, width: 56 }] : []),
              {
                width: '*',
                margin: logo ? [10, 7, 0, 0] : [0, 7, 0, 0],
                stack: [
                  { text: seller.legal_name, bold: true, fontSize: 15 },
                  { text: 'We build it. We run it.', fontSize: 9, color: MUTED, margin: [0, 1, 0, 0] },
                ],
              },
            ],
          },
          {
            width: 210,
            alignment: 'right',
            stack: [
              { text: title, bold: true, fontSize: seller.gstin ? 24 : 30, characterSpacing: 0.4 },
              { text: invoice.number ?? 'Draft', fontSize: 11, color: MUTED, margin: [0, 2, 0, 0] },
            ],
          },
        ],
        margin: [0, 0, 0, 16],
      },
      rule(INK, 1.5, 16),

      {
        columns: [
          fact('Invoice date', dateText(invoice.issue_date)),
          fact('Due date', dateText(invoice.due_date)),
          fact('Amount due', money(Math.max(0, totals.total - (invoice.paid ?? 0)))),
        ],
        columnGap: 16,
        margin: [0, 0, 0, 16],
      },
      rule(LINE, 0.75, 16),

      {
        columns: [
          {
            width: '*',
            stack: [
              label('Billed to', { margin: [0, 0, 0, 5] }),
              { text: invoice.bill_to_name, bold: true, fontSize: 12, margin: [0, 0, 0, 2] },
              ...billTo.map((line) => ({ text: line, fontSize: 9.5, color: MUTED })),
            ],
          },
          {
            width: '*',
            stack: [
              label('From', { margin: [0, 0, 0, 5] }),
              { text: seller.legal_name, bold: true, fontSize: 12, margin: [0, 0, 0, 2] },
              ...from.map((line) => ({ text: line, fontSize: 9.5, color: MUTED })),
            ],
          },
        ],
        columnGap: 24,
        margin: [0, 0, 0, 20],
      },

      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: COLUMNS,
          heights: (row) => (row === fillerRow ? stretch : undefined),
          body: [
            [
              label('Description', { fillColor: BAND }),
              label('Qty', { fillColor: BAND, alignment: 'right' }),
              label('Rate', { fillColor: BAND, alignment: 'right' }),
              label('Amount', { fillColor: BAND, alignment: 'right' }),
            ],
            ...items.map((item) => [
              { text: item.description, fontSize: 10.5 },
              { text: String(item.quantity), alignment: 'right' },
              { text: money(item.rate), alignment: 'right' },
              { text: money(lineAmount(item)), alignment: 'right', bold: true },
            ]),
            ['', '', '', ''],
          ],
        },
        layout: {
          // Rows are divided, the stretch below them is left open, and a firm line closes it.
          hLineWidth: (i, node) => (i === 0 || i === fillerRow ? 0 : i === node.table.body.length ? 1 : 0.5),
          hLineColor: (i, node) => (i === node.table.body.length ? INK : LINE),
          vLineWidth: () => 0,
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: (i) => (i === 0 ? 7 : 8),
          paddingBottom: (i) => (i === 0 ? 7 : 8),
        },
        margin: [0, 0, 0, 12],
      },

      {
        columns: [
          {
            width: '*',
            stack: [
              label('Amount in words', { margin: [0, 2, 0, 4] }),
              { text: amountInWords(totals.total), fontSize: 9.5 },
              ...(invoice.notes ? [{ text: invoice.notes, fontSize: 9.5, color: MUTED, margin: [0, 8, 0, 0] }] : []),
            ],
          },
          {
            width: 210,
            stack: [
              {
                table: {
                  widths: ['*', 'auto'],
                  body: [
                    ['Subtotal', { text: money(totals.subtotal), alignment: 'right' }],
                    ...taxRows.map(([name, value]) => [name, { text: value, alignment: 'right' }]),
                  ],
                },
                layout: {
                  hLineWidth: () => 0,
                  vLineWidth: () => 0,
                  paddingLeft: () => 8,
                  paddingRight: () => 8,
                  paddingTop: () => 3,
                  paddingBottom: () => 3,
                },
                margin: [0, 0, 0, 6],
              },
              {
                // One cell holding two columns: two filled cells side by side show a seam.
                table: {
                  widths: ['*'],
                  body: [
                    [
                      {
                        fillColor: INK,
                        columns: [
                          { text: 'Total', bold: true, color: '#FFFFFF', fontSize: 11, width: 'auto', margin: [0, 2.5, 0, 0] },
                          { text: money(totals.total), bold: true, color: '#FFFFFF', fontSize: 14, alignment: 'right', width: '*' },
                        ],
                      },
                    ],
                  ],
                },
                layout: {
                  hLineWidth: () => 0,
                  vLineWidth: () => 0,
                  paddingLeft: () => 10,
                  paddingRight: () => 10,
                  paddingTop: () => 8,
                  paddingBottom: () => 8,
                },
              },
            ],
          },
        ],
        columnGap: 20,
      },
      ...(anchorFoot ? [] : [{ stack: howToPay, margin: [0, 20, 0, 0], unbreakable: true }]),
    ],
  }
}

const END_MARKER = 'invoice-end'

/**
 * Renders the PDF. A short invoice is stretched to fill its page: one pass measures
 * where the content ends, and the next adds exactly the space left. Anything that
 * cannot fit on one page simply flows on, with how to pay following the content.
 */
export const renderInvoicePdf = async (pdfmake, input) => {
  const attempt = async (options, measure) => {
    let pages = 1
    const definition = buildInvoicePdf({ ...input, ...options, onPages: (n) => (pages = n) })
    let end = null
    if (measure) {
      definition.content.push({ text: ' ', id: END_MARKER, fontSize: 1, lineHeight: 1 })
      definition.pageBreakBefore = (node) => {
        if (node.id === END_MARKER) end = node.startPosition
        return false
      }
    }
    const buffer = await pdfmake.createPdf(definition).getBuffer()
    return { pages, buffer, end }
  }

  const flat = await attempt({ stretch: 0 }, true)
  if (flat.pages > 1 || flat.end?.pageNumber > 1) return (await attempt({ anchorFoot: false })).buffer
  if (!flat.end) return flat.buffer

  // Bottom of the writable area, less a little so rounding cannot tip it onto a new page.
  let stretch = Math.max(0, TOP + flat.end.pageInnerHeight - flat.end.top - 6)
  for (let tries = 0; tries < 4; tries++) {
    const result = await attempt({ stretch })
    if (result.pages === 1) return result.buffer
    stretch = Math.max(0, stretch - 10)
  }
  return flat.buffer
}
