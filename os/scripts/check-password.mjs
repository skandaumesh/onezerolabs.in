#!/usr/bin/env node
/**
 * Says whether a password is the one saved for a login, without changing anything.
 * For when signing in fails and it isn't clear whether the password or the typing
 * is wrong.
 *
 *   node --env-file=.env.local scripts/check-password.mjs --email you@example.com
 */

import { createInterface } from 'node:readline/promises'
import { Writable } from 'node:stream'
import { parseArgs } from 'node:util'
import { openDatabase } from '../lib/db.mjs'
import { verifyPassword } from '../lib/session.mjs'

const { values } = parseArgs({ options: { email: { type: 'string' } } })
const email = values.email?.trim().toLowerCase()
if (!email) {
  console.error('Usage: node --env-file=.env.local scripts/check-password.mjs --email you@example.com')
  process.exit(1)
}

let hidden = false
const output = new Writable({
  write(chunk, encoding, done) {
    if (!hidden) process.stdout.write(chunk, encoding)
    done()
  },
})
const rl = createInterface({ input: process.stdin, output, terminal: Boolean(process.stdin.isTTY) })
process.stdout.write(`Type the password for ${email} (hidden as you type): `)
hidden = true
const password = await rl.question('')
hidden = false
process.stdout.write('\n')
rl.close()

const db = await openDatabase()
const [user] = await db.query('SELECT password_hash FROM users WHERE email = $1', [email])
await db.close()

if (!user) {
  console.log(`There is no login for ${email}.`)
} else if (verifyPassword(password, user.password_hash)) {
  console.log('That is the saved password. If the website still refuses it, the browser is filling in something else.')
} else {
  const spaces = password !== password.trim() ? ' It starts or ends with a space.' : ''
  console.log(`That is not the saved password. You typed ${password.length} characters.${spaces}`)
}
