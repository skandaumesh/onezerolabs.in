'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth'
import { sql } from '@/lib/db.mjs'

/**
 * Opening the list counts as reading everything in it. The bell's count clears
 * at once; the list keeps marking what just arrived for a few minutes, so it
 * still shows what was new on this visit.
 */
export async function markNotificationsRead() {
  const user = await requireUser()
  await sql('UPDATE notifications SET read_at = now() WHERE user_id = $1 AND read_at IS NULL', [user.id])
  revalidatePath('/', 'layout')
  return { ok: true }
}
