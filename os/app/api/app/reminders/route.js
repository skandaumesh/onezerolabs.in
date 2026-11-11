import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { listTasksToRemind } from '@/lib/queries'
import { AHEAD_DAYS, remindersFor } from '@/lib/reminders.mjs'

export const dynamic = 'force-dynamic'

/**
 * The signed-in founder's reminders for the next 30 days. The Android app sets
 * an alarm for each, replacing the ones it set before, so a moved or finished
 * task stops reminding.
 */
export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const tasks = await listTasksToRemind(AHEAD_DAYS)
  return NextResponse.json(
    { reminders: remindersFor(tasks, user.id, Date.now()) },
    { headers: { 'Cache-Control': 'private, no-store' } }
  )
}
