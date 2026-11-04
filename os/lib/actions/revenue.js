'use server'

import { revalidatePath } from 'next/cache'
import { logChange } from '@/lib/audit'
import { requireUser } from '@/lib/auth'
import { INCOME_KINDS } from '@/lib/constants.mjs'
import { tx } from '@/lib/db.mjs'
import { oneOf, text, uuid } from '@/lib/forms'
import { formatINR, parseAmount } from '@/lib/money.mjs'

/** Reads and checks the form. Returns { error } or the clean fields. */
const incomeFields = (form) => {
  const companyId = uuid(form, 'company_id')
  const kind = oneOf(form, 'kind', INCOME_KINDS, null)
  const description = text(form, 'description')
  const amount = parseAmount(text(form, 'amount'))
  const receivedText = text(form, 'received')
  const received = receivedText === null ? null : parseAmount(receivedText)

  if (!companyId) return { error: 'Choose the client.' }
  if (!kind) return { error: 'Choose the type of income.' }
  if (!description) return { error: 'Say what this income is for.' }
  if (!amount) return { error: 'Enter the amount as a number, such as 35000.' }
  if (receivedText !== null && received === null) return { error: 'Enter the received amount as a number, or leave it blank.' }

  // A monthly fee has no single total received, so anything typed there is dropped.
  return { companyId, kind, description, amount, received: kind === 'monthly' ? null : received }
}

const INCOME_ROW = `id, company_id, kind, description, amount::float8 AS amount, received::float8 AS received`

export async function createIncome(_prev, form) {
  const user = await requireUser()
  const f = incomeFields(form)
  if (f.error) return f

  await tx(async (t) => {
    const [row] = await t.query(
      `INSERT INTO income (company_id, kind, description, amount, received)
       VALUES ($1, $2, $3, $4, $5) RETURNING ${INCOME_ROW}`,
      [f.companyId, f.kind, f.description, f.amount, f.received]
    )
    await logChange(t, user, {
      action: 'create',
      entity: 'income',
      entityId: row.id,
      summary: `Added ${f.description}, ${formatINR(f.amount)}`,
      after: row,
    })
  })
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function updateIncome(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')
  if (!id) return { error: 'This income no longer exists.' }
  const f = incomeFields(form)
  if (f.error) return f

  await tx(async (t) => {
    const [before] = await t.query(`SELECT ${INCOME_ROW} FROM income WHERE id = $1`, [id])
    const [after] = await t.query(
      `UPDATE income
       SET company_id = $2, kind = $3, description = $4, amount = $5, received = $6, updated_at = now()
       WHERE id = $1 RETURNING ${INCOME_ROW}`,
      [id, f.companyId, f.kind, f.description, f.amount, f.received]
    )
    await logChange(t, user, {
      action: 'update',
      entity: 'income',
      entityId: id,
      summary: `Changed ${f.description}`,
      before,
      after,
    })
  })
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteIncome(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')

  await tx(async (t) => {
    const [before] = await t.query(`SELECT ${INCOME_ROW} FROM income WHERE id = $1`, [id])
    if (!before) return
    await t.query('DELETE FROM income WHERE id = $1', [id])
    await logChange(t, user, {
      action: 'delete',
      entity: 'income',
      entityId: id,
      summary: `Deleted ${before.description}, ${formatINR(before.amount)}`,
      before,
    })
  })
  revalidatePath('/', 'layout')
  return { ok: true }
}
