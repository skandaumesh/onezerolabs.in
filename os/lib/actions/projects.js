'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { PROJECT_STATUSES } from '@/lib/constants.mjs'
import { sql } from '@/lib/db.mjs'
import { day, oneOf, text, uuid } from '@/lib/forms'

export async function createProject(_prev, form) {
  await requireUser()
  const companyId = uuid(form, 'company_id')
  const name = text(form, 'name')
  if (!companyId) return { error: 'Choose the client this project is for.' }
  if (!name) return { error: 'Enter the project name.' }

  const [row] = await sql(
    `INSERT INTO projects (company_id, name, description, status, owner_id, due_date)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [
      companyId,
      name,
      text(form, 'description'),
      oneOf(form, 'status', PROJECT_STATUSES, 'planning'),
      uuid(form, 'owner_id'),
      day(form, 'due_date'),
    ]
  )
  revalidatePath('/', 'layout')
  redirect(`/projects/${row.id}`)
}

export async function updateProject(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  const name = text(form, 'name')
  const status = oneOf(form, 'status', PROJECT_STATUSES, 'planning')
  if (!id) return { error: 'This project no longer exists.' }
  if (!name) return { error: 'Enter the project name.' }

  // The completion checklist: a project is not finished while work is open.
  if (status === 'done') {
    const [{ open }] = await sql(
      'SELECT count(*)::int AS open FROM tasks WHERE project_id = $1 AND done_at IS NULL',
      [id]
    )
    if (open > 0) {
      return { error: `${open} task${open === 1 ? ' is' : 's are'} still open. Finish or remove ${open === 1 ? 'it' : 'them'} first.` }
    }
  }

  await sql(
    `UPDATE projects
     SET name = $2, description = $3, status = $4, owner_id = $5, due_date = $6, updated_at = now()
     WHERE id = $1`,
    [id, name, text(form, 'description'), status, uuid(form, 'owner_id'), day(form, 'due_date')]
  )
  revalidatePath('/', 'layout')
  redirect(`/projects/${id}`)
}

export async function deleteProject(_prev, form) {
  await requireUser()
  await sql('DELETE FROM projects WHERE id = $1', [uuid(form, 'id')])
  revalidatePath('/', 'layout')
  redirect('/projects')
}
