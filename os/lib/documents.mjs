/**
 * Which files the Documents section keeps, how each kind is shown, and how files
 * are named. Used in the browser to check a file before sending it and on the
 * server before storing it.
 */

// One file goes up per request. Vercel refuses a request over 4.5 MB, so 4 MB
// leaves room for the rest of the form.
export const MAX_FILE_MB = 4
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024

const OFFICE = 'application/vnd.openxmlformats-officedocument'

// `inline`: the browser can show it safely in place. Everything else downloads, so
// nothing uploaded can ever run as part of the app.
const TYPES = {
  pdf: { mime: 'application/pdf', kind: 'pdf', inline: true },
  doc: { mime: 'application/msword', kind: 'word' },
  docx: { mime: `${OFFICE}.wordprocessingml.document`, kind: 'word' },
  xls: { mime: 'application/vnd.ms-excel', kind: 'sheet' },
  xlsx: { mime: `${OFFICE}.spreadsheetml.sheet`, kind: 'sheet' },
  csv: { mime: 'text/csv', kind: 'sheet' },
  ppt: { mime: 'application/vnd.ms-powerpoint', kind: 'slides' },
  pptx: { mime: `${OFFICE}.presentationml.presentation`, kind: 'slides' },
  txt: { mime: 'text/plain', kind: 'text' },
  png: { mime: 'image/png', kind: 'image', inline: true },
  jpg: { mime: 'image/jpeg', kind: 'image', inline: true },
  jpeg: { mime: 'image/jpeg', kind: 'image', inline: true },
  webp: { mime: 'image/webp', kind: 'image', inline: true },
  heic: { mime: 'image/heic', kind: 'image' },
  zip: { mime: 'application/zip', kind: 'archive' },
}

export const ACCEPT = Object.keys(TYPES)
  .map((ext) => `.${ext}`)
  .join(',')

export const KIND_LABEL = {
  pdf: 'PDF',
  word: 'Word document',
  sheet: 'Spreadsheet',
  slides: 'Presentation',
  text: 'Text',
  image: 'Image',
  archive: 'Zip archive',
}

export const extensionOf = (name) => {
  const match = /\.([a-z0-9]+)$/i.exec(name ?? '')
  return match ? match[1].toLowerCase() : ''
}

/** The type of a stored file, from its mime type. */
export const typeOfMime = (mime) => Object.values(TYPES).find((t) => t.mime === mime) ?? { mime, kind: 'other' }

/** The type a file name says it is, or null when it isn't one we keep. */
export const typeOfName = (name) => TYPES[extensionOf(name)] ?? null

const starts = (bytes, ...signature) => signature.every((b, i) => bytes[i] === b)
const ascii = (bytes, from, to) => String.fromCharCode(...bytes.subarray(from, to))

// What the first bytes of each kind of file must be. A renamed file, say a program
// called invoice.pdf, fails here.
const LOOKS_RIGHT = {
  pdf: (b) => ascii(b, 0, 5) === '%PDF-',
  zip: (b) => starts(b, 0x50, 0x4b, 0x03, 0x04),
  ole: (b) => starts(b, 0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1),
  png: (b) => starts(b, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a),
  jpg: (b) => starts(b, 0xff, 0xd8, 0xff),
  webp: (b) => ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 12) === 'WEBP',
  heic: (b) => ascii(b, 4, 8) === 'ftyp',
  text: (b) => !b.subarray(0, 8192).includes(0),
}
const CHECK = {
  pdf: 'pdf',
  docx: 'zip',
  xlsx: 'zip',
  pptx: 'zip',
  zip: 'zip',
  doc: 'ole',
  xls: 'ole',
  ppt: 'ole',
  png: 'png',
  jpg: 'jpg',
  jpeg: 'jpg',
  webp: 'webp',
  heic: 'heic',
  txt: 'text',
  csv: 'text',
}

/**
 * Checks a file before it is stored. The type comes from the name and must match
 * the contents; what the browser claims the type is never counts.
 * @returns {{ ok: true, mime, kind } | { error: string }}
 */
export const checkFile = (name, bytes) => {
  const ext = extensionOf(name)
  const type = TYPES[ext]
  if (!bytes?.length) return { error: `${name} is empty.` }
  if (bytes.length > MAX_FILE_BYTES) return { error: `${name} is over ${MAX_FILE_MB} MB.` }
  if (!type) return { error: `${name} isn’t a kind of file kept here. Use PDF, Word, Excel, PowerPoint, an image or a zip.` }
  if (!LOOKS_RIGHT[CHECK[ext]](bytes)) return { error: `${name} doesn’t look like a real .${ext} file.` }
  return { ok: true, mime: type.mime, kind: type.kind }
}

/**
 * A name that is safe to show and to save: no folders, no control characters, no
 * leading dots, at most 200 characters with the extension kept.
 */
export const cleanName = (raw) => {
  let name = String(raw ?? '')
    .split(/[\\/]/)
    .pop()
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f<>:"|?*]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\.+/, '')
    .trim()
  if (name.length > 200) {
    const ext = extensionOf(name)
    name = ext ? `${name.slice(0, 199 - ext.length).trim()}.${ext}` : name.slice(0, 200).trim()
  }
  return name || null
}

/** A rename keeps the file's extension, so it still opens with the right app. */
export const keepExtension = (newName, oldName) => {
  const ext = extensionOf(oldName)
  if (!newName || !ext || extensionOf(newName) === ext) return newName
  return cleanName(`${newName}.${ext}`)
}

/** "Quote.pdf", or "Quote (2).pdf" if that is taken, as the Files app does. */
export const freeName = (name, taken) => {
  const used = new Set([...taken].map((n) => n.toLowerCase()))
  if (!used.has(name.toLowerCase())) return name
  const ext = extensionOf(name)
  const base = ext ? name.slice(0, -(ext.length + 1)) : name
  for (let n = 2; ; n++) {
    const candidate = ext ? `${base} (${n}).${ext}` : `${base} (${n})`
    if (!used.has(candidate.toLowerCase())) return candidate
  }
}

export const formatBytes = (bytes) => {
  const n = Number(bytes) || 0
  if (n < 1024) return `${n} bytes`
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1).replace(/\.0$/, '')} MB`
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

/** "inline" or "attachment", with the real name for every browser. */
export const contentDisposition = (name, inline) => {
  const fallback = name.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_')
  return `${inline ? 'inline' : 'attachment'}; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(name)}`
}

/** Escapes % and _ so a search for "50%" means those characters. */
export const likePattern = (q) => `%${q.replace(/[\\%_]/g, '\\$&')}%`
