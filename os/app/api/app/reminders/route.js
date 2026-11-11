import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { listEventsToRemind, listTasksToRemind } from '@/lib/queries'
import { AHEAD_DAYS, eventRemindersFor, remindersFor } from '@/lib/reminders.mjs'

export const dynamic = 'force-dynamic'

/**
 * The signed-in founder's reminders for the next 30 days: tasks when they are
 * due, and events the day before they start. The Android app sets
 * an alarm for each, replacing the ones it set before, so a moved or finished
 * task stops reminding.
 */
export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const [tasks, events] = await Promise.all([listTasksToRemind(AHEAD_DAYS), listEventsToRemind(AHEAD_DAYS)])
  const now = Date.now()
  const reminders = [...remindersFor(tasks, user.id, now), ...eventRemindersFor(events, now)].sort((a, b) => a.at - b.at)
  return NextResponse.json(
    { reminders },
    { headers: { 'Cache-Control': 'private, no-store' } }
  )
}
