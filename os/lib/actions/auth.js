'use server'

import { redirect } from 'next/navigation'
import { endSession, startSession } from '@/lib/auth'
import { sql } from '@/lib/db.mjs'
import { hashPassword, verifyPassword } from '@/lib/session.mjs'
import { text } from '@/lib/forms'
import { forgetDevice } from '@/lib/devices'

const MAX_FAILURES = 5
const WINDOW_MINUTES = 15

// Checked when the email is unknown too, so a wrong email takes as long as a
// wrong password and the form does not reveal which accounts exist.
const DUMMY_HASH = hashPassword('not a real password')

export async function signIn(_prev, form) {
  const email = text(form, 'email')?.toLowerCase()
  const password = form.get('password')
  if (!email || typeof password !== 'string' || !password) {
    return { error: 'Enter your email and password.' }
  }

  const [{ failures }] = await sql(
    `SELECT count(*)::int AS failures FROM login_attempts
     WHERE email = $1 AND attempted_at > now() - make_interval(mins => $2)`,
    [email, WINDOW_MINUTES]
  )
  if (failures >= MAX_FAILURES) {
    return { error: `Too many failed attempts. Try again in ${WINDOW_MINUTES} minutes.` }
  }

  const [user] = await sql('SELECT id, password_hash FROM users WHERE email = $1', [email])
  if (!verifyPassword(password, user?.password_hash ?? DUMMY_HASH) || !user) {
    await sql('INSERT INTO login_attempts (email) VALUES ($1)', [email])
    return { error: 'That email and password do not match.' }
  }

  await sql('DELETE FROM login_attempts WHERE email = $1', [email])
  await startSession(user.id)
  redirect('/')
}

export async function signOut() {
  await forgetDevice()
  await endSession()
  redirect('/login')
}
