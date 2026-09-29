/**
 * DOCX renderer.
 *
 * Builds a `docx` Document from agreement data. Isomorphic: it only constructs
 * objects, so it runs in Node and in the browser. Callers turn the returned
 * Document into bytes with `Packer.toBuffer` (Node) or `Packer.toBlob` (browser).
 *
 * Layout guarantees:
 *  - A4 portrait, margins from branding config
 *  - running header + footer with "Page X of Y" on every page
 *  - section headings carry keepNext so they can never strand at a page bottom
 *  - signature blocks carry keepNext/keepLines so they never split
 *  - every table is width 100% of the text block, so nothing overflows
 */

import {
  Document, Paragraph, TextRun, Table, TableRow, TableCell, TableLayoutType,
  Header, Footer, PageNumber, AlignmentType, BorderStyle, WidthType,
  HeadingLevel, PageBreak, VerticalAlign, ShadingType, ImageRun,
} from 'docx'

import { brand, pt, hp } from '../config/branding.mjs'
import { resolveSections } from '../content/sections.mjs'
import { tableForBlock, buildInfoTable, buildControlTable, buildSignatureData } from '../content/tables.mjs'
import { ph } from '../config/schema.mjs'
import { titleCase } from '../util.mjs'

const C = brand.colors
const F = brand.fonts
const T = brand.type
const S = brand.spacing

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE }
const hairline = (color = C.rule, size = 4) => ({ style: BorderStyle.SINGLE, size, color })

/**
 * Usable A4 text width in twips, derived from the page margins. This was hardcoded
 * as 9626 for 57pt margins; after moving to 62pt that made every Word table about
 * 10pt wider than the text block.
 */
const CONTENT_TWIPS = 11906 - pt(brand.page.marginLeft) - pt(brand.page.marginRight)

/**
 * Percentage widths -> twips that sum to EXACTLY CONTENT_TWIPS. Rounding each
 * column on its own can overshoot: a 34/33/33 split rounds up twice and gave
 * 9427 against a 9426 text block. The last column absorbs the remainder.
 */
const exactColumnWidths = (widths) => {
  const cols = widths.map((w) => Math.round((w / 100) * CONTENT_TWIPS))
  cols[cols.length - 1] += CONTENT_TWIPS - cols.reduce((a, b) => a + b, 0)
  return cols
}

const lineSpacing = { line: Math.round(240 * S.lineHeight), lineRule: 'auto' }

/** Body text run. */
const run = (text, o = {}) =>
  new TextRun({
    text: String(text ?? ''),
    font: o.font || F.body,
    size: hp(o.size || T.body),
    bold: !!o.bold,
    italics: !!o.italic,
    color: o.color || C.ink,
    allCaps: !!o.caps,
  })

/** Body paragraph. */
const para = (text, o = {}) =>
  new Paragraph({
    alignment: o.align || AlignmentType.JUSTIFIED,
    spacing: { ...lineSpacing, before: pt(o.before || 0), after: pt(o.after ?? S.paraAfter) },
    indent: o.indent ? { left: pt(o.indent) } : undefined,
    keepNext: !!o.keepNext,
    keepLines: !!o.keepLines,
    children: o.children || [run(text, o)],
  })

const spacer = (h = 8) => new Paragraph({ spacing: { before: 0, after: pt(h) }, children: [run('')] })

/** A horizontal rule drawn as a bottom-bordered empty paragraph. */
const rule = (color = C.rule, size = 8, after = 6) =>
  new Paragraph({
    border: { bottom: hairline(color, size) },
    spacing: { before: 0, after: pt(after) },
    children: [run('')],
  })

// ---------------------------------------------------------------------------
// header / footer
// ---------------------------------------------------------------------------

/**
 * createHeader() — intentionally empty.
 * The letterhead identifies the document on page 1; repeating a header band on
 * every page made the pages look like a form rather than a contract.
 */
export const createHeader = () => new Header({ children: [] })

