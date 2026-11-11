#!/usr/bin/env node
/**
 * Create a founder's login, or reset the password of an existing one.
 *
 *   npm run user:add -- --name Skanda --email you@example.com
 *
 * Asks for the password without showing it, so it never lands on screen or in
 * shell history. With the local database, stop the dev server first: PGlite
 * allows one process at a time.
 */

import { createInterface } from 'node:readline/promises'
import { Writable } from 'node:stream'
import { parseArgs } from 'node:util'
import { openDatabase } from '../lib/db.mjs'
import { hashPassword, MIN_PASSWORD_LENGTH as MIN_LENGTH } from '../lib/session.mjs'

const { values } = parseArgs({
  options: { name: { type: 'string' }, email: { type: 'string' } },
})

const name = values.name?.trim()
const email = values.email?.trim().toLowerCase()
if (!name || !email) {
  console.error('Usage: npm run user:add -- --name Skanda --email you@example.com')
  process.exit(1)
}

// Readline echoes what is typed to its output, so that output can be switched off.
let hidden = false
const output = new Writable({
  write(chunk, encoding, done) {
    if (!hidden) process.stdout.write(chunk, encoding)
    done()
  },
})
const interactive = Boolean(process.stdin.isTTY)
const rl = createInterface({ input: process.stdin, output, terminal: interactive })

const ask = async (prompt) => {
  process.stdout.write(prompt)
  hidden = true
  const answer = await rl.question('')
  hidden = false
  process.stdout.write('\n')
  return answer
}

const password = await ask(`Password for ${email} (at least ${MIN_LENGTH} characters, hidden as you type): `)
if (password.length < MIN_LENGTH) {
  rl.close()
  console.error(`Password must be at least ${MIN_LENGTH} characters.`)
  process.exit(1)
}
// Nothing shows while typing, so a slip would otherwise lock the person out.
if (interactive && (await ask('Type it again: ')) !== password) {
  rl.close()
  console.error('Those did not match. Nothing was changed.')
  process.exit(1)
}
rl.close()

const db = await openDatabase()
await db.query(
  `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
   ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash`,
  [name, email, hashPassword(password)]
)
await db.close()
console.log(`Saved login for ${name} <${email}>.`)
