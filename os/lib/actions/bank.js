'use server'

import { revalidatePath } from 'next/cache'
import { logChange } from '@/lib/audit'
import { requireUser } from '@/lib/auth'
import { SHARE_PERCENT, shareOf, SPEND_CATEGORIES } from '@/lib/bank.mjs'
import { todayIST } from '@/lib/dates.mjs'
import { sql, tx } from '@/lib/db.mjs'
import { day, oneOf, text, uuid } from '@/lib/forms'
import { formatINR, parseAmount } from '@/lib/money.mjs'

const EARNING_ROW = 'id, user_id, amount::float8 AS amount, share::float8 AS share, received_on, paid_on, company_id, note'

/** Records what a partner earned, and the 25% of it for the company. */
export async function addEarning(_prev, form) {
  const user = await requireUser()
  const amount = parseAmount(form.get('amount'))
  const receivedOn = day(form, 'received_on')
  const partnerId = uuid(form, 'user_id')
  if (amount === null || amount <= 0) return { error: 'Enter the amount earned as a number, such as 10000.' }
  if (!receivedOn) return { error: 'Choose the date the money was received.' }
  if (receivedOn > todayIST()) return { error: 'The date received can’t be in the future.' }

  const [partner] = partnerId ? await sql('SELECT id, name FROM users WHERE id = $1', [partnerId]) : []
  if (!partner) return { error: 'Choose who earned it.' }
  const companyId = uuid(form, 'company_id')
  const share = shareOf(amount)
  // Ticked by default: the share goes into the bank on the day the money arrives.
  const paidOn = form.get('paid') === 'on' ? receivedOn : null

  await tx(async (t) => {
    const [row] = await t.query(
      `INSERT INTO earnings (user_id, amount, rate, share, received_on, paid_on, company_id, note, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING ${EARNING_ROW}`,
      [partner.id, amount, SHARE_PERCENT, share, receivedOn, paidOn, companyId, text(form, 'note'), user.id]
    )
    await logChange(t, user, {
      action: 'create',
      entity: 'earning',
      entityId: row.id,
      summary: `Added ${partner.name}’s earning of ${formatINR(amount)}, ${formatINR(share)} to the company${paidOn ? '' : ', still to pay in'}`,
      after: row,
    })
  })
  revalidatePath('/', 'layout')
  return { ok: true }
}

/** The share has gone into the company bank account today. */
export async function markSharePaid(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')
  const today = todayIST()
  const result = await tx(async (t) => {
    const [before] = await t.query(`SELECT ${EARNING_ROW} FROM earnings WHERE id = $1 FOR UPDATE`, [id])
    if (!before) return { error: 'This earning no longer exists.' }
    if (before.paid_on) return { ok: true }
    const paidOn = today < before.received_on ? before.received_on : today
    const [after] = await t.query(`UPDATE earnings SET paid_on = $2 WHERE id = $1 RETURNING ${EARNING_ROW}`, [id, paidOn])
    await logChange(t, user, {
      action: 'update',
      entity: 'earning',
      entityId: id,
      summary: `Paid ${formatINR(before.share)} into the company bank`,
      before,
      after,
    })
    return { ok: true }
  })
  revalidatePath('/', 'layout')
  return result
}

export async function deleteEarning(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')
  await tx(async (t) => {
    const [before] = await t.query(`SELECT ${EARNING_ROW} FROM earnings WHERE id = $1 FOR UPDATE`, [id])
    if (!before) return
    await t.query('DELETE FROM earnings WHERE id = $1', [id])
    await logChange(t, user, {
      action: 'delete',
      entity: 'earning',
      entityId: id,
      summary: `Deleted an earning of ${formatINR(before.amount)}`,
      before,
    })
  })
  revalidatePath('/', 'layout')
  return { ok: true }
}

/** Money into, or out of, the company bank account, other than the partners’ shares. */
export async function addBankEntry(_prev, form) {
  const user = await requireUser()
  const direction = text(form, 'direction') === 'out' ? 'out' : 'in'
  const amount = parseAmount(form.get('amount'))
  const entryDate = day(form, 'entry_date')
  const description = text(form, 'description')
  if (amount === null || amount <= 0) return { error: 'Enter the amount as a number, such as 1200.' }
  if (!entryDate) return { error: 'Choose the date.' }
  if (!description) return { error: direction === 'out' ? 'Say what the money was spent on.' : 'Say where the money came from.' }
  const agreed = form.get('agreed') === 'on'
  if (direction === 'out' && !agreed) {
    return { error: 'The partners agreement needs both of you to agree to every payment from the company bank.' }
  }
  const category = direction === 'out' ? oneOf(form, 'category', SPEND_CATEGORIES, 'other') : null

  await tx(async (t) => {
    const [row] = await t.query(
      `INSERT INTO bank_entries (direction, amount, entry_date, description, category, agreed_by_both, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, direction, amount::float8 AS amount, entry_date, description, category, agreed_by_both`,
      [direction, amount, entryDate, description, category, direction === 'out' && agreed, user.id]
    )
    await logChange(t, user, {
      action: 'create',
      entity: 'bank',
      entityId: row.id,
      summary: `${direction === 'out' ? 'Spent' : 'Added'} ${formatINR(amount)}: ${description}`,
      after: row,
    })
  })
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteBankEntry(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')
  await tx(async (t) => {
    const [before] = await t.query(
      'SELECT id, direction, amount::float8 AS amount, entry_date, description, category FROM bank_entries WHERE id = $1 FOR UPDATE',
      [id]
    )
    if (!before) return
    await t.query('DELETE FROM bank_entries WHERE id = $1', [id])
    await logChange(t, user, {
      action: 'delete',
      entity: 'bank',
      entityId: id,
      summary: `Deleted ${before.direction === 'out' ? 'spending' : 'money in'} of ${formatINR(before.amount)}: ${before.description}`,
      before,
    })
  })
  revalidatePath('/', 'layout')
  return { ok: true }
}
