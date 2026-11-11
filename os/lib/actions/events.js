'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { sql } from '@/lib/db.mjs'
import { isJpeg, MAX_PHOTO_BYTES, MAX_PHOTOS_PER_EVENT, MAX_THUMB_BYTES } from '@/lib/events.mjs'
import { day, text, uuid } from '@/lib/forms'

const readEvent = (form) => {
  const title = text(form, 'title')
  const happenedOn = day(form, 'happened_on')
  if (!title) return { error: 'Give the event a name.' }
  if (!happenedOn) return { error: 'Choose the date of the event.' }
  return { title, happenedOn, place: text(form, 'place'), description: text(form, 'description') }
}

/** Saves an event and returns its id, so the photos picked with it can follow. */
export async function createEvent(_prev, form) {
  const user = await requireUser()
  const event = readEvent(form)
  if (event.error) return event
  const [row] = await sql(
    `INSERT INTO events (title, happened_on, place, description, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [event.title, event.happenedOn, event.place, event.description, user.id]
  )
  revalidatePath('/', 'layout')
  return { ok: true, id: row.id }
}

export async function updateEvent(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  const event = readEvent(form)
  if (event.error) return event
  const [row] = id
    ? await sql(`UPDATE events SET title = $2, happened_on = $3, place = $4, description = $5 WHERE id = $1 RETURNING id`, [
        id,
        event.title,
        event.happenedOn,
        event.place,
        event.description,
      ])
    : []
  if (!row) return { error: 'This event no longer exists.' }
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteEvent(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  if (id) await sql('DELETE FROM events WHERE id = $1', [id])
  revalidatePath('/', 'layout')
  redirect('/events')
}

const bytesOf = async (form, key) => {
  const file = form.get(key)
  return file && typeof file === 'object' && 'arrayBuffer' in file ? Buffer.from(await file.arrayBuffer()) : null
}

/** One photo, already shrunk on the phone: a full copy and a small one. */
export async function addEventPhoto(_prev, form) {
  const user = await requireUser()
  const eventId = uuid(form, 'event_id')
  const width = Number(form.get('width'))
  const height = Number(form.get('height'))
  const [photo, thumb] = await Promise.all([bytesOf(form, 'photo'), bytesOf(form, 'thumb')])
  if (!eventId) return { error: 'This event no longer exists.' }
  if (!photo || !thumb || !isJpeg(photo) || !isJpeg(thumb)) return { error: 'That photo could not be read.' }
  if (photo.length > MAX_PHOTO_BYTES || thumb.length > MAX_THUMB_BYTES) return { error: 'That photo is too large.' }
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 10000 || height > 10000) {
    return { error: 'That photo could not be read.' }
  }

  const [event] = await sql('SELECT id, (SELECT count(*)::int FROM event_photos p WHERE p.event_id = e.id) AS photos FROM events e WHERE id = $1', [eventId])
  if (!event) return { error: 'This event no longer exists.' }
  if (event.photos >= MAX_PHOTOS_PER_EVENT) return { error: `An event can hold up to ${MAX_PHOTOS_PER_EVENT} photos.` }

  await sql(
    `INSERT INTO event_photos (event_id, data, thumb, width, height, bytes, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [eventId, photo, thumb, width, height, photo.length, user.id]
  )
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteEventPhoto(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  if (id) await sql('DELETE FROM event_photos WHERE id = $1', [id])
  revalidatePath('/', 'layout')
  return { ok: true }
}
