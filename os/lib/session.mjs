/**
 * Signed session tokens and password hashing. Plain Node crypto, no framework
 * imports, so the request proxy, the login action, the user script and the tests
 * all share one implementation.
 */

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export const SESSION_COOKIE = 'os_session'
export const SESSION_DAYS = 14
export const MIN_PASSWORD_LENGTH = 10

const sign = (payload, secret) => createHmac('sha256', secret).update(payload).digest('base64url')

export const requireSecret = (secret = process.env.SESSION_SECRET) => {
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be set to at least 32 characters. See os/.env.example.')
  }
  return secret
}

export const createSession = (userId, secret, now = Date.now()) => {
  const exp = now + SESSION_DAYS * 24 * 60 * 60 * 1000
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp })).toString('base64url')
  return `${payload}.${sign(payload, secret)}`
}

/** Returns the user id, or null for anything forged, malformed or expired. */
export const readSession = (token, secret, now = Date.now()) => {
  if (typeof token !== 'string') return null
  const [payload, mac, extra] = token.split('.')
  if (!payload || !mac || extra !== undefined) return null

  const expected = Buffer.from(sign(payload, secret))
  const given = Buffer.from(mac)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null

  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return typeof uid === 'string' && typeof exp === 'number' && exp > now ? uid : null
  } catch {
    return null
  }
}

export const hashPassword = (password) => {
  const salt = randomBytes(16)
  return `${salt.toString('hex')}:${scryptSync(password, salt, 64).toString('hex')}`
}

export const verifyPassword = (password, stored) => {
  const [salt, hash] = String(stored).split(':')
  if (!salt || !hash) return false
  const expected = Buffer.from(hash, 'hex')
  const actual = scryptSync(password, Buffer.from(salt, 'hex'), 64)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}
