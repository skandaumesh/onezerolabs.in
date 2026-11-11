import 'server-only'

import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { avatarVersion } from '@/lib/avatar.mjs'
import { sql } from '@/lib/db.mjs'
import { createSession, readSession, requireSecret, SESSION_COOKIE, SESSION_DAYS } from '@/lib/session.mjs'

/** The signed-in founder, or null. The cookie alone is not enough: the user must still exist. */
export const getUser = cache(async () => {
  const store = await cookies()
  const uid = readSession(store.get(SESSION_COOKIE)?.value, requireSecret())
  if (!uid) return null
  const rows = await sql(`SELECT u.id, u.name, u.email, ${avatarVersion()} AS avatar_v FROM users u WHERE u.id = $1`, [uid])
  return rows[0] || null
})

/**
 * Every page and every action calls this. The proxy also checks the cookie, but
 * server actions are public POST endpoints, so each one guards itself as well.
 */
export const requireUser = async () => {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}

export const startSession = async (userId) => {
  const store = await cookies()
  store.set(SESSION_COOKIE, createSession(userId, requireSecret()), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
}

export const endSession = async () => {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}
