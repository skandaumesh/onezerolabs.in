'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth'
import { sql } from '@/lib/db.mjs'
import { text } from '@/lib/forms'
import { hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from '@/lib/session.mjs'

const MAX_FAILURES = 5
const WINDOW_MINUTES = 15

export async function updateName(_prev, form) {
  const user = await requireUser()
  const name = text(form, 'name')
  if (!name) return { error: 'Enter your name.' }

  await sql('UPDATE users SET name = $2 WHERE id = $1', [user.id, name])
  revalidatePath('/', 'layout')
  return { ok: true }
}

/**
 * Needs the current password as well as a session, so someone at an unlocked
 * phone cannot take over the account. Wrong guesses count towards the same limit
 * as the sign-in page.
 */
export async function changePassword(_prev, form) {
  const user = await requireUser()
  const current = form.get('current')
  const next = form.get('next')
  const again = form.get('again')
  if (typeof current !== 'string' || typeof next !== 'string' || !current || !next) {
    return { error: 'Fill in your current and new password.' }
  }

  const [{ failures }] = await sql(
    `SELECT count(*)::int AS failures FROM login_attempts
     WHERE email = $1 AND attempted_at > now() - make_interval(mins => $2)`,
    [user.email, WINDOW_MINUTES]
  )
  if (failures >= MAX_FAILURES) {
    return { error: `Too many failed attempts. Try again in ${WINDOW_MINUTES} minutes.` }
  }

  const [row] = await sql('SELECT password_hash FROM users WHERE id = $1', [user.id])
  if (!verifyPassword(current, row.password_hash)) {
    await sql('INSERT INTO login_attempts (email) VALUES ($1)', [user.email])
    return { error: 'Your current password is not right.' }
  }
  if (next.length < MIN_PASSWORD_LENGTH) {
    return { error: `Your new password needs at least ${MIN_PASSWORD_LENGTH} characters.` }
  }
  if (next !== again) return { error: 'The two new passwords do not match.' }

  await sql('UPDATE users SET password_hash = $2 WHERE id = $1', [user.id, hashPassword(next)])
  await sql('DELETE FROM login_attempts WHERE email = $1', [user.email])
  return { ok: true }
}
