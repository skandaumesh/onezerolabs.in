/**
 * PDF renderer — black-and-white legal letterhead.
 *
 * Produces a pdfmake document definition: plain JSON with no library imports,
 * so this module runs unchanged in Node and in the browser. The caller supplies
 * the engine and, optionally, the letterhead logo as a data URI:
 *   Node    -> pdfmake.setFonts(...); pdfmake.createPdf(def).getBuffer()
 *   Browser -> pdfMake.createPdf(def).download()
 *
 * Layout parity with the DOCX renderer comes from three things:
 *  - the same branding config (margins, sizes, rules)
 *  - the same content + table modules
 *  - Times, which is metrically identical to Word's Times New Roman
 */

import { brand } from '../config/branding.mjs'
import { resolveSections } from '../content/sections.mjs'
import { tableForBlock, buildInfoTable, buildControlTable, buildSignatureData } from '../content/tables.mjs'
import { ph } from '../config/schema.mjs'
import { titleCase } from '../util.mjs'

const C = brand.colors
const T = brand.type
const S = brand.spacing
const P = brand.page

/** '000000' -> '#000000' */
const hex = (c) => (c.startsWith('#') ? c : `#${c}`)

/** A4 width in points minus horizontal margins — the usable text block. */
export const CONTENT_WIDTH = 595.28 - P.marginLeft - P.marginRight

/** Cell padding and border width used by tableLayout(), per side. */
const CELL_PAD = 6
const CELL_BORDER = 0.5

/**
 * Percentage column widths -> absolute points.
 *
 * pdfmake treats `widths` as CONTENT width and adds cell padding and vertical
 * borders on top, so declaring widths that sum to the full text block makes the
 * table wider than the page allows. Subtract that chrome first, then distribute.
 */
const widthsToPoints = (widths, count) => {
  const w = widths || Array(count).fill(100 / count)
  const chrome = count * CELL_PAD * 2 + (count + 1) * CELL_BORDER
  const usable = CONTENT_WIDTH - chrome
  return w.map((p) => (p / 100) * usable)
}

const alignOf = (a) => (a === 'r' ? 'right' : a === 'c' ? 'center' : 'left')

/** brand.layout with any per-document overrides applied. */
const layoutFor = (d) => ({ ...brand.layout, ...(d.layout || {}) })

/**
 * pdfmake 0.3 overshoots the available width by ~2.9pt when alignment is
 * 'justify' — measured, and reproducible with plain justified text outside any
 * column. Left/centre alignment and tables are unaffected. A small right inset
 * on justified nodes pulls the last glyph back inside the text block.
 */
const JUSTIFY_INSET = 4

/** Full-width horizontal rule. */
const hr = (width = 1, top = 0, bottom = 0) => ({
  canvas: [{ type: 'line', x1: 0, y1: 0, x2: CONTENT_WIDTH, y2: 0, lineWidth: width, lineColor: hex(C.rule) }],
  margin: [0, top, 0, bottom],
})

/** Table layout: hairline grid, light grey header, no colour. */
const tableLayout = (spec) => ({
  hLineWidth: () => CELL_BORDER,
  vLineWidth: () => CELL_BORDER,
  hLineColor: () => hex(C.ruleLight),
  vLineColor: () => hex(C.ruleLight),
  paddingLeft: () => CELL_PAD,
  paddingRight: () => CELL_PAD,
  paddingTop: () => 4,
  paddingBottom: () => 4,
  fillColor: (rowIndex) => {
    const hasHead = spec.head?.some((h) => h !== '')
    if (hasHead && rowIndex === 0) return hex(C.tableHeadBg)
    const bodyIndex = hasHead ? rowIndex - 1 : rowIndex
    if (spec.totalRow && bodyIndex === spec.rows.length) return hex(C.panel)
    return null
  },
})

