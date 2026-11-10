import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { after, before, describe, test } from 'node:test'
import { PGlite } from '@electric-sql/pglite'
import { addDays, dueLabel, isValidDay, todayIST } from '../lib/dates.mjs'
import { migrations } from '../lib/migrations.mjs'
import { createSession, hashPassword, readSession, verifyPassword } from '../lib/session.mjs'

const SECRET = 'x'.repeat(32)

describe('sessions', () => {
  test('a valid token returns its user', () => {
    assert.equal(readSession(createSession('user-1', SECRET), SECRET), 'user-1')
  })

  test('a token signed with another secret is rejected', () => {
    assert.equal(readSession(createSession('user-1', 'y'.repeat(32)), SECRET), null)
  })

  test('a token with an edited payload is rejected', () => {
    const [, mac] = createSession('user-1', SECRET).split('.')
    const forged = Buffer.from(JSON.stringify({ uid: 'admin', exp: Date.now() + 1e9 })).toString('base64url')
    assert.equal(readSession(`${forged}.${mac}`, SECRET), null)
  })

  test('an expired token is rejected', () => {
    const issued = Date.now() - 15 * 24 * 60 * 60 * 1000
    assert.equal(readSession(createSession('user-1', SECRET, issued), SECRET), null)
  })

  test('garbage is rejected without throwing', () => {
    for (const token of [undefined, null, '', 'abc', 'a.b.c', '.']) {
      assert.equal(readSession(token, SECRET), null)
    }
  })
})

describe('server actions', () => {
  // Actions are public POST endpoints that the proxy lets through, so this check
  // is the only thing standing between the internet and the data.
  const PUBLIC_ACTIONS = new Set(['signIn', 'signOut'])
  const dir = new URL('../lib/actions/', import.meta.url)

  for (const file of readdirSync(dir)) {
    test(`every action in ${file} checks the session first`, () => {
      const source = readFileSync(new URL(file, dir), 'utf8')
      const actions = [...source.matchAll(/export async function (\w+)\([^)]*\) \{\n(.*)/g)]
      assert.ok(actions.length > 0)
      for (const [, name, firstLine] of actions) {
        if (!PUBLIC_ACTIONS.has(name)) assert.match(firstLine, /await requireUser\(\)/, name)
      }
    })
  }
})

describe('passwords', () => {
  test('only the right password verifies', () => {
    const stored = hashPassword('correct horse')
    assert.equal(verifyPassword('correct horse', stored), true)
    assert.equal(verifyPassword('wrong horse', stored), false)
  })
})

describe('dates', () => {
  test('today follows IST, not UTC', () => {
    // 20:00 UTC on 3 Nov is already 01:30 on 4 Nov in Bengaluru.
    assert.equal(todayIST(new Date('2026-11-03T20:00:00Z')), '2026-11-04')
  })

  test('adding days crosses month ends', () => {
    assert.equal(addDays('2026-11-30', 1), '2026-12-01')
  })

  test('impossible dates are not valid', () => {
    assert.equal(isValidDay('2026-02-30'), false)
    assert.equal(isValidDay('2026-02-28'), true)
    assert.equal(isValidDay('tomorrow'), false)
  })

  test('due labels show lateness', () => {
    assert.deepEqual(dueLabel('2026-11-01', '2026-11-03'), { text: '2 days late', tone: 'late' })
    assert.deepEqual(dueLabel('2026-11-02', '2026-11-03'), { text: '1 day late', tone: 'late' })
    assert.equal(dueLabel('2026-11-03', '2026-11-03').text, 'Today')
  })
})

describe('interface rules', () => {
  test('nothing uses the browser’s own dialogs, which look nothing like the app', () => {
    const files = ['app', 'components'].flatMap((dir) =>
      readdirSync(dir, { recursive: true })
        .filter((file) => /\.jsx?$/.test(file))
        .map((file) => `${dir}/${file}`)
    )
    const offenders = files.filter((file) => /window\.(confirm|alert|prompt)\(/.test(readFileSync(file, 'utf8')))
    assert.deepEqual(offenders, [])
  })
})

describe('database rules', () => {
  let db

  before(async () => {
    db = new PGlite()
    for (const m of migrations) await db.exec(m.sql)
  })
  after(() => db.close())

  const addLead = (stage, followUp) =>
    db.query('INSERT INTO companies (name, stage, next_follow_up) VALUES ($1, $2, $3)', ['Lead', stage, followUp])

  test('an open lead without a follow-up date is refused', async () => {
    await assert.rejects(addLead('new', null), /open_leads_need_follow_up/)
    await assert.rejects(addLead('negotiation', null), /open_leads_need_follow_up/)
  })

  test('an open lead with a date, or a closed one without, is accepted', async () => {
    await addLead('new', '2026-12-01')
    await addLead('won', null)
    await addLead('lost', null)
  })

  test('a client with projects cannot be deleted', async () => {
    const { rows } = await db.query(`INSERT INTO companies (name, stage) VALUES ('Client', 'won') RETURNING id`)
    await db.query(`INSERT INTO projects (company_id, name) VALUES ($1, 'Site')`, [rows[0].id])
    await assert.rejects(db.query('DELETE FROM companies WHERE id = $1', [rows[0].id]), /foreign key/)
  })

  test('a repeating task without a due date is refused', async () => {
    await assert.rejects(
      db.query(`INSERT INTO tasks (title, recurrence) VALUES ('Backup', 'monthly')`),
      /recurring_tasks_need_due_date/
    )
  })

  test('money out of the company bank needs both partners', async () => {
    await assert.rejects(
      db.query(`INSERT INTO bank_entries (direction, amount, entry_date, description) VALUES ('out', 500, '2026-11-10', 'Domain')`),
      /spending_needs_both/
    )
    await db.query(`INSERT INTO bank_entries (direction, amount, entry_date, description, agreed_by_both) VALUES ('out', 500, '2026-11-10', 'Domain', true)`)
    await db.query(`INSERT INTO bank_entries (direction, amount, entry_date, description) VALUES ('in', 5000, '2026-11-01', 'Opening balance')`)
  })

  test('an earning’s share can’t exceed it, or be paid in before it arrived', async () => {
    const [{ id }] = (await db.query(`INSERT INTO users (name, email, password_hash) VALUES ('E', 'e@bank.test', 'a:b') RETURNING id`)).rows
    await assert.rejects(
      db.query(`INSERT INTO earnings (user_id, amount, share, received_on) VALUES ($1, 100, 200, '2026-11-10')`, [id]),
      /earnings_check|share/
    )
    await assert.rejects(
      db.query(`INSERT INTO earnings (user_id, amount, share, received_on, paid_on) VALUES ($1, 100, 25, '2026-11-10', '2026-11-01')`, [id]),
      /paid_after_received/
    )
    await db.query(`INSERT INTO earnings (user_id, amount, share, received_on, paid_on) VALUES ($1, 100, 25, '2026-11-10', '2026-11-10')`, [id])
  })

  test('a task for both cannot also name one person', async () => {
    const [{ id }] = (await db.query(`INSERT INTO users (name, email, password_hash) VALUES ('X', 'x@both.test', 'a:b') RETURNING id`)).rows
    await assert.rejects(
      db.query(`INSERT INTO tasks (title, assignee_id, for_both) VALUES ('Review', $1, true)`, [id]),
      /both_means_no_one_person/
    )
    await db.query(`INSERT INTO tasks (title, for_both) VALUES ('Review', true)`)
  })
})