/** createFooter() — contact strip, and the page count only when enabled. */
export const createFooter = () => {
  const contactPara = (alignment) =>
    new Paragraph({
      alignment,
      spacing: { before: 0, after: 0 },
      children: [
        run(
          `${brand.contact.phone}   |   ${brand.contact.email}   |   ${brand.contact.web}`,
          { size: T.footer, color: C.inkMuted }
        ),
      ],
    })

  // Without page numbers the contact strip is simply centred on its own.
  if (!brand.layout.showPageNumbers) {
    return new Footer({ children: [rule(C.rule, 4, 4), contactPara(AlignmentType.CENTER)] })
  }

  return new Footer({
    children: [
      rule(C.rule, 4, 4),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        borders: noBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 78, type: WidthType.PERCENTAGE },
                borders: noBorders,
                margins: { top: 0, bottom: 0, left: 0, right: 0 },
                children: [contactPara(AlignmentType.LEFT)],
              }),
              new TableCell({
                width: { size: 22, type: WidthType.PERCENTAGE },
                borders: noBorders,
                margins: { top: 0, bottom: 0, left: 0, right: 0 },
                children: [addPageNumber()],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

/** addPageNumber() — real Word field codes, so the count stays correct after editing. */
export const addPageNumber = () =>
  new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 0, after: 0 },
    children: [
      new TextRun({ text: 'Page ', font: F.body, size: hp(T.footer), color: C.inkMuted }),
      new TextRun({ children: [PageNumber.CURRENT], font: F.body, size: hp(T.footer), color: C.inkMuted }),
      new TextRun({ text: ' of ', font: F.body, size: hp(T.footer), color: C.inkMuted }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], font: F.body, size: hp(T.footer), color: C.inkMuted }),
    ],
  })

// ---------------------------------------------------------------------------
// tables
// ---------------------------------------------------------------------------

const alignOf = (a) =>
  a === 'r' ? AlignmentType.RIGHT : a === 'c' ? AlignmentType.CENTER : AlignmentType.LEFT

/** brand.layout with any per-document overrides applied. */
const layoutFor = (d) => ({ ...brand.layout, ...(d.layout || {}) })

const cell = (text, o = {}) =>
  new TableCell({
    width: o.width ? { size: o.width, type: WidthType.PERCENTAGE } : undefined,
    shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: pt(5), bottom: pt(5), left: pt(7), right: pt(7) },
    borders: {
      top: hairline(C.rule), bottom: hairline(C.rule),
      left: hairline(C.rule), right: hairline(C.rule),
    },
    children: [
      new Paragraph({
        alignment: alignOf(o.align),
        spacing: { before: 0, after: 0, ...lineSpacing },
        children: [run(text, { size: o.size || T.tableBody, bold: o.bold, color: o.color || C.ink })],
      }),
    ],
  })

/** Shared table builder used by createInfoTable / createPricingTable / createDeliverablesTable. */
const buildTable = (spec) => {
  if (!spec) return []
  const widths = spec.widths || Array(spec.head.length).fill(100 / spec.head.length)
  const showHead = spec.head.some((h) => h !== '')

  const rows = []
  if (showHead) {
    rows.push(
      new TableRow({
        tableHeader: true, // repeats on page break
        children: spec.head.map((h, i) =>
          cell(h, {
            width: widths[i],
            fill: C.tableHeadBg,
            color: C.tableHeadText,
            bold: true,
            size: T.tableHead,
            align: spec.align?.[i],
          })
        ),
      })
    )
  }

  spec.rows.forEach((r, ri) => {
    rows.push(
      new TableRow({
        children: r.map((v, i) =>
          cell(v, {
            width: widths[i],
            align: spec.align?.[i],
            // first column of key/value tables reads as a label
            bold: ['info', 'control', 'bank'].includes(spec.variant) && i === 0,
          })
        ),
      })
    )
  })

  if (spec.totalRow) {
    rows.push(
      new TableRow({
        children: spec.totalRow.map((v, i) =>
          cell(v, { width: widths[i], align: spec.align?.[i], bold: true, fill: C.panel })
        ),
      })
    )
  }

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      columnWidths: exactColumnWidths(widths), // twips, summing exactly to the text block
      rows,
    }),
    spacer(S.paraAfter),
  ]
}

export const createInfoTable = (d) => buildTable(buildInfoTable(d))
export const createPricingTable = (d) => buildTable(tableForBlock({ t: 'pricing' }, d))
export const createDeliverablesTable = (d) => buildTable(tableForBlock({ t: 'deliverables' }, d))

// ---------------------------------------------------------------------------
// title page
// ---------------------------------------------------------------------------

/**
 * createLetterhead() — logo, company name, tagline and registration lines.
 * Rendered as BODY content on page 1 rather than in the Word header, because a
 * Word header repeats on every page and a letterhead should appear once.
 * `logoBuffer` is optional; without it the block renders text-only.
 */
