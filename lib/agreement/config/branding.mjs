/**
 * OneZeroLabs — Agreement template branding & style tokens.
 *
 * This is the ONLY place design decisions live. Changing a value here updates
 * both the .docx and the .pdf output, because both renderers read from it.
 *
 * DESIGN: a plain black-and-white legal letterhead. No brand colours in the
 * document body — printed contracts read better, photocopy cleanly, and look
 * more serious in monochrome. Greys are used only for rules and secondary text.
 *
 * FONTS: Times New Roman in Word, Times in the PDF. They are metrically
 * identical, so line breaks and page breaks land in the same place in both
 * exports — that is what makes "the PDF matches the Word file" literally true.
 *
 * CURRENCY: written as "Rs." rather than the ₹ glyph. The standard PDF fonts
 * are WinAnsi-encoded and have no U+20B9, so ₹ would need an embedded font,
 * which would force a non-serif face and break the metric match above.
 * "Rs." is standard usage in Indian contracts. To use ₹ instead, set
 * currencySymbol on the data and switch fonts.pdf to an embedded face.
 */

export const brand = {
  companyName: 'OneZeroLabs',
  documentKind: 'AGREEMENT',

  /** Letterhead printed at the top of page 1. Edit these for your details. */
  letterhead: {
    name: 'ONEZEROLABS',
    /** Strapline, set in italic under the company name. */
    tagline: 'We build it. We run it.',
    /** Service list, set in caps beneath the strapline. */
    services: 'SOFTWARE  ·  WEBSITES  ·  SOCIAL MEDIA',
    lines: [
      'BENGALURU, KARNATAKA 560091, INDIA',
      'UDYAM REG. NO: UDYAM-KR-03-0615981',
    ],
  },

  /** Contact strip printed in the footer of every page. */
  contact: {
    phone: '+91 74837 29869',
    email: 'HELLO@ONEZEROLABS.IN',
    web: 'WWW.ONEZEROLABS.IN',
  },

  colors: {
    ink: '000000',        // body text
    inkMuted: '444444',   // letterhead sub-lines, footer
    rule: '000000',       // section + letterhead rules
    ruleLight: 'AAAAAA',  // table grid
    tableHeadBg: 'EEEEEE',// light grey, not a colour
    tableHeadText: '000000',
    zebra: 'F7F7F7',
    panel: 'EFEFEF',
    white: 'FFFFFF',
  },

  fonts: {
    heading: 'Times New Roman',
    body: 'Times New Roman',
    /** Standard PDF font, metrically identical to Times New Roman. */
    pdf: 'Times',
  },

  /** Point sizes. The docx renderer doubles these (Word uses half-points). */
  type: {
    letterheadName: 30,
    letterheadTagline: 10.5,
    letterheadServices: 8.5,
    letterheadLine: 8.5,
    docTitle: 15,
    sectionHeading: 13.5,
    subHeading: 11.5,
    body: 11,
    tableBody: 10,
    tableHead: 10,
    small: 9,
    footer: 8,
  },

  spacing: {
    lineHeight: 1.3,
    paraAfter: 8,
    sectionBefore: 16,
    sectionAfter: 8,
  },

  /** A4 geometry. Points for PDF; the docx renderer converts to twips (x20). */
  page: {
    marginLeft: 62,
    marginRight: 62,
    marginTop: 68,
    marginBottom: 62,
    headerOffset: 30,
    footerOffset: 26,
  },

  /**
   * Letterhead logo. `path` is used by the Node CLI; the browser passes bytes.
   * logo-print.png is BLACK artwork — public/logo.png is white-on-transparent
   * and would be invisible on white paper.
   */
  logo: {
    path: 'public/logo-print.png',
    widthPt: 88,
    heightPt: 54,
  },

  layout: {
    /** Set either to false to drop that block from the document entirely. */
    showInfoTable: true,
    showDocumentControl: true,
    /** "Page X of Y" in the footer. Off: the contact strip runs full width. */
    showPageNumbers: false,
    /**
     * Tighter section rhythm. A proposal with many short sections spends a lot
     * of page on the gap-plus-rule before each heading; this reclaims it so the
     * document does not spill a few lines onto a near-empty final page.
     */
    compact: false,
  },
}

/** Points -> twips (Word's internal unit). */
export const pt = (n) => Math.round(n * 20)
/** Points -> half-points (Word font sizes). */
export const hp = (n) => Math.round(n * 2)

export default brand
