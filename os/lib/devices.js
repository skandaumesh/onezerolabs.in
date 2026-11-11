import 'server-only'

import { cookies } from 'next/headers'
import { sql } from '@/lib/db.mjs'

/**
 * The Android app keeps its push token in this cookie, next to the sign-in one.
 * So the phone is linked to whoever is signed in on it, and unlinked when they
 * sign out, without the app having to ask.
 */
export const DEVICE_COOKIE = 'ozl_device'

const deviceToken = async () => {
  const token = (await cookies()).get(DEVICE_COOKIE)?.value?.trim()
  return token && token.length > 20 && token.length < 4096 ? token : null
}

/** Links this phone to the signed-in founder. Writes only when something changed, or once a day. */
export async function rememberDevice(userId) {
  const token = await deviceToken()
  if (!token) return
  try {
    await sql(
      `INSERT INTO devices (user_id, token) VALUES ($1, $2)
       ON CONFLICT (token) DO UPDATE SET user_id = $1, last_seen_at = now()
       WHERE devices.user_id <> $1 OR devices.last_seen_at < now() - interval '1 day'`,
      [userId, token]
    )
  } catch (error) {
    console.error('Could not link this phone:', error.message)
  }
}

/** Signing out on a phone stops its notices. */
export async function forgetDevice() {
  const token = await deviceToken()
  if (token) await sql('DELETE FROM devices WHERE token = $1', [token])
}
