import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { contentDisposition, typeOfMime } from '@/lib/documents.mjs'
import { isUuid } from '@/lib/forms'
import { getDocumentFile } from '@/lib/queries'

/**
 * One stored file. This path is not under a page or the hub layout's check, so it
 * confirms the session itself. The app draws PDFs itself from what this returns.
 * PDFs and images may open in place; everything else, and anything asked for with
 * ?download, saves as a file, so nothing uploaded can run as part of the app.
 */
export async function GET(request, { params }) {
  if (!(await getUser())) return NextResponse.redirect(new URL('/login', request.url))

  const { id } = await params
  const file = isUuid(id) ? await getDocumentFile(id) : null
  if (!file) return new NextResponse('Not found', { status: 404 })

  const inline = Boolean(typeOfMime(file.mime).inline) && !new URL(request.url).searchParams.has('download')
  return new NextResponse(file.data, {
    headers: {
      'Content-Type': file.mime,
      'Content-Length': String(file.data.length),
      'Content-Disposition': contentDisposition(file.name, inline),
      'Cache-Control': 'private, no-store',
    },
  })
}
