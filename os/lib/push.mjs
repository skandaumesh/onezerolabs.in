/**
 * Sends push messages to the Android app through Firebase Cloud Messaging.
 *
 * Off until FCM_SERVICE_ACCOUNT holds the Firebase service account's JSON key.
 * Until then nothing is sent and nothing fails: the app also checks for news by
 * itself every 15 minutes, so a push only makes notices arrive sooner.
 */

import { createSign } from 'node:crypto'
import { sql } from './db.mjs'

const FCM_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
let account
let cachedToken = null

const loadAccount = () => {
  if (account !== undefined) return account
  try {
    const parsed = process.env.FCM_SERVICE_ACCOUNT ? JSON.parse(process.env.FCM_SERVICE_ACCOUNT) : null
    account = parsed?.client_email && parsed?.private_key && parsed?.project_id ? parsed : null
  } catch {
    account = null
  }
  return account
}

export const pushReady = () => Boolean(loadAccount())

/** A short-lived Google access token, from a JWT signed with the service account's key. */
const accessToken = async () => {
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.value
  const { client_email: email, private_key: key, token_uri: tokenUri = 'https://oauth2.googleapis.com/token' } = loadAccount()
  const now = Math.floor(Date.now() / 1000)
  const part = (value) => Buffer.from(JSON.stringify(value)).toString('base64url')
  const unsigned = `${part({ alg: 'RS256', typ: 'JWT' })}.${part({ iss: email, scope: FCM_SCOPE, aud: tokenUri, iat: now, exp: now + 3600 })}`
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key, 'base64url')

  const response = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}` }),
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) throw new Error(`Google refused the push key (${response.status})`)
  const json = await response.json()
  cachedToken = { value: json.access_token, expires: Date.now() + json.expires_in * 1000 }
  return cachedToken.value
}

/**
 * Sends `data` to every phone of these founders. Never throws: a lost push is
 * picked up by the app's own check. Phones that have uninstalled the app are
 * forgotten.
 */
export const pushTo = async (userIds, data) => {
  if (!pushReady() || !userIds.length) return
  try {
    const devices = await sql('SELECT id, token FROM devices WHERE user_id = ANY($1::uuid[])', [userIds])
    if (!devices.length) return
    const bearer = await accessToken()
    const strings = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v ?? '')]))
    await Promise.all(
      devices.map(async (device) => {
        const response = await fetch(`https://fcm.googleapis.com/v1/projects/${loadAccount().project_id}/messages:send`, {
          method: 'POST',
          headers: { authorization: `Bearer ${bearer}`, 'content-type': 'application/json' },
          body: JSON.stringify({ message: { token: device.token, data: strings, android: { priority: 'HIGH', ttl: '86400s' } } }),
          signal: AbortSignal.timeout(8000),
        })
        if (response.ok) return
        const detail = await response.text()
        if (response.status === 404 || /UNREGISTERED|registration-token-not-registered/.test(detail)) {
          await sql('DELETE FROM devices WHERE id = $1', [device.id])
        } else {
          console.error(`Push to a phone failed (${response.status})`)
        }
      })
    )
  } catch (error) {
    console.error('Push failed:', error.message)
  }
}
