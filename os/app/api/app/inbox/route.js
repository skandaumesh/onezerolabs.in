import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { listUnreadSince } from '@/lib/queries'

export const dynamic = 'force-dynamic'

// Each check looks a little further back than the last one ended, so a notice
// saved while a check was running is never missed. The app skips any it has shown.
const OVERLAP_MS = 5 * 60 * 1000

/**
 * Unread notices since ?since (an ISO time), for the Android app's own check
 * every 15 minutes. With push on they usually arrive sooner; the app keeps a
 * note of what it has shown, so nothing shows twice.
 */
export async function GET(request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const now = new Date()
  const since = new Date(new URL(request.url).searchParams.get('since') ?? '')
  const from = Number.isNaN(since.getTime()) ? new Date(now.getTime() - 24 * 60 * 60 * 1000) : new Date(since.getTime() - OVERLAP_MS)
  const items = await listUnreadSince(user.id, from.toISOString())
  return NextResponse.json(
    { items: items.map((n) => ({ ...n, created_at: new Date(n.created_at).toISOString() })), now: now.toISOString() },
    { headers: { 'Cache-Control': 'private, no-store' } }
  )
}
