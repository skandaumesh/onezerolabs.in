import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import {
  checkFile,
  cleanName,
  contentDisposition,
  extensionOf,
  formatBytes,
  freeName,
  keepExtension,
  likePattern,
  MAX_FILE_BYTES,
  typeOfMime,
} from '../lib/documents.mjs'

const bytes = (...parts) => new Uint8Array(parts.flatMap((p) => (typeof p === 'string' ? [...p].map((c) => c.charCodeAt(0)) : p)))
const PDF = bytes('%PDF-1.7\n', [0, 1, 2])
const ZIP = bytes([0x50, 0x4b, 0x03, 0x04], 'rest')
const PNG = bytes([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 'IHDR')
const JPG = bytes([0xff, 0xd8, 0xff, 0xe0], 'JFIF')
const OLE = bytes([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1], 'x')

describe('what can be stored', () => {
  test('real files of each kind are accepted, typed by their name', () => {
    assert.deepEqual(checkFile('MOU.pdf', PDF), { ok: true, mime: 'application/pdf', kind: 'pdf' })
    assert.equal(checkFile('Agreement.docx', ZIP).kind, 'word')
    assert.equal(checkFile('Prices.xlsx', ZIP).kind, 'sheet')
    assert.equal(checkFile('Old.doc', OLE).kind, 'word')
    assert.equal(checkFile('signed.PNG', PNG).kind, 'image')
    assert.equal(checkFile('scan.jpeg', JPG).mime, 'image/jpeg')
    assert.equal(checkFile('notes.txt', bytes('hello')).kind, 'text')
  })

  test('a file whose contents do not match its name is refused', () => {
    assert.match(checkFile('invoice.pdf', ZIP).error, /doesn’t look like a real \.pdf/)
    assert.match(checkFile('photo.png', PDF).error, /real \.png/)
    assert.match(checkFile('notes.txt', bytes('a', [0], 'b')).error, /real \.txt/)
  })

  test('kinds that could run in the browser are refused', () => {
    for (const name of ['page.html', 'logo.svg', 'tool.exe', 'script.js', 'no-extension']) {
      assert.match(checkFile(name, bytes('<svg onload=alert(1)>')).error, /isn’t a kind of file kept here/, name)
    }
  })

  test('empty and oversized files are refused', () => {
    assert.match(checkFile('a.pdf', new Uint8Array()).error, /empty/)
    const big = new Uint8Array(MAX_FILE_BYTES + 1)
    big.set(PDF)
    assert.match(checkFile('a.pdf', big).error, /over 4 MB/)
  })

  test('only PDFs and common images open in place', () => {
    assert.equal(typeOfMime('application/pdf').inline, true)
    assert.equal(typeOfMime('image/png').inline, true)
    assert.equal(typeOfMime('image/heic').inline, undefined)
    assert.equal(typeOfMime('text/plain').inline, undefined)
    assert.equal(typeOfMime('text/html').kind, 'other')
  })
})

describe('names', () => {
  test('cleaning removes folders, control characters and leading dots', () => {
    assert.equal(cleanName('C:\\Users\\x\\MOU_Acme-Foods.pdf'), 'MOU_Acme-Foods.pdf')
    assert.equal(cleanName('../../etc/passwd'), 'passwd')
    assert.equal(cleanName('  a\u0000b\nc.pdf '), 'a b c.pdf')
    assert.equal(cleanName('.hidden.pdf'), 'hidden.pdf')
    assert.equal(cleanName('Quote "final".pdf'), 'Quote final .pdf')
    assert.equal(cleanName('   '), null)
  })

  test('a very long name keeps its extension', () => {
    const name = cleanName(`${'x'.repeat(300)}.docx`)
    assert.equal(name.length, 200)
    assert.equal(extensionOf(name), 'docx')
  })

  test('a rename keeps the extension', () => {
    assert.equal(keepExtension('Acme MOU', 'MOU_Acme-Foods.pdf'), 'Acme MOU.pdf')
    assert.equal(keepExtension('Acme MOU.pdf', 'MOU_Acme-Foods.pdf'), 'Acme MOU.pdf')
    assert.equal(keepExtension('Acme MOU.PDF', 'MOU_Acme-Foods.pdf'), 'Acme MOU.PDF')
  })

  test('a taken name gets a number, as in the Files app', () => {
    assert.equal(freeName('Quote.pdf', []), 'Quote.pdf')
    assert.equal(freeName('Quote.pdf', ['quote.PDF']), 'Quote (2).pdf')
    assert.equal(freeName('Quote.pdf', ['Quote.pdf', 'Quote (2).pdf']), 'Quote (3).pdf')
    assert.equal(freeName('README', ['README']), 'README (2)')
  })

  test('downloads carry the real name, even with Indian scripts', () => {
    assert.equal(contentDisposition('MOU.pdf', true), `inline; filename="MOU.pdf"; filename*=UTF-8''MOU.pdf`)
    const header = contentDisposition('ಒಪ್ಪಂದ "1".pdf', false)
    assert.ok(header.startsWith('attachment; filename="'))
    assert.ok(!/[^\x20-\x7e]/.test(header), 'the header itself stays plain ASCII')
    assert.ok(header.includes(encodeURIComponent('ಒಪ್ಪಂದ')))
  })
})

describe('showing sizes and searching', () => {
  test('sizes read naturally', () => {
    assert.equal(formatBytes(820), '820 bytes')
    assert.equal(formatBytes(36610), '36 KB')
    assert.equal(formatBytes(2.5 * 1024 * 1024), '2.5 MB')
    assert.equal(formatBytes(3 * 1024 * 1024), '3 MB')
  })

  test('search treats % and _ as plain characters', () => {
    assert.equal(likePattern('50%_off'), '%50\\%\\_off%')
  })
})
