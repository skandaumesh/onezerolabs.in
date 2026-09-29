# OneZeroLabs Agreement Document System

A reusable, data-driven agreement generator. One content model renders to both
**Microsoft Word (.docx)** and **PDF**, so the two exports stay in sync.

Use it for client contracts, employment and vendor agreements, website
maintenance, software development, marketing retainers — anything that needs a
numbered, signable document.

The design is a plain black-and-white printed letterhead: logo, company name and
tagline at the top, serif body text, numbered sections separated by rules, and a
contact strip in the footer. No brand colours appear in the document.

---

## Quick start

```bash
# blank template + populated example -> generated/
node scripts/generate-agreement.mjs

# just one of them
node scripts/generate-agreement.mjs --blank
node scripts/generate-agreement.mjs --example

# from your own data file
node scripts/generate-agreement.mjs --data examples/agreement.example.json --out generated

# check the output actually paginates correctly
python scripts/verify-agreement.py
```

Or use the browser form at **`/tools/agreement`** — fill it in, click
*Download .docx* / *Download .pdf*. It runs entirely client-side, so client data
never leaves the machine. The page is `noindex` and disallowed in `robots.txt`.

---

## Folder structure

```
lib/agreement/
  config/
    branding.mjs       letterhead, fonts, type scale, page geometry  <- design lives here
    schema.mjs         the data shape + placeholder resolution
    exampleData.mjs    a populated multi-page example
  content/
    sections.mjs       the 30 agreement sections, as data
    tables.mjs         info / scope / pricing / milestone / bank / control tables
  render/
    docx.mjs           builds a `docx` Document
    pdf.mjs            builds a pdfmake document definition
  util.mjs             filename + font helpers (no heavy imports)
  index.mjs            public API barrel

scripts/
  generate-agreement.mjs   CLI: writes .docx and .pdf
  verify-agreement.py      layout checks on the generated PDF

app/tools/agreement/       browser form
examples/                  example data file
generated/                 output (git-ignored)
```

The separation the brief asked for maps like this:

| Concern | File |
| --- | --- |
| Document data | `config/schema.mjs`, `config/exampleData.mjs` |
| Document styles | `config/branding.mjs` |
| Header / footer | `createHeader()`, `createFooter()` in both renderers |
| Agreement sections | `content/sections.mjs` |
| Tables | `content/tables.mjs` |
| Signature blocks | `createSignatureBlock()` in both renderers |
| Document generation | `render/docx.mjs`, `render/pdf.mjs` |
| PDF export | `exportToPdf()` in `scripts/generate-agreement.mjs` |

---

## Filling in an agreement

Everything flows from one object. `createAgreementData()` deep-merges your
values over the defaults, so you only supply what you know:

```js
import { createAgreementData, buildDocxDocument } from '@/lib/agreement/index.mjs'

const data = createAgreementData({
  documentType: 'WEBSITE DEVELOPMENT & MAINTENANCE AGREEMENT',
  agreementNumber: 'OZL/AGR/2026/014',
  effectiveDate: '01 March 2026',
  client: { name: 'Acme Ltd', legalEntity: 'Acme Private Limited', address: '…' },
  fees: [{ item: 'Design', description: 'UI design system', amount: 85000 }],
})
```

### The placeholder system

Any field left empty renders as a loud, greppable token — `[CLIENT_NAME]`,
`[EFFECTIVE_DATE]`, `[TOTAL_AMOUNT]`. A blank template is literally the default
data object with nothing filled in, so there is only ever one code path.

Before sending a document, search it for `[` to find anything unfilled.
`isPlaceholder(value)` does the same check in code.

**No fake client data is ever hardcoded.** `exampleData.mjs` uses an invented
organisation ("Northwind Institute") and is clearly labelled as such.

### Money

Amounts are numbers; formatting is automatic and uses **Indian digit grouping**
(`Rs. 12,34,567.50`). The TOTAL row is computed automatically when every amount in
`fees` is numeric — otherwise it falls back to `Rs. [TOTAL_AMOUNT]`.

---

## Adding, removing and editing sections

Sections live in `content/sections.mjs` as data. Numbering is positional, so
anything you add or remove renumbers the rest automatically (verified: removing
one section renumbers 30 sections down to a contiguous 1–29).

**Remove a section** — no code edit needed:

```js
createAgreementData({
  sectionOverrides: { maintenance: { include: false } },
})
```

**Rename one:**

```js
sectionOverrides: { taxes: { title: 'TAXES AND STATUTORY LEVIES' } }
```

**Append clauses to one:**

```js
sectionOverrides: {
  confidentiality: {
    extraBlocks: [{ t: 'clauses', items: ['Additional clause text…'] }],
  },
}
```

**Replace a section body outright:** pass `blocks: [...]` instead of `extraBlocks`.

**Add a brand-new section** — inserted before the signature block, which always
stays last:

```js
extraSections: [{
  id: 'sla',
  title: 'SERVICE LEVELS',
  blocks: [
    { t: 'p', text: 'The Service Provider shall meet the following service levels:' },
    { t: 'table', head: ['Severity', 'Response'], widths: [50, 50], rows: [['P1', '4 hours']] },
  ],
}]
```

