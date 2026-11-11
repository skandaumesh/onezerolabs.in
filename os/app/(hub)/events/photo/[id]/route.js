import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { isUuid } from '@/lib/forms'
import { getEventPhoto } from '@/lib/queries'

/**
 * One event photo, full size or with ?small the copy made for lists. Not under a
 * page, so it checks the session itself. A photo's bytes never change once
 * stored, so the browser may keep it, privately, for as long as it likes.
 */
export async function GET(request, { params }) {
  if (!(await getUser())) return NextResponse.redirect(new URL('/login', request.url))

  const { id } = await params
  const photo = isUuid(id) ? await getEventPhoto(id, new URL(request.url).searchParams.has('small')) : null
  if (!photo) return new NextResponse('Not found', { status: 404 })

  return new NextResponse(photo.data, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': String(photo.data.length),
      'Cache-Control': 'private, max-age=31536000, immutable',
    },
  })
}
