/**
 * Table specifications, derived from agreement data.
 *
 * Each builder returns a renderer-agnostic spec:
 *   { head: [string], rows: [[string]], widths: [percent], align: [l|r|c], variant }
 *
 * Both the docx and pdf renderers consume these, which is what keeps the two
 * exports visually identical. `widths` are percentages of the content width and
 * must total 100 so nothing overflows the A4 text block.
 */

import { ph } from '../config/schema.mjs'

const pad2 = (n) => String(n).padStart(2, '0')

/** Format a number as Indian-grouped currency (1,23,456). Strings pass through. */
export const formatAmount = (value, symbol = 'Rs. ') => {
  if (value === null || value === undefined || value === '') return `${symbol}[AMOUNT]`
  if (typeof value === 'string' && !/^\d+(\.\d+)?$/.test(value.trim())) return value
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)
  const [whole, frac] = n.toFixed(2).split('.')
  const last3 = whole.slice(-3)
  const rest = whole.slice(0, -3)
  const grouped = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3
  return `${symbol}${grouped}${frac === '00' ? '' : '.' + frac}`
}

/** Cover / summary block: the agreement-information table. */
export const buildInfoTable = (d) => ({
  variant: 'info',
  head: ['Field', 'Details'],
  widths: [34, 66],
  align: ['l', 'l'],
  rows: [
    ['Agreement Number', ph(d.agreementNumber, 'AGREEMENT_NUMBER')],
    ['Agreement Date', ph(d.agreementDate, 'AGREEMENT_DATE')],
    ['Effective Date', ph(d.effectiveDate, 'EFFECTIVE_DATE')],
    ['Service Provider', d.provider.legalName || 'OneZeroLabs'],
    ['Client', ph(d.client.name, 'CLIENT_NAME')],
    ['Client Entity', ph(d.client.legalEntity, 'CLIENT_LEGAL_ENTITY')],
    ['Project / Service', ph(d.projectName, 'PROJECT_NAME')],
    ['Contract Period', ph(d.contractDuration, 'CONTRACT_DURATION')],
  ],
})

/** Scope-of-services table. Falls back to two placeholder rows when empty. */
export const buildDeliverablesTable = (d) => {
  const list = d.deliverables?.length
    ? d.deliverables
    : [
        { service: '[SERVICE]', description: '[SERVICE_DESCRIPTION]', timeline: '[DATE]', status: '[STATUS]' },
        { service: '[SERVICE]', description: '[SERVICE_DESCRIPTION]', timeline: '[DATE]', status: '[STATUS]' },
      ]
  return {
    variant: 'deliverables',
    head: ['No.', 'Service / Deliverable', 'Description', 'Timeline', 'Status'],
    widths: [7, 22, 41, 16, 14],
    align: ['c', 'l', 'l', 'l', 'c'],
    rows: list.map((r, i) => [
      pad2(i + 1),
      ph(r.service, 'SERVICE'),
      ph(r.description, 'SERVICE_DESCRIPTION'),
      ph(r.timeline, 'DATE'),
      ph(r.status, 'STATUS'),
    ]),
  }
}

/** Commercial table with a bold TOTAL row. */
export const buildPricingTable = (d) => {
  const sym = d.commercials.currencySymbol || 'Rs. '
  const list = d.fees?.length
    ? d.fees
    : [
        { item: '[SERVICE]', description: '[SERVICE_DESCRIPTION]', amount: '' },
        { item: '[SERVICE]', description: '[SERVICE_DESCRIPTION]', amount: '' },
      ]

  const numeric = list
    .map((r) => Number(r.amount))
    .filter((n) => !Number.isNaN(n) && n !== 0)
  const total =
    numeric.length === list.length && numeric.length > 0
      ? formatAmount(numeric.reduce((a, b) => a + b, 0), sym)
      : `${sym}[TOTAL_AMOUNT]`

  return {
    variant: 'pricing',
    head: ['Item', 'Description', 'Amount'],
    widths: [26, 50, 24],
    align: ['l', 'l', 'r'],
    rows: list.map((r) => [
      ph(r.item, 'SERVICE'),
      ph(r.description, 'SERVICE_DESCRIPTION'),
      formatAmount(r.amount, sym),
    ]),
    totalRow: ['TOTAL', '', total],
  }
}

