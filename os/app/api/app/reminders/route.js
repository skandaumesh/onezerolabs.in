import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { contentRemindersFor } from '@/lib/content.mjs'
import { listContentToRemind, listEventsToRemind, listTasksToRemind, listUsers } from '@/lib/queries'
import { AHEAD_DAYS, eventRemindersFor, remindersFor } from '@/lib/reminders.mjs'

export const dynamic = 'force-dynamic'

/**
 * The signed-in founder's reminders for the next 30 days: tasks when they are
 * due, events the day before they start, and each day's planned post at 5 pm. The Android app sets
 * an alarm for each, replacing the ones it set before, so a moved or finished
 * task stops reminding.
 */
export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const [tasks, events, posts, users] = await Promise.all([listTasksToRemind(AHEAD_DAYS), listEventsToRemind(AHEAD_DAYS), listContentToRemind(AHEAD_DAYS), listUsers()])
  const now = Date.now()
  const reminders = [...remindersFor(tasks, user.id, now), ...eventRemindersFor(events, now), ...contentRemindersFor(posts, user.id, users, now)].sort((a, b) => a.at - b.at)
  return NextResponse.json(
    { reminders },
    { headers: { 'Cache-Control': 'private, no-store' } }
  )
}
