import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { isUuid } from '@/lib/forms'
import { getAvatar } from '@/lib/queries'

/**
 * A founder's profile photo. Not under a page, so it checks the session itself.
 * Its address carries the time it last changed (?v=), so the browser may keep it,
 * privately, for good; a new photo comes with a new address.
 */
export async function GET(request, { params }) {
  if (!(await getUser())) return NextResponse.redirect(new URL('/login', request.url))
  const { id } = await params
  const photo = isUuid(id) ? await getAvatar(id) : null
  if (!photo) return new NextResponse('Not found', { status: 404 })
  return new NextResponse(photo.data, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': String(photo.data.length),
      'Cache-Control': 'private, max-age=31536000, immutable',
    },
  })
}