/** Milestone payment schedule. */
export const buildMilestoneTable = (d) => {
  const list = d.commercials.milestones?.length
    ? d.commercials.milestones
    : [
        { milestone: 'Advance', trigger: 'On signing of this Agreement', percent: ph(d.commercials.advancePercent, 'ADVANCE_PERCENT') },
        { milestone: '[MILESTONE]', trigger: '[TRIGGER_EVENT]', percent: '[PERCENT]' },
        { milestone: 'Final', trigger: 'On final delivery and acceptance', percent: '[PERCENT]' },
      ]
  return {
    variant: 'milestones',
    head: ['Milestone', 'Trigger Event', 'Share of Total'],
    widths: [26, 52, 22],
    align: ['l', 'l', 'r'],
    rows: list.map((r) => [
      ph(r.milestone, 'MILESTONE'),
      ph(r.trigger, 'TRIGGER_EVENT'),
      String(ph(r.percent, 'PERCENT')).replace(/%*$/, '') + '%',
    ]),
  }
}

/** Bank details. Returns null when the caller has supplied none. */
export const buildBankTable = (d) => {
  const b = d.commercials.bankDetails || {}
  const anyFilled = Object.values(b).some((v) => v !== '' && v !== null && v !== undefined)
  if (!anyFilled) return null
  return {
    variant: 'bank',
    head: ['Bank Detail', 'Value'],
    widths: [34, 66],
    align: ['l', 'l'],
    rows: [
      ['Account Name', ph(b.accountName, 'ACCOUNT_NAME')],
      ['Account Number', ph(b.accountNumber, 'ACCOUNT_NUMBER')],
      ['Bank', ph(b.bankName, 'BANK_NAME')],
      ['Branch', ph(b.branch, 'BRANCH')],
      ['IFSC', ph(b.ifsc, 'IFSC')],
    ],
  }
}

/** Document-control table. */
export const buildControlTable = (d) => ({
  variant: 'control',
  head: ['Document Control', 'Value'],
  widths: [34, 66],
  align: ['l', 'l'],
  rows: [
    ['Document ID', ph(d.control.documentId, 'DOCUMENT_ID')],
    ['Version', ph(d.control.version, 'VERSION')],
    ['Status', ph(d.control.status, 'STATUS')],
    ['Effective Date', ph(d.effectiveDate, 'EFFECTIVE_DATE')],
    ['Last Updated', ph(d.control.lastUpdated, 'LAST_UPDATED')],
    ['Prepared By', ph(d.control.preparedBy, 'PREPARED_BY')],
    ['Approved By', ph(d.control.approvedBy, 'APPROVED_BY')],
  ],
})

/**
 * Signature block content for both parties.
 * `data.signatureHeadings` overrides the default "FOR <NAME>" headings — an
 * individual signing in person reads better as "EMPLOYEE" than "FOR ARVIND".
 */
export const buildSignatureData = (d) => {
  const [left, right] = d.signatureHeadings || []
  return [
    {
      heading: left || `FOR ${(d.provider.legalName || 'OneZeroLabs').toUpperCase()}`,
      name: ph(d.provider.representative.name, 'PROVIDER_REP_NAME'),
      designation: ph(d.provider.representative.designation, 'PROVIDER_REP_DESIGNATION'),
    },
    {
      heading: right || `FOR ${String(ph(d.client.name, 'CLIENT_NAME')).toUpperCase()}`,
      name: ph(d.client.representative.name, 'CLIENT_REP_NAME'),
      designation: ph(d.client.representative.designation, 'CLIENT_REP_DESIGNATION'),
    },
  ]
}

/** Resolve a content block that refers to a data-driven table. */
export const tableForBlock = (block, d) => {
  switch (block.t) {
    case 'deliverables': return buildDeliverablesTable(d)
    case 'pricing': return buildPricingTable(d)
    case 'milestones': return buildMilestoneTable(d)
    case 'bank': return buildBankTable(d)
    case 'control': return buildControlTable(d)
    case 'info': return buildInfoTable(d)
    case 'table': return {
      variant: 'generic',
      head: block.head || [],
      rows: block.rows || [],
      widths: block.widths || null,
      align: block.align || null,
    }
    default: return null
  }
}
