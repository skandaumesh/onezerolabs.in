'use server'

import { createHash } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { logChange } from '@/lib/audit'
import { requireUser } from '@/lib/auth'
import { sql, tx } from '@/lib/db.mjs'
import { checkFile, cleanName, freeName, keepExtension, MAX_FILE_BYTES, MAX_FILE_MB } from '@/lib/documents.mjs'
import { text, uuid } from '@/lib/forms'

// A clash with the unique name indexes.
const isTaken = (e) => e?.code === '23505'
const folderHref = (id) => (id ? `/documents/folder/${id}` : '/documents')

const folderName = (form) => {
  const name = cleanName(text(form, 'name'))
  return name ? name.slice(0, 80).trim() : null
}

/** Null for the top level, the id if that folder exists, or false if it doesn't. */
const findFolder = async (q, id) => {
  if (!id) return null
  const [row] = await q('SELECT id FROM folders WHERE id = $1', [id])
  return row ? id : false
}

const findCompany = async (q, id) => {
  if (!id) return null
  const [row] = await q('SELECT id FROM companies WHERE id = $1', [id])
  return row ? id : false
}

export async function createFolder(_prev, form) {
  const user = await requireUser()
  const name = folderName(form)
  if (!name) return { error: 'Give the folder a name.' }
  const parentId = await findFolder(sql, uuid(form, 'parent_id'))
  if (parentId === false) return { error: 'The folder this was going into no longer exists.' }

  try {
    await tx(async (t) => {
      const [row] = await t.query('INSERT INTO folders (parent_id, name, created_by) VALUES ($1, $2, $3) RETURNING id', [
        parentId,
        name,
        user.id,
      ])
      await logChange(t, user, { action: 'create', entity: 'folder', entityId: row.id, summary: `Made the folder ${name}` })
    })
  } catch (e) {
    if (isTaken(e)) return { error: `There’s already a folder called ${name} here.` }
    throw e
  }
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function renameFolder(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')
  const name = folderName(form)
  if (!name) return { error: 'Give the folder a name.' }

  try {
    const found = await tx(async (t) => {
      const [before] = await t.query('SELECT name FROM folders WHERE id = $1 FOR UPDATE', [id])
      if (!before) return false
      if (before.name === name) return true
      await t.query('UPDATE folders SET name = $2 WHERE id = $1', [id, name])
      await logChange(t, user, {
        action: 'update',
        entity: 'folder',
        entityId: id,
        summary: `Renamed the folder ${before.name} to ${name}`,
        before,
        after: { name },
      })
      return true
    })
    if (!found) return { error: 'This folder no longer exists.' }
  } catch (e) {
    if (isTaken(e)) return { error: `There’s already a folder called ${name} here.` }
    throw e
  }
  revalidatePath('/', 'layout')
  return { ok: true }
}

/** Only an empty folder can go, so nothing inside is ever lost with it. */
export async function deleteFolder(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')
  const result = await tx(async (t) => {
    const [folder] = await t.query('SELECT name, parent_id FROM folders WHERE id = $1 FOR UPDATE', [id])
    if (!folder) return { error: 'This folder no longer exists.' }
    const [{ items }] = await t.query(
      `SELECT (SELECT count(*) FROM folders WHERE parent_id = $1) + (SELECT count(*) FROM documents WHERE folder_id = $1) AS items`,
      [id]
    )
    if (Number(items) > 0) return { error: 'Move or delete what’s inside first.' }
    await t.query('DELETE FROM folders WHERE id = $1', [id])
    await logChange(t, user, { action: 'delete', entity: 'folder', entityId: id, summary: `Deleted the folder ${folder.name}`, before: folder })
    return { parentId: folder.parent_id }
  })
  if (result.error) return result
  revalidatePath('/', 'layout')
  redirect(folderHref(result.parentId))
}

/**
 * Stores one file. The browser sends them one at a time, which keeps each request
 * small and lets it show how far it has got.
 */
export async function uploadDocument(_prev, form) {
  const user = await requireUser()
  const file = form.get('file')
  if (!file || typeof file === 'string') return { error: 'Choose a file to upload.' }
  const name = cleanName(file.name) ?? 'Untitled'
  if (file.size > MAX_FILE_BYTES) return { error: `${name} is over ${MAX_FILE_MB} MB.` }

  const bytes = Buffer.from(await file.arrayBuffer())
  const checked = checkFile(name, bytes)
  if (checked.error) return { error: checked.error }
  const sha256 = createHash('sha256').update(bytes).digest('hex')

  const folderId = await findFolder(sql, uuid(form, 'folder_id'))
  if (folderId === false) return { error: 'The folder this was going into no longer exists.' }
  const companyId = await findCompany(sql, uuid(form, 'company_id'))
  if (companyId === false) return { error: 'That client no longer exists.' }

  try {
    const result = await tx(async (t) => {
      // The same file again in the same place is left alone, so uploading twice is harmless.
      const [same] = await t.query('SELECT name FROM documents WHERE folder_id IS NOT DISTINCT FROM $1::uuid AND sha256 = $2', [
        folderId,
        sha256,
      ])
      if (same) return { ok: true, skipped: true, name: same.name }

      const taken = await t.query('SELECT name FROM documents WHERE folder_id IS NOT DISTINCT FROM $1::uuid', [folderId])
      const finalName = freeName(name, taken.map((r) => r.name))
      const [row] = await t.query(
        `INSERT INTO documents (folder_id, company_id, name, mime, size, sha256, uploaded_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [folderId, companyId, finalName, checked.mime, bytes.length, sha256, user.id]
      )
      await t.query('INSERT INTO document_files (document_id, data) VALUES ($1, $2)', [row.id, bytes])
      await logChange(t, user, {
        action: 'create',
        entity: 'document',
        entityId: row.id,
        summary: `Uploaded ${finalName}`,
        after: { name: finalName, folder_id: folderId, company_id: companyId, size: bytes.length },
      })
      return { ok: true, id: row.id, name: finalName }
    })
    revalidatePath('/', 'layout')
    return result
  } catch (e) {
    // Someone else saved the same name in the same moment.
    if (isTaken(e)) return { error: `${name} couldn’t be saved just then. Try it again.` }
    throw e
  }
}

/** Renames a file, moves it to another folder, or changes its client. */
export async function updateDocument(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')
  const folderId = await findFolder(sql, uuid(form, 'folder_id'))
  if (folderId === false) return { error: 'That folder no longer exists.' }
  const companyId = await findCompany(sql, uuid(form, 'company_id'))
  if (companyId === false) return { error: 'That client no longer exists.' }

  let name
  try {
    const found = await tx(async (t) => {
      const [before] = await t.query('SELECT name, folder_id, company_id FROM documents WHERE id = $1 FOR UPDATE', [id])
      if (!before) return false
      name = keepExtension(cleanName(text(form, 'name')), before.name)
      if (!name) return { error: 'Give the file a name.' }
      const after = { name, folder_id: folderId, company_id: companyId }
      if (before.name === name && before.folder_id === folderId && before.company_id === companyId) return true

      await t.query('UPDATE documents SET name = $2, folder_id = $3, company_id = $4 WHERE id = $1', [id, name, folderId, companyId])
      const changes = [
        before.name !== name && `renamed it ${name}`,
        before.folder_id !== folderId && 'moved it',
        before.company_id !== companyId && (companyId ? 'linked a client' : 'unlinked the client'),
      ].filter(Boolean)
      const sentence = changes.join(', ')
      await logChange(t, user, {
        action: 'update',
        entity: 'document',
        entityId: id,
        summary: `${sentence[0].toUpperCase()}${sentence.slice(1)}`,
        before,
        after,
      })
      return true
    })
    if (found === false) return { error: 'This file no longer exists.' }
    if (found?.error) return found
  } catch (e) {
    if (isTaken(e)) return { error: `There’s already a file called ${name} in that folder.` }
    throw e
  }
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteDocument(_prev, form) {
  const user = await requireUser()
  const id = uuid(form, 'id')
  const folderId = await tx(async (t) => {
    const [doc] = await t.query('SELECT name, folder_id, company_id, size FROM documents WHERE id = $1 FOR UPDATE', [id])
    if (!doc) return null
    await t.query('DELETE FROM documents WHERE id = $1', [id])
    await logChange(t, user, { action: 'delete', entity: 'document', entityId: id, summary: `Deleted ${doc.name}`, before: doc })
    return doc.folder_id
  })
  revalidatePath('/', 'layout')
  redirect(folderHref(folderId))
}