/** Build a pdfmake table node from a renderer-agnostic spec. */
const buildTable = (spec) => {
  if (!spec) return []
  const hasHead = spec.head?.some((h) => h !== '')
  const colCount = spec.head?.length || spec.rows[0]?.length || 1
  const body = []

  if (hasHead) {
    body.push(
      spec.head.map((h, i) => ({
        text: h,
        bold: true,
        color: hex(C.tableHeadText),
        fontSize: T.tableHead,
        alignment: alignOf(spec.align?.[i]),
      }))
    )
  }

  spec.rows.forEach((r) => {
    body.push(
      r.map((v, i) => ({
        text: String(v ?? ''),
        fontSize: T.tableBody,
        color: hex(C.ink),
        alignment: alignOf(spec.align?.[i]),
        bold: ['info', 'control', 'bank'].includes(spec.variant) && i === 0,
      }))
    )
  })

  if (spec.totalRow) {
    body.push(
      spec.totalRow.map((v, i) => ({
        text: String(v ?? ''),
        bold: true,
        color: hex(C.ink),
        fontSize: T.tableBody,
        alignment: alignOf(spec.align?.[i]),
      }))
    )
  }

  return [
    {
      table: {
        headerRows: hasHead ? 1 : 0, // repeats the header when a table spans pages
        dontBreakRows: true,         // never split a single row across pages
        widths: widthsToPoints(spec.widths, colCount),
        body,
      },
      layout: tableLayout(spec),
      margin: [0, 2, 0, S.paraAfter],
    },
  ]
}

// ---------------------------------------------------------------------------
// letterhead / header / footer
// ---------------------------------------------------------------------------

/**
 * createLetterhead() — logo, company name, tagline and registration lines,
 * closed by a heavy/light rule pair. Printed once, at the top of page 1.
 * `logoDataUrl` is optional; without it the block renders text-only.
 */
export const createLetterhead = (logoDataUrl) => {
  const L = brand.letterhead
  const textStack = {
    width: '*',
    stack: [
      { text: L.name, bold: true, fontSize: T.letterheadName, alignment: 'center', characterSpacing: 1 },
      { text: L.tagline, fontSize: T.letterheadTagline, italics: true, alignment: 'center', color: hex(C.ink), margin: [0, 4, 0, 0] },
      ...(L.services
        ? [{ text: L.services, fontSize: T.letterheadServices, alignment: 'center', color: hex(C.inkMuted), margin: [0, 4, 0, 1], characterSpacing: 0.6 }]
        : []),
      ...L.lines.map((line) => ({
        text: line,
        fontSize: T.letterheadLine,
        alignment: 'center',
        color: hex(C.inkMuted),
        margin: [0, 2, 0, 0],
      })),
    ],
  }

  // No balancing column on the right: with one, the text centres on the PAGE,
  // which left ~36pt of space beside the logo and ~124pt on the far right.
  // Centring it in the area BESIDE the logo is what reads as balanced.
  const columns = logoDataUrl
    ? [{ image: logoDataUrl, width: brand.logo.widthPt, margin: [0, 4, 0, 0] }, textStack]
    : [textStack]

  return [
    { columns, columnGap: 14, margin: [0, 0, 0, 9] },
    hr(2.4, 0, 2),
    hr(0.6, 0, 18),
  ]
}

/**
 * createHeader() — intentionally none.
 * The letterhead identifies the document on page 1; repeating a header band on
 * every page made the pages look like a form rather than a contract.
 */
export const createHeader = () => () => null

/** createFooter() — contact strip, and the page count only when enabled. */
export const createFooter = () => (currentPage, pageCount) => {
  const contact = {
    text: `${brand.contact.phone}   |   ${brand.contact.email}   |   ${brand.contact.web}`,
    fontSize: T.footer,
    color: hex(C.inkMuted),
  }

  const row = brand.layout.showPageNumbers
    ? {
        columns: [
          { ...contact, width: '*' },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            fontSize: T.footer,
            color: hex(C.inkMuted),
            alignment: 'right',
            width: 72,
          },
        ],
      }
    : { ...contact, alignment: 'center' }

  return {
    margin: [P.marginLeft, 10, P.marginRight, 0],
    stack: [
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: CONTENT_WIDTH, y2: 0, lineWidth: 0.5, lineColor: hex(C.rule) }],
      },
      { ...row, margin: [0, 4, 0, 0] },
    ],
  }
}

