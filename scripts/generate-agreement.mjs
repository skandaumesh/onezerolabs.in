#!/usr/bin/env node
/**
 * CLI: generate agreement .docx and .pdf files.
 *
 *   node scripts/generate-agreement.mjs                 # blank template + example
 *   node scripts/generate-agreement.mjs --blank         # blank template only
 *   node scripts/generate-agreement.mjs --example       # populated example only
 *   node scripts/generate-agreement.mjs --data ./my.json --out ./out
 *
 * Output defaults to ./generated.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Packer } from 'docx'
import pdfmakeModule from 'pdfmake/js/index.js'

import { brand } from '../lib/agreement/config/branding.mjs'
import {
  createAgreementData,
  exampleAgreement,
  buildDocxDocument,
  buildPdfDefinition,
  PDF_STANDARD_FONTS,
  suggestFilename,
} from '../lib/agreement/index.mjs'

/**
 * pdfmake 0.3 exposes a configured singleton as its Node entry point.
 * Both access policies are denied because an agreement document never needs to
 * fetch a remote URL or read the local filesystem while rendering.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const pdfmake = pdfmakeModule.default || pdfmakeModule

/**
 * Standard PDF fonts: Times is metrically identical to Word's Times New Roman,
 * needs no embedding, and keeps the file small. Amounts are written "Rs." so
 * no glyph outside WinAnsi is ever required.
 */
pdfmake.setFonts(PDF_STANDARD_FONTS)

// Remote fetches are never needed while rendering an agreement.
pdfmake.setUrlAccessPolicy(() => false)

// pdfmake routes built-in font names through the local-file check, so allow
// exactly those and deny every other path.
const allowedFontNames = new Set(Object.values(PDF_STANDARD_FONTS).flatMap((f) => Object.values(f)))
pdfmake.setLocalAccessPolicy((p) => allowedFontNames.has(p))

/** Letterhead logo, read once and shared by both exporters. */
const logoPath = path.join(projectRoot, brand.logo.path)
const logoBuffer = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null
const logoDataUrl = logoBuffer ? `data:image/png;base64,${logoBuffer.toString('base64')}` : null
if (!logoBuffer) {
  console.warn(`  ! logo not found at ${brand.logo.path} - letterhead will be text-only`)
}

const argv = process.argv.slice(2)
const flag = (name) => argv.includes(`--${name}`)
const value = (name) => {
  const i = argv.indexOf(`--${name}`)
  return i !== -1 ? argv[i + 1] : null
}

const outDir = path.resolve(projectRoot, value('out') || 'generated')
fs.mkdirSync(outDir, { recursive: true })

/** exportToDocx() — write a .docx to disk. */
export const exportToDocx = async (data, filePath) => {
  const buffer = await Packer.toBuffer(buildDocxDocument(data, { logoBuffer }))
  fs.writeFileSync(filePath, buffer)
  return buffer.length
}

/** exportToPdf() — write a .pdf to disk. */
export const exportToPdf = async (data, filePath) => {
  const out = pdfmake.createPdf(buildPdfDefinition(data, { logoDataUrl }))
  const buffer = await out.getBuffer()
  fs.writeFileSync(filePath, buffer)
  return buffer.length
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`

const generate = async (label, data, baseName) => {
  const docxPath = path.join(outDir, `${baseName}.docx`)
  const pdfPath = path.join(outDir, `${baseName}.pdf`)
  const docxSize = await exportToDocx(data, docxPath)
  const pdfSize = await exportToPdf(data, pdfPath)
  console.log(`  ${label}`)
  console.log(`    ${path.relative(projectRoot, docxPath)}  ${kb(docxSize)}`)
  console.log(`    ${path.relative(projectRoot, pdfPath)}  ${kb(pdfSize)}`)
}

const main = async () => {
  const custom = value('data')
  const onlyBlank = flag('blank')
  const onlyExample = flag('example')

  console.log(`\nOneZeroLabs agreement generator -> ${path.relative(projectRoot, outDir)}/\n`)

  if (custom) {
    // Accept .json data files and .mjs/.js modules (which can hold a full
    // custom `sections` array that JSON would make unreadable).
    const abs = path.resolve(projectRoot, custom)
    const raw = /\.(mjs|js)$/.test(abs)
      ? (await import(pathToFileURL(abs).href)).default
      : JSON.parse(fs.readFileSync(abs, 'utf8'))
    const data = createAgreementData(raw)
    await generate('Custom', data, suggestFilename(data, '').replace(/\.$/, ''))
  } else {
    if (!onlyExample) {
      await generate('Blank template', createAgreementData(), 'agreement-template-BLANK')
    }
    if (!onlyBlank) {
      await generate('Populated example', createAgreementData(exampleAgreement), 'agreement-EXAMPLE')
    }
  }
  console.log('\nDone.\n')
}

main().catch((err) => {
  console.error('\nGeneration failed:', err)
  process.exit(1)
})
