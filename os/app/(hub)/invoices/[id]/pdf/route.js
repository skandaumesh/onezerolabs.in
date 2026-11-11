import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { isUuid } from '@/lib/forms'
import { pdfFonts, renderInvoicePdf } from '@/lib/invoice-pdf.mjs'
import { getInvoice, getSettings, listInvoiceItems } from '@/lib/queries'

/**
 * The PDF of one invoice. This path is not under a page or the hub layout's
 * check, so it confirms the session itself.
 */
export async function GET(request, { params }) {
  if (!(await getUser())) return NextResponse.redirect(new URL('/login', request.url))

  const { id } = await params
  const invoice = isUuid(id) ? await getInvoice(id) : null
  if (!invoice) return new NextResponse('Not found', { status: 404 })

  const [items, settings, logoFile] = await Promise.all([
    listInvoiceItems(id),
    getSettings(),
    readFile(path.join(process.cwd(), 'public', 'logo-print.png')).catch(() => null),
  ])

  const { default: pdfmakeModule } = await import('pdfmake/js/index.js')
  const pdfmake = pdfmakeModule.default || pdfmakeModule
  const fontFiles = pdfFonts()
  pdfmake.setFonts(fontFiles)
  // A document has no need to fetch anything or read any file but its own fonts.
  pdfmake.setUrlAccessPolicy(() => false)
  const allowed = new Set(Object.values(fontFiles.Roboto))
  pdfmake.setLocalAccessPolicy((file) => allowed.has(file))

  const logo = logoFile ? `data:image/png;base64,${logoFile.toString('base64')}` : null
  const buffer = await renderInvoicePdf(pdfmake, { invoice, items, settings, logo })

  const name = (invoice.number ?? `draft-${invoice.bill_to_name}`).replace(/[^\w-]+/g, '-')
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${name}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
