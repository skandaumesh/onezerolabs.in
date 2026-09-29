/**
 * Agreement data schema + placeholder resolution.
 *
 * Every field is optional. Anything left empty renders as a loud, greppable
 * placeholder token such as [CLIENT_NAME], so a blank template is simply the
 * default data object with nothing filled in.
 */

/** Returns the value, or an obvious placeholder token when it is empty. */
export const ph = (value, token) => {
  if (value === 0) return '0'
  if (value === null || value === undefined || value === '') return `[${token}]`
  return String(value)
}

/** True when the value is still an unfilled placeholder. */
export const isPlaceholder = (s) => typeof s === 'string' && /^\[[A-Z0-9_]+\]$/.test(s)

/**
 * The canonical shape. `createAgreementData(overrides)` deep-merges on top of
 * this, so callers only supply what they know.
 */
export const emptyAgreement = {
  // --- identification -----------------------------------------------------
  documentType: '',            // e.g. 'WEBSITE DEVELOPMENT & MAINTENANCE AGREEMENT'
  agreementNumber: '',
  agreementDate: '',
  effectiveDate: '',
  contractDuration: '',

  // --- service provider (defaults to OneZeroLabs) -------------------------
  provider: {
    legalName: 'OneZeroLabs',
    address: '',
    email: '',
    phone: '',
    gstin: '',
    representative: { name: '', designation: '' },
  },

  // --- client -------------------------------------------------------------
  client: {
    name: '',
    legalEntity: '',
    address: '',
    email: '',
    phone: '',
    gstin: '',
    representative: { name: '', designation: '' },
  },

  // --- engagement ---------------------------------------------------------
  projectName: '',
  purpose: '',
  /** Optional lead paragraph, printed between the title and section 1. */
  preamble: '',
  /** Override the two signature-block headings, e.g. ['FOR ONEZEROLABS', 'EMPLOYEE']. */
  signatureHeadings: null,

  /**
   * Per-document layout overrides, merged over brand.layout.
   * e.g. { showInfoTable: false } for a short mutual MoU.
   */
  layout: null,

  /**
   * Supply a complete section list to REPLACE the 30 built-in sections.
   * Leave null to use the defaults. sectionOverrides still applies either way.
   */
  sections: null,

  /** [{ service, description, timeline, status }] */
  deliverables: [],

  /** [{ item, description, amount }] — amounts are numbers or strings */
  fees: [],

  commercials: {
    currency: 'INR',
    currencySymbol: '\u20B9',
    taxNote: '',
    advancePercent: '',
    milestones: [],            // [{ milestone, trigger, percent }]
    recurringFee: '',
    recurringCycle: '',
    latePaymentTerms: '',
    paymentMethod: '',
    bankDetails: {             // omitted from output when all fields are empty
      accountName: '',
      accountNumber: '',
      bankName: '',
      branch: '',
      ifsc: '',
    },
  },

  paymentTerms: '',
  governingLaw: '',
  jurisdiction: '',
  noticePeriodDays: '',
  supportWindow: '',
  revisionRounds: '',

  // --- document control ---------------------------------------------------
  control: {
    documentId: '',
    version: '',
    status: '',                // DRAFT | FINAL
    lastUpdated: '',
    preparedBy: '',
    approvedBy: '',
  },

  /**
   * Section overrides. Keys are section ids from content/sections.mjs.
   *   { include: false }              -> drop the section entirely
   *   { title: 'CUSTOM TITLE' }       -> rename it
   *   { blocks: [...] }               -> replace its body outright
   *   { extraBlocks: [...] }          -> append to its body
   * See docs/AGREEMENT_TEMPLATE.md for the block vocabulary.
   */
  sectionOverrides: {},

  /** Extra sections appended before the signature block. */
  extraSections: [],
}

const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v)

const deepMerge = (base, patch) => {
  const out = Array.isArray(base) ? [...base] : { ...base }
  for (const [k, v] of Object.entries(patch || {})) {
    out[k] = isPlainObject(v) && isPlainObject(base?.[k]) ? deepMerge(base[k], v) : v
  }
  return out
}

/** Build a complete data object from partial input. */
export const createAgreementData = (overrides = {}) =>
  deepMerge(emptyAgreement, overrides)

export default createAgreementData
