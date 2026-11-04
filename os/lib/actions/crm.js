'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { isOpenStage, NOTE_KINDS, SOURCES, STAGES } from '@/lib/constants.mjs'
import { todayIST } from '@/lib/dates.mjs'
import { sql, tx } from '@/lib/db.mjs'
import { day, oneOf, text, uuid } from '@/lib/forms'

const FOLLOW_UP_RULE = 'An open lead needs a next follow-up date. Set one, or mark it Won or Lost.'

const companyFields = (form) => ({
  name: text(form, 'name'),
  sector: text(form, 'sector'),
  website: text(form, 'website'),
  address: text(form, 'address'),
  services: text(form, 'services'),
  stage: oneOf(form, 'stage', STAGES, 'new'),
  source: oneOf(form, 'source', SOURCES, null),
  lostReason: text(form, 'lost_reason'),
  nextFollowUp: day(form, 'next_follow_up'),
  ownerId: uuid(form, 'owner_id'),
})

const checkCompany = (f) => {
  if (!f.name) return 'Enter the company name.'
  if (isOpenStage(f.stage) && !f.nextFollowUp) return FOLLOW_UP_RULE
  return null
}

export async function createCompany(_prev, form) {
  await requireUser()
  const f = companyFields(form)
  const error = checkCompany(f)
  if (error) return { error }
  if (f.nextFollowUp && f.nextFollowUp < todayIST()) return { error: 'The next follow-up cannot be in the past.' }

  const id = await tx(async (t) => {
    const [row] = await t.query(
      `INSERT INTO companies (name, sector, website, address, services, stage, source, lost_reason, next_follow_up, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [f.name, f.sector, f.website, f.address, f.services, f.stage, f.source, f.lostReason, f.nextFollowUp, f.ownerId]
    )
    const contactName = text(form, 'contact_name')
    if (contactName) {
      await t.query(
        'INSERT INTO contacts (company_id, name, role, email, phone) VALUES ($1, $2, $3, $4, $5)',
        [row.id, contactName, text(form, 'contact_role'), text(form, 'contact_email'), text(form, 'contact_phone')]
      )
    }
    return row.id
  })

  revalidatePath('/', 'layout')
  redirect(`/clients/${id}`)
}

export async function updateCompany(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  const f = companyFields(form)
  const error = checkCompany(f)
  if (error) return { error }

  await sql(
    `UPDATE companies
     SET name = $2, sector = $3, website = $4, address = $5, services = $6, stage = $7, source = $8,
         lost_reason = $9, next_follow_up = $10, owner_id = $11, updated_at = now()
     WHERE id = $1`,
    [id, f.name, f.sector, f.website, f.address, f.services, f.stage, f.source, f.lostReason, f.nextFollowUp, f.ownerId]
  )

  revalidatePath('/', 'layout')
  redirect(`/clients/${id}`)
}

/** Moves a card on the pipeline board. */
export async function moveStage(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  const stage = oneOf(form, 'stage', STAGES, null)
  if (!id || !stage) return { error: 'Choose a stage.' }

  const [company] = await sql('SELECT next_follow_up FROM companies WHERE id = $1', [id])
  if (!company) return { error: 'This record no longer exists.' }
  if (isOpenStage(stage) && !company.next_follow_up) return { error: FOLLOW_UP_RULE }

  await sql('UPDATE companies SET stage = $2, updated_at = now() WHERE id = $1', [id, stage])
  revalidatePath('/', 'layout')
  return { ok: true }
}

/** Sets the next follow-up, optionally recording what just happened. */
export async function scheduleFollowUp(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')
  const next = day(form, 'next_follow_up')
  const note = text(form, 'note')
  if (!id) return { error: 'This record no longer exists.' }
  if (!next) return { error: 'Choose the next follow-up date.' }
  if (next < todayIST()) return { error: 'The next follow-up cannot be in the past.' }

  await tx(async (t) => {
    await t.query('UPDATE companies SET next_follow_up = $2, updated_at = now() WHERE id = $1', [id, next])
    if (note) {
      await t.query(
        `INSERT INTO notes (company_id, author_id, kind, body) VALUES ($1, $2, 'conversation', $3)`,
        [id, user.id, note]
      )
    }
  })

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteCompany(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  const [{ projects }] = await sql('SELECT count(*)::int AS projects FROM projects WHERE company_id = $1', [id])
  if (projects > 0) {
    return { error: `This client has ${projects} project${projects === 1 ? '' : 's'}. Delete those first.` }
  }
  const [{ income }] = await sql('SELECT count(*)::int AS income FROM income WHERE company_id = $1', [id])
  if (income > 0) return { error: 'This client has income on record. Delete it on the Revenue page first.' }
  await sql('DELETE FROM companies WHERE id = $1', [id])
  revalidatePath('/', 'layout')
  redirect('/clients')
}

export async function addContact(_prev, form) {
  await requireUser()
  const companyId = uuid(form, 'company_id')
  const name = text(form, 'name')
  if (!companyId) return { error: 'This record no longer exists.' }
  if (!name) return { error: 'Enter the contact’s name.' }

  await sql(
    'INSERT INTO contacts (company_id, name, role, email, phone) VALUES ($1, $2, $3, $4, $5)',
    [companyId, name, text(form, 'role'), text(form, 'email'), text(form, 'phone')]
  )
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteContact(_prev, form) {
  await requireUser()
  await sql('DELETE FROM contacts WHERE id = $1', [uuid(form, 'id')])
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function addNote(_prev, form) {
  const user = await requireUser()
  const companyId = uuid(form, 'company_id')
  const body = text(form, 'body')
  if (!companyId) return { error: 'This record no longer exists.' }
  if (!body) return { error: 'Write the note first.' }

  await sql(
    'INSERT INTO notes (company_id, author_id, kind, body) VALUES ($1, $2, $3, $4)',
    [companyId, user.id, oneOf(form, 'kind', NOTE_KINDS, 'conversation'), body]
  )
  revalidatePath('/', 'layout')
  return { ok: true }
}