export const createLetterhead = (logoBuffer) => {
  const L = brand.letterhead
  const textCell = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: pt(3) },
      children: [run(L.name, { bold: true, size: T.letterheadName })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: pt(2), after: pt(3) },
      children: [run(L.tagline, { size: T.letterheadTagline, italic: true })],
    }),
    ...(L.services
      ? [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: pt(2) },
            children: [run(L.services, { size: T.letterheadServices, color: C.inkMuted })],
          }),
        ]
      : []),
    ...L.lines.map(
      (line) =>
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: pt(1) },
          children: [run(line, { size: T.letterheadLine, color: C.inkMuted })],
        })
    ),
  ]

  const out = []
  if (logoBuffer) {
    out.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        columnWidths: [1800, CONTENT_TWIPS - 1800],
        borders: noBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: noBorders,
                verticalAlign: VerticalAlign.CENTER,
                margins: { top: 0, bottom: 0, left: 0, right: 0 },
                children: [
                  new Paragraph({
                    spacing: { before: 0, after: 0 },
                    children: [
                      new ImageRun({
                        // `type` is required by docx v9 — without it the part is
                        // written as ".undefined" and Word will not render it.
                        type: 'png',
                        data: logoBuffer,
                        transformation: { width: brand.logo.widthPt, height: brand.logo.heightPt },
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                borders: noBorders,
                verticalAlign: VerticalAlign.CENTER,
                margins: { top: 0, bottom: 0, left: 0, right: 0 },
                children: textCell,
              }),
            ],
          }),
        ],
      })
    )
  } else {
    out.push(...textCell)
  }

  out.push(rule(C.rule, 18, 2))
  out.push(rule(C.rule, 5, 16))
  return out
}

/** createTitlePage() — letterhead, document title, information table. */
export const createTitlePage = (d, logoBuffer) => {
  const out = [
    ...createLetterhead(logoBuffer),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { ...lineSpacing, before: 0, after: pt(14) },
      children: [run(ph(d.documentType, 'AGREEMENT_TITLE'), { bold: true, size: T.docTitle, font: F.heading })],
    }),
  ]
  if (layoutFor(d).showInfoTable) out.push(...createInfoTable(d))
  if (d.preamble) out.push(para(d.preamble, { before: 10, after: 4 }))
  return out
}

/** Small bold label above a table. */
const sectionLabel = (text) =>
  new Paragraph({
    spacing: { before: 0, after: pt(6) },
    keepNext: true,
    children: [run(text, { bold: true, size: T.subHeading })],
  })

// ---------------------------------------------------------------------------
// sections
// ---------------------------------------------------------------------------

/** Unnumbered document-control appendix, rendered after the final section. */
export const createDocumentControl = (d) => [
  spacer(16),
  sectionLabel('Document Control'),
  ...buildTable(buildControlTable(d)),
]

/** createSubsection() — bold inline subheading. */
export const createSubsection = (text) =>
  new Paragraph({
    spacing: { before: pt(10), after: pt(4), ...lineSpacing },
    keepNext: true,
    children: [run(text, { bold: true, size: T.subHeading })],
  })

/** createBulletList() — bulleted items at a consistent indent. */
export const createBulletList = (items) =>
  items.map(
    (it) =>
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { ...lineSpacing, before: 0, after: pt(4) },
        indent: { left: pt(18), hanging: pt(10) },
        children: [run('•   ', { bold: true }), run(it)],
      })
  )

/** Auto-numbered clauses: 4.1, 4.2, ... */
const createClauses = (items, sectionNo) =>
  items.map(
    (it, i) =>
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { ...lineSpacing, before: 0, after: pt(6) },
        indent: { left: pt(26), hanging: pt(26) },
        children: [
          run(`${sectionNo}.${i + 1}`, { bold: true }),
          run(' '),
          run(it),
        ],
      })
  )

/**
 * createSignatureBlock() — one table row per line, so both columns stay aligned.
 *
 * Two independent cell stacks let a wrapping party name ("FOR MLA ACADEMY OF
 * HIGHER LEARNING") push only its own column down, misaligning the signature
 * lines. Rows share a height across cells, which fixes that. cantSplit keeps
 * each row whole; keepNext on every line keeps the block on one page.
 */
