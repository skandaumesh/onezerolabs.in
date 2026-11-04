import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * What pdf.js needs beside the PDF itself, served by the app so nothing about a
 * document goes to another site:
 *   fonts: the standard fonts (Times, Helvetica, Courier) for PDFs that use them
 *          without carrying them, which is how the agreement generator writes them.
 *          These are the Foxit fonts Chrome's own PDF viewer uses, so a PDF looks
 *          the same here as it does there, on every phone.
 *   cmaps: character maps for other scripts.
 *   wasm:  decoders for the images inside scanned PDFs.
 *   iccs:  a colour profile for print-ready PDFs.
 * Only these folders, and only files of these kinds, can be read. The version in
 * the address changes with pdf.js, so each file can be cached for good.
 */
const KINDS = {
  fonts: { dir: 'standard_fonts', file: /^[A-Za-z0-9-]+\.(pfb|ttf)$/ },
  cmaps: { dir: 'cmaps', file: /^[A-Za-z0-9-]+\.bcmap$/ },
  wasm: { dir: 'wasm', file: /^(jbig2|openjpeg|qcms_bg)\.wasm$/ },
  iccs: { dir: 'iccs', file: /^[A-Za-z0-9-]+\.icc$/ },
}

const ROOT = path.join(process.cwd(), 'node_modules', 'pdfjs-dist')

export async function GET(_request, { params }) {
  const { kind, file } = await params
  const allowed = KINDS[kind]
  if (!allowed || !allowed.file.test(file)) return new Response('Not found', { status: 404 })

  const data = await readFile(path.join(ROOT, allowed.dir, file)).catch(() => null)
  if (!data) return new Response('Not found', { status: 404 })
  return new Response(data, {
    headers: {
      'Content-Type': file.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
