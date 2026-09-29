/**
 * Dependency-free helpers.
 *
 * Kept out of index.mjs so a caller can import these WITHOUT pulling in the
 * renderers — index.mjs re-exports render/docx.mjs, which imports the `docx`
 * package, and that would land the whole library in the main bundle instead of
 * loading it on demand at export time.
 */

/**
 * Standard PDF fonts. No font files needed, and metrically identical to their
 * Word counterparts (Times <-> Times New Roman, Helvetica <-> Arial), which is
 * what keeps the two exports paginating the same way.
 *
 * These are WinAnsi-encoded and have NO rupee sign (U+20B9) — which is why
 * amounts are written "Rs.". To use the ₹ glyph you must embed a font.
 */
export const PDF_STANDARD_FONTS = {
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic',
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
}

/** Roboto file names, as shipped inside pdfmake. Covers the rupee sign. */
export const ROBOTO_FILES = {
  normal: 'Roboto-Regular.ttf',
  bold: 'Roboto-Medium.ttf',
  italics: 'Roboto-Italic.ttf',
  bolditalics: 'Roboto-MediumItalic.ttf',
}

/**
 * Build a Roboto descriptor. `resolve` maps a file name to whatever the engine
 * needs — an absolute path in Node, or a vfs key in the browser.
 */
export const robotoFonts = (resolve = (f) => f) => ({
  Roboto: Object.fromEntries(Object.entries(ROBOTO_FILES).map(([k, f]) => [k, resolve(f)])),
})

/**
 * Suggested output filename, e.g. OZL-AGR-2026-014_Northwind-Institute.docx
 * Unfilled placeholders such as [AGREEMENT_NUMBER] are dropped rather than
 * slugified, which would otherwise produce "-AGREEMENT_NUMBER-_Client.pdf".
 */
export const suggestFilename = (data, ext) => {
  const clean = (v, fallback) => {
    const s = String(v ?? '').trim()
    if (!s || /^\[[A-Z0-9_]+\]$/.test(s)) return fallback
    return s.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '')
  }
  const num = clean(data.agreementNumber, 'AGREEMENT')
  const who = clean(data.client?.name, 'CLIENT')
  return `${num}_${who}.${ext}`.replace(/-+/g, '-')
}

/** Small words that stay lowercase inside a title. */
const MINOR = new Set(['and','or','of','the','to','for','in','on','with','a','an','at','by','from'])

/**
 * 'PURPOSE AND SCOPE' -> 'Purpose and Scope'.
 * Section titles are stored in caps; presentation decides the case, so the
 * letterhead style can use title case without touching the content model.
 */
export const titleCase = (s) => {
  const str = String(s)
  // A title that already contains lowercase letters was cased by its author —
  // "Nature of this MoU", "SAAME Platform". Converting it would destroy
  // acronyms (MoU -> Mou), so it is returned exactly as written.
  if (/[a-z]/.test(str)) return str

  return str
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => {
      if (i > 0 && MINOR.has(w)) return w
      // Capitalise the first LETTER, not the first character, so a word opening
      // with punctuation still reads correctly: "(hosting," -> "(Hosting,".
      // Hyphenated words are capitalised on both sides: third-party -> Third-Party.
      return w
        .split('-')
        .map((part) => part.replace(/[a-z]/, (c) => c.toUpperCase()))
        .join('-')
    })
    .join(' ')
}
