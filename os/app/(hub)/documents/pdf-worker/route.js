import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * pdf.js's background worker, served by the app itself rather than from a CDN, so
 * nothing about a document is ever sent elsewhere. The page asks for it with the
 * library's version in the address, so it can be cached for good.
 */
let worker = null

export async function GET() {
  worker ??= readFile(path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.min.mjs')).catch((e) => {
    worker = null
    throw e
  })
  return new Response(await worker, {
    headers: {
      'Content-Type': 'text/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