// ---------------------------------------------------------------------------
// title block
// ---------------------------------------------------------------------------

/** createTitlePage() — letterhead, document title, and the information table. */
export const createTitlePage = (d, logoDataUrl) => {
  const out = [
    ...createLetterhead(logoDataUrl),
    {
      text: ph(d.documentType, 'AGREEMENT_TITLE'),
      bold: true,
      fontSize: T.docTitle,
      alignment: 'center',
      lineHeight: 1.2,
      margin: [0, 0, 0, 16],
    },
  ]

  if (layoutFor(d).showInfoTable) out.push(...buildTable(buildInfoTable(d)))

  if (d.preamble) {
    out.push({
      text: d.preamble,
      fontSize: T.body,
      alignment: 'justify',
      lineHeight: S.lineHeight,
      margin: [0, 10, JUSTIFY_INSET, 4],
    })
  }
  return out
}

/** Unnumbered document-control appendix, rendered after the final section. */
export const createDocumentControl = (d) => {
  if (!layoutFor(d).showDocumentControl) return []
  return [
    {
      unbreakable: true, // this small table must never split across two pages
      margin: [0, 20, 0, 0],
      stack: [
        { text: 'Document Control', bold: true, fontSize: T.subHeading, margin: [0, 0, 0, 6] },
        ...buildTable(buildControlTable(d)),
      ],
    },
  ]
}

// ---------------------------------------------------------------------------
// sections
// ---------------------------------------------------------------------------

export const createSubsection = (text) => ({
  text,
  bold: true,
  fontSize: T.subHeading,
  margin: [0, 10, 0, 4],
})

export const createBulletList = (items) => [
  {
    ul: items.map((t) => ({ text: t, fontSize: T.body, color: hex(C.ink) })),
    margin: [8, 0, JUSTIFY_INSET, S.paraAfter],
    lineHeight: S.lineHeight,
  },
]

const createClauses = (items, no) =>
  items.map((t, i) => ({
    margin: [0, 0, JUSTIFY_INSET, 6],
    lineHeight: S.lineHeight,
    columns: [
      { text: `${no}.${i + 1}`, bold: true, fontSize: T.body, width: 26 },
      { text: t, fontSize: T.body, color: hex(C.ink), alignment: 'justify', width: '*' },
    ],
  }))

/**
 * createSignatureBlock() — a borderless two-column table, ONE ROW PER LINE.
 *
 * Rows share a height across both columns. Built as two independent stacks, a
 * party name that wraps ("FOR MLA ACADEMY OF HIGHER LEARNING") pushed only its
 * own column down, so the Signature / Date / Seal lines stopped lining up with
 * the other party's. Unbreakable, so the block never splits across pages.
 */
export const createSignatureBlock = (d) => {
  const [a, b] = buildSignatureData(d)
  const labelled = (label, value) => ({ text: [{ text: label, bold: true }, value], fontSize: T.body })
  const plain = (text) => ({ text, fontSize: T.body })
  const row = (left, right, top = 0) => [
    { ...left, margin: [0, top, 12, 0] },
    { ...right, margin: [12, top, 0, 0] },
  ]

  const body = [
    row({ text: a.heading, bold: true, fontSize: T.subHeading }, { text: b.heading, bold: true, fontSize: T.subHeading }),
    row(labelled('Name: ', a.name), labelled('Name: ', b.name), 6),
    row(labelled('Designation: ', a.designation), labelled('Designation: ', b.designation), 2),
    row(plain('Signature: __________________________'), plain('Signature: __________________________'), 18),
    row(plain('Date: _______________________________'), plain('Date: _______________________________'), 16),
    row(plain('Company Seal: ______________________'), plain('Company Seal: ______________________'), 16),
  ]

  return [
    {
      unbreakable: true,
      margin: [0, 6, 0, 0],
      table: { widths: ['*', '*'], body, dontBreakRows: true },
      layout: 'noBorders',
    },
  ]
}