To change the default set for everyone, edit the array in `content/sections.mjs`.

### Block vocabulary

| Block | Renders as |
| --- | --- |
| `{ t:'p', text }` | justified paragraph (`boldLead` bolds the opening phrase; `center`, `bold`) |
| `{ t:'clauses', items:[] }` | auto-numbered subclauses — `4.1`, `4.2`, … |
| `{ t:'bullets', items:[] }` | bulleted list |
| `{ t:'sub', text }` | bold subheading |
| `{ t:'table', head, rows, widths, align }` | custom table (`widths` are percentages, must total 100) |
| `{ t:'deliverables' }` | scope-of-services table from `data.deliverables` |
| `{ t:'pricing' }` | commercial table from `data.fees`, with TOTAL row |
| `{ t:'milestones' }` | payment schedule |
| `{ t:'bank' }` | bank details — omitted entirely if none supplied |
| `{ t:'signature' }` | both signature blocks |
| `{ t:'spacer', h }` | vertical gap in points |

Section flags: `pageBreakBefore`, `keepTogether`, `include: false`.

---

## Changing OneZeroLabs branding

All of it is in `config/branding.mjs`, and both renderers read from it — change
a value once and the Word and PDF outputs move together.

- **Colours** — there are none. The document is deliberately pure black and
  white: printed contracts read better, photocopy cleanly and look more serious
  in monochrome. Greys are used only for rules, table headers and secondary
  text. `colors.ink` is the body text colour.
- **Type scale** — `type.*` in points. The docx renderer converts to
  half-points automatically.
- **Page geometry** — `page.*` in points. Margins, header and footer offsets.
- **Letterhead** — `letterhead.name`, `letterhead.tagline`, `letterhead.lines`.
- **Contact strip** — `contact.phone`, `contact.email`, `contact.web`.
- **Logo** — `logo.path`, `logo.widthPt`, `logo.heightPt`.

### A note on fonts and currency

Word uses **Times New Roman**; the PDF uses the standard PDF font **Times**.
They are metrically identical, so line breaks and page breaks land in the same
place in both exports.

That choice constrains the currency. The standard PDF fonts are WinAnsi-encoded
and have **no glyph for the rupee sign ₹ (U+20B9)** — it renders as a wrong
character. Amounts are therefore written **"Rs. 4,00,000"**, which is standard
usage in Indian contracts and works in every font.

If you specifically need the ₹ glyph, you must embed a font that carries it
(pdfmake ships Roboto, which does). Set `fonts.pdf` accordingly, pass
`robotoFonts()` to `setFonts()`, and set `currencySymbol` on the data — but note
the PDF will then paginate slightly differently from the Word file.

### The letterhead

Page 1 carries a printed-letterhead block: logo, company name, tagline and
registration lines, closed by a rule pair. Pages 2 onward carry a compact
running header instead. Every page carries the contact strip in the footer.

The letterhead is **body content, not a Word header**, because a Word header
repeats on every page and a letterhead should appear once.

The logo is `public/logo-print.png` — **black artwork**, generated from
`public/logo.png`, which is white-on-transparent and would be invisible on white
paper. If the file is missing, the letterhead degrades to text-only rather than
failing.

### Dropping the summary tables

The agreement-information and document-control tables are optional:

```js
// lib/agreement/config/branding.mjs
layout: {
  showInfoTable: false,
  showDocumentControl: false,
}
```

## What the output guarantees

Verified mechanically by `scripts/verify-agreement.py` on every generated PDF:

- exact **A4 portrait** (595.28 × 841.89 pt) on every page
- running **header** on every page except the cover
- running **footer** with `Page X of Y` on every page — real Word field codes in
  the .docx, so the count stays correct after manual editing
- **no text or table border crosses a margin**
- **no section heading stranded** at the foot of a page
- **signature block never splits** across pages
- no unnecessarily sparse pages

The Word file uses real `Heading 1` styles (so Word's navigation pane and
automatic tables of contents work), real tables, and `cantSplit` rows.

### Known quirks worked around

Three bugs found while building this, documented in the code where they are
handled:

1. **pdfmake overshoots justified text** by ~2.9pt past the content width. Left
   and centre alignment are fine; tables are fine. Compensated with a 4pt right
   inset on justified nodes (`JUSTIFY_INSET` in `render/pdf.mjs`).
2. **pdfmake adds cell padding on top of declared column widths**, so widths
   summing to the full text block produce a table wider than the page.
   `widthsToPoints()` subtracts the padding and border chrome first.
3. **`pageBreakBefore(currentNode, followingNodesOnPage)` does not pass the
   second argument in pdfmake 0.3** — the documented recipe for preventing
   stranded headings silently does nothing. Replaced with a position threshold
   on `startPosition.verticalRatio`.

---

## Regenerating and checking

```bash
node scripts/generate-agreement.mjs
python scripts/verify-agreement.py
```

`verify-agreement.py` needs PyMuPDF (`pip install pymupdf`). It exits non-zero on
failure, so it can go straight into CI.
