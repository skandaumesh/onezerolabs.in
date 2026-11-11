import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { sql } from '@/lib/db.mjs'

export const dynamic = 'force-dynamic'

/**
 * The Android app registers its push token here once someone has signed in on
 * it. The custom header can't be sent by a web page on another site without
 * permission this app never gives, so only the app itself can call this.
 */
const readToken = async (request) => {
  if (request.headers.get('x-ozl-app') !== '1') return null
  const body = await request.json().catch(() => null)
  const token = typeof body?.token === 'string' ? body.token.trim() : ''
  return token.length > 20 && token.length < 4096 ? token : null
}

export async function POST(request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const token = await readToken(request)
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 400 })
  // Whoever signed in on a phone last gets its notices.
  await sql(
    `INSERT INTO devices (user_id, token) VALUES ($1, $2)
     ON CONFLICT (token) DO UPDATE SET user_id = $1, last_seen_at = now()`,
    [user.id, token]
  )
  return NextResponse.json({ ok: true })
}

export async function DELETE(request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const token = await readToken(request)
  if (token) await sql('DELETE FROM devices WHERE token = $1 AND user_id = $2', [token, user.id])
  return NextResponse.json({ ok: true })
}