/** createSection() — one numbered section and its blocks. */
export const createSection = (section, no, d) => {
  const out = []
  const compact = layoutFor(d).compact
  const before = compact ? 10 : S.sectionBefore
  const after = compact ? 6 : S.sectionAfter

  if (section.pageBreakBefore) out.push({ text: '', pageBreak: 'before' })

  // `no === null` marks an unnumbered lead block (e.g. the parties recital),
  // which gets no rule and no clause number.
  if (no !== null) {
    // A rule above every section heading, as on a printed letterhead contract.
    out.push({ ...hr(0.5, before, 0), headlineLevel: 1 })
    out.push({
      text: `${no}.  ${titleCase(section.title)}`,
      bold: true,
      fontSize: T.sectionHeading,
      margin: [0, compact ? 6 : 8, 0, after],
      headlineLevel: 1,
    })
  } else if (section.title) {
    out.push({
      text: titleCase(section.title),
      bold: true,
      fontSize: T.subHeading,
      margin: [0, 10, 0, 6],
    })
  }

  for (const b of section.blocks || []) {
    switch (b.t) {
      case 'p':
        out.push({
          text: b.boldLead ? [{ text: b.boldLead, bold: true }, b.text] : b.text,
          fontSize: T.body,
          color: hex(C.ink),
          bold: !!b.bold && !b.boldLead,
          alignment: b.center ? 'center' : 'justify',
          lineHeight: S.lineHeight,
          margin: [0, 0, b.center ? 0 : JUSTIFY_INSET, S.paraAfter],
        })
        break
      case 'sub':
        out.push(createSubsection(b.text))
        break
      case 'bullets':
        out.push(...createBulletList(b.items || []))
        break
      case 'clauses':
        out.push(...createClauses(b.items || [], no))
        break
      case 'spacer':
        out.push({ text: '', margin: [0, 0, 0, b.h || 8] })
        break
      case 'signature':
        out.push(...createSignatureBlock(d))
        break
      default: {
        const spec = tableForBlock(b, d)
        if (spec) out.push(...buildTable(spec))
      }
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// document definition
// ---------------------------------------------------------------------------

/**
 * Build the pdfmake document definition.
 * `fontName` must match a key in the caller's font descriptor table.
 * `logoDataUrl` is an optional base64 data URI for the letterhead logo.
 */
export const buildPdfDefinition = (d, { fontName = brand.fonts.pdf, logoDataUrl = null } = {}) => {
  const sections = resolveSections(d)
  const content = [...createTitlePage(d, logoDataUrl)]
  // Only numbered sections advance the clause counter.
  let clause = 0
  sections.forEach((s) => {
    const no = s.unnumbered ? null : (clause += 1)
    content.push(...createSection(s, no, d))
  })
  content.push(...createDocumentControl(d))

  return {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [P.marginLeft, P.marginTop, P.marginRight, P.marginBottom],
    header: createHeader(),
    footer: createFooter(),
    content,
    defaultStyle: {
      font: fontName,
      fontSize: T.body,
      color: hex(C.ink),
      lineHeight: S.lineHeight,
    },
    info: {
      title: ph(d.documentType, 'AGREEMENT_TITLE'),
      author: brand.companyName,
      subject: `${brand.companyName} agreement`,
    },
    /**
     * Keep a section heading with the text that follows it, so a heading can
     * never sit alone at the foot of a page with its clauses overleaf.
     *
     * NOTE: pdfmake 0.3 does not pass `followingNodesOnPage` (it is undefined),
     * so the documented `followingNodesOnPage.length === 0` recipe silently
     * does nothing here. `startPosition.verticalRatio` is populated, so the
     * rule is expressed as a position threshold instead.
     */
    pageBreakBefore: (currentNode) =>
      currentNode.headlineLevel === 1 &&
      !!currentNode.startPosition &&
      currentNode.startPosition.verticalRatio > 0.82,
  }
}

export default buildPdfDefinition