export const createSignatureBlock = (d) => {
  const [a, b] = buildSignatureData(d)
  const half = Math.floor(CONTENT_TWIPS / 2)

  const line = (children, before = 0) =>
    new Paragraph({ spacing: { before: pt(before), after: 0 }, keepNext: true, keepLines: true, children })

  const cellOf = (paragraph, padRight) =>
    new TableCell({
      width: { size: half, type: WidthType.DXA },
      borders: noBorders,
      margins: { top: 0, bottom: 0, left: padRight ? 0 : pt(12), right: padRight ? pt(12) : 0 },
      children: [paragraph],
    })

  const pair = (left, right) => new TableRow({ cantSplit: true, children: [cellOf(left, true), cellOf(right, false)] })
  const labelled = (label, value, before) => line([run(label, { bold: true }), run(value)], before)
  const rule = (label, n, before) => line([run(`${label}: ${'_'.repeat(n)}`)], before)

  const rows = [
    pair(line([run(a.heading, { bold: true, size: T.subHeading })]), line([run(b.heading, { bold: true, size: T.subHeading })])),
    pair(labelled('Name: ', a.name, 6), labelled('Name: ', b.name, 6)),
    pair(labelled('Designation: ', a.designation, 2), labelled('Designation: ', b.designation, 2)),
    pair(rule('Signature', 26, 18), rule('Signature', 26, 18)),
    pair(rule('Date', 31, 16), rule('Date', 31, 16)),
    pair(rule('Company Seal', 22, 16), rule('Company Seal', 22, 16)),
  ]

  return [
    new Table({
      width: { size: half * 2, type: WidthType.DXA },
      layout: TableLayoutType.FIXED,
      columnWidths: [half, half],
      borders: noBorders,
      rows,
    }),
  ]
}

/** createSection() — one numbered section and all of its blocks. */
export const createSection = (section, no, d) => {
  const out = []

  if (section.pageBreakBefore) out.push(new Paragraph({ children: [new PageBreak()] }))

  // `no === null` marks an unnumbered lead block (e.g. the parties recital),
  // which gets no rule and no clause number.
  if (no !== null) {
    // A rule above every section heading, as on a printed letterhead contract.
    out.push(
      new Paragraph({
        border: { bottom: hairline(C.rule, 4) },
        spacing: { before: pt(S.sectionBefore), after: 0 },
        keepNext: true,
        children: [run('')],
      })
    )
    out.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1, // a real Word heading -> navigation pane + TOC
        spacing: { before: pt(8), after: pt(S.sectionAfter), ...lineSpacing },
        keepNext: true, // never strand a heading at the foot of a page
        keepLines: true,
        children: [
          run(`${no}.  ${titleCase(section.title)}`, { bold: true, size: T.sectionHeading, font: F.heading }),
        ],
      })
    )

  } else if (section.title) {
    out.push(
      new Paragraph({
        spacing: { before: pt(10), after: pt(6), ...lineSpacing },
        keepNext: true,
        children: [run(titleCase(section.title), { bold: true, size: T.subHeading })],
      })
    )
  }

  for (const b of section.blocks || []) {
    switch (b.t) {
      case 'p':
        out.push(
          para(b.text, {
            align: b.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
            bold: b.bold,
            children: b.boldLead
              ? [run(b.boldLead, { bold: true }), run(b.text)]
              : undefined,
          })
        )
        break
      case 'sub':
        out.push(createSubsection(b.text))
        break
      case 'bullets':
        out.push(...createBulletList(b.items || []))
        out.push(spacer(4))
        break
      case 'clauses':
        out.push(...createClauses(b.items || [], no))
        break
      case 'spacer':
        out.push(spacer(b.h || 8))
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
// document
// ---------------------------------------------------------------------------

/** Build the complete docx Document (no I/O). */
export const buildDocxDocument = (d, { logoBuffer = null } = {}) => {
  const sections = resolveSections(d)
  const body = [...createTitlePage(d, logoBuffer)]
  // Only numbered sections advance the clause counter.
  let clause = 0
  sections.forEach((sec) => {
    const no = sec.unnumbered ? null : (clause += 1)
    body.push(...createSection(sec, no, d))
  })
  if (layoutFor(d).showDocumentControl) body.push(...createDocumentControl(d))

  return new Document({
    creator: brand.companyName,
    title: ph(d.documentType, 'AGREEMENT_TITLE'),
    description: `${brand.companyName} agreement`,
    styles: {
      default: {
        document: { run: { font: F.body, size: hp(T.body), color: C.ink } },
        heading1: { run: { font: F.heading, size: hp(T.sectionHeading), bold: true, color: C.ink } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4 portrait, twips
            margin: {
              top: pt(brand.page.marginTop),
              right: pt(brand.page.marginRight),
              bottom: pt(brand.page.marginBottom),
              left: pt(brand.page.marginLeft),
              header: pt(brand.page.headerOffset),
              footer: pt(brand.page.footerOffset),
            },
          },
        },
        headers: { default: createHeader() },
        footers: { default: createFooter() },
        children: body,
      },
    ],
  })
}

export default buildDocxDocument
