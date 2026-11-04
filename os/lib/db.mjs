/**
 * Database access. One small interface over two engines:
 *
 *   DATABASE_URL set   -> a real Postgres server (what a deployment must use)
 *   DATABASE_URL empty -> PGlite, Postgres running in-process, stored in .data/
 *
 * Both are Postgres, so the SQL is identical and local use needs no account.
 * PGlite allows one process at a time: stop the dev server before running a
 * script against the local database.
 */

import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { migrations } from './migrations.mjs'

// Return DATE columns as 'YYYY-MM-DD'. Parsed into a JS Date they carry the
// server's timezone, and a due date can then shift by a day.
const DATE_OID = 1082
const ADVISORY_LOCK = 727401

const openPostgres = async (url) => {
  const { default: pg } = await import('pg')
  pg.types.setTypeParser(DATE_OID, (v) => v)
  const pool = new pg.Pool({ connectionString: url, max: 3 })
  // Without a listener, a dropped idle connection takes the whole server down.
  pool.on('error', (err) => console.error('Idle database connection failed:', err.message))
  const wrap = (c) => ({
    query: (text, params) => c.query(text, params).then((r) => r.rows),
    exec: (text) => c.query(text),
  })
  return {
    ...wrap(pool),
    tx: async (fn) => {
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        const out = await fn(wrap(client))
        await client.query('COMMIT')
        return out
      } catch (err) {
        await client.query('ROLLBACK')
        throw err
      } finally {
        client.release()
      }
    },
    close: () => pool.end(),
  }
}

const openPglite = async (dir) => {
  const { PGlite } = await import('@electric-sql/pglite')
  if (!dir.startsWith('memory://')) mkdirSync(dir, { recursive: true })
  const pg = new PGlite(dir, { parsers: { [DATE_OID]: (v) => v } })
  const wrap = (c) => ({
    query: (text, params) => c.query(text, params).then((r) => r.rows),
    exec: (text) => c.exec(text),
  })
  return {
    ...wrap(pg),
    tx: (fn) => pg.transaction((t) => fn(wrap(t))),
    close: () => pg.close(),
  }
}

/** Apply any migrations not yet run. The lock makes concurrent cold starts safe. */
export const migrate = (db) =>
  db.tx(async (t) => {
    await t.query(`SELECT pg_advisory_xact_lock(${ADVISORY_LOCK})`)
    await t.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version int PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`)
    const rows = await t.query('SELECT version FROM schema_migrations')
    const done = new Set(rows.map((r) => r.version))
    for (const m of migrations) {
      if (done.has(m.version)) continue
      await t.exec(m.sql)
      await t.query('INSERT INTO schema_migrations (version) VALUES ($1)', [m.version])
    }
  })

export const openDatabase = async () => {
  if (!process.env.DATABASE_URL && process.env.VERCEL) {
    throw new Error('DATABASE_URL is not set on this deployment. Add it in the Vercel project settings.')
  }
  const db = process.env.DATABASE_URL
    ? await openPostgres(process.env.DATABASE_URL)
    : await openPglite(process.env.PGLITE_DIR || path.join(process.cwd(), '.data', 'pg'))
  await migrate(db)
  return db
}

/**
 * The shared connection. Kept on globalThis because dev hot reload re-runs this
 * module, and a second PGlite on the same folder would fail. A failed open is
 * not cached, so the next request retries.
 */
export const getDb = () => {
  globalThis.__osDb ??= openDatabase().catch((err) => {
    globalThis.__osDb = null
    throw err
  })
  return globalThis.__osDb
}

/** Run one statement and return its rows. */
export const sql = async (text, params) => (await getDb()).query(text, params)

/** Run several statements atomically. */
export const tx = async (fn) => (await getDb()).tx(fn)
