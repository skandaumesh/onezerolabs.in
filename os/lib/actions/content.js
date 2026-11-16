'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { FORMATS, parsePlan, STEPS } from '@/lib/content.mjs'
import { isValidDay } from '@/lib/dates.mjs'
import { sql, tx } from '@/lib/db.mjs'
import { day, oneOf, safeUrl, text, uuid } from '@/lib/forms'
import { contentChanged } from '@/lib/notify'

const MAX_IMPORT = 120

/** One founder, both, or nobody, from the "Owner" choice. */
const owner = (form) =>
  text(form, 'owner_id') === 'both' ? { ownerId: null, forBoth: true } : { ownerId: uuid(form, 'owner_id'), forBoth: false }

const readPost = (form) => {
  const topic = text(form, 'topic')
  const postDate = day(form, 'post_date')
  if (!topic) return { error: 'Say what the post is about.' }
  if (!postDate) return { error: 'Choose the day it goes out.' }
  const link = text(form, 'link')
  if (link && !safeUrl(link)) return { error: 'The post link should be a web address, such as instagram.com/p/…' }
  return {
    topic,
    postDate,
    format: oneOf(form, 'format', FORMATS, 'carousel'),
    theme: text(form, 'theme'),
    ...owner(form),
    caption: text(form, 'caption'),
    notes: text(form, 'notes'),
    link: link ? safeUrl(link) : null,
  }
}

/** One at a time: a transaction runs one statement after another. */
const addSteps = async (t, postId, format) => {
  for (const [i, title] of STEPS[format].entries()) {
    await t.query('INSERT INTO content_steps (post_id, title, position) VALUES ($1, $2, $3)', [postId, title, i])
  }
}

export async function createContentPost(_prev, form) {
  const user = await requireUser()
  const post = readPost(form)
  if (post.error) return post
  await tx(async (t) => {
    const [row] = await t.query(
        `INSERT INTO content_posts (post_date, format, topic, theme, owner_id, for_both, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [post.postDate, post.format, post.topic, post.theme, post.ownerId, post.forBoth, user.id]
      )
    await addSteps(t, row.id, post.format)
  })
  await contentChanged()
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function updateContentPost(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  const post = readPost(form)
  if (post.error) return post
  const [row] = id
    ? await sql(
        `UPDATE content_posts SET post_date = $2, format = $3, topic = $4, theme = $5, owner_id = $6, for_both = $7,
                caption = $8, notes = $9, link = $10
         WHERE id = $1 RETURNING id`,
        [id, post.postDate, post.format, post.topic, post.theme, post.ownerId, post.forBoth, post.caption, post.notes, post.link]
      )
    : []
  if (!row) return { error: 'This post is no longer in the calendar.' }
  await contentChanged()
  revalidatePath('/', 'layout')
  return { ok: true }
}

/** Ticks a post done or not. Done posts stop reminding. */
export async function toggleContentDone(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  await sql('UPDATE content_posts SET done_at = CASE WHEN done_at IS NULL THEN now() END WHERE id = $1', [id])
  await contentChanged()
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function toggleContentStep(_prev, form) {
  await requireUser()
  await sql('UPDATE content_steps SET done = NOT done WHERE id = $1', [uuid(form, 'id')])
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function addContentStep(_prev, form) {
  await requireUser()
  const postId = uuid(form, 'post_id')
  const title = text(form, 'title')
  if (!postId) return { error: 'This post is no longer in the calendar.' }
  if (!title) return { error: 'Write the step first.' }
  await sql(
    `INSERT INTO content_steps (post_id, title, position)
     VALUES ($1, $2, COALESCE((SELECT max(position) + 1 FROM content_steps WHERE post_id = $1), 0))`,
    [postId, title]
  )
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteContentStep(_prev, form) {
  await requireUser()
  await sql('DELETE FROM content_steps WHERE id = $1', [uuid(form, 'id')])
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteContentPost(_prev, form) {
  await requireUser()
  const id = uuid(form, 'id')
  if (id) await sql('DELETE FROM content_posts WHERE id = $1', [id])
  await contentChanged()
  revalidatePath('/', 'layout')
  redirect('/content')
}

/** Adds every post from a pasted plan, with its checklist, in one go. Day 1 falls on the chosen date. */
export async function importContentPlan(_prev, form) {
  const user = await requireUser()
  const start = text(form, 'start')
  if (!start || !isValidDay(start)) return { error: 'Choose the date of Day 1.' }
  const users = await sql('SELECT id, name FROM users')
  const { posts } = parsePlan(text(form, 'plan') ?? '', users, start)
  if (!posts.length) return { error: 'No posts found. Paste rows of Day, Format, Owner and Topic, one per line.' }
  if (posts.length > MAX_IMPORT) return { error: `That’s ${posts.length} posts. Import up to ${MAX_IMPORT} at a time.` }

  await tx(async (t) => {
    for (const p of posts) {
      const [row] = await t.query(
          `INSERT INTO content_posts (post_date, format, topic, theme, owner_id, for_both, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [p.postDate, p.format, p.topic, p.theme, p.ownerId, p.forBoth, user.id]
      )
      await addSteps(t, row.id, p.format)
    }
  })
  await contentChanged()
  revalidatePath('/', 'layout')
  return { ok: true, count: posts.length }
}
