/**
 * The social media content calendar. Pure functions, used on the server and in
 * the browser: formats and their steps, reading a pasted plan, and the 5 pm
 * reminders.
 */

import { addDays } from './dates.mjs'

export const FORMATS = [
  { value: 'reel', label: 'Reel' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'post', label: 'Post' },
  { value: 'story', label: 'Story' },
]
export const FORMAT_LABEL = Object.fromEntries(FORMATS.map((f) => [f.value, f.label]))

/** The checklist a new post starts with, by format. Steps can be added or removed per post. */
export const STEPS = {
  reel: ['Hook and script', 'Shoot', 'Edit', 'Caption and hashtags', 'Post'],
  carousel: ['Outline the slides', 'Write the copy', 'Design the slides', 'Caption and hashtags', 'Post'],
  post: ['Design', 'Caption and hashtags', 'Post'],
  story: ['Make the story', 'Post'],
}

/** The time of day the reminder to create today's post goes off, in Bengaluru. */
export const CONTENT_REMINDER_TIME = '17:00'

const FORMAT_WORDS = [
  [/^reels?$/i, 'reel'],
  [/^(carousels?|slides?)$/i, 'carousel'],
  [/^(posts?|static|single|image)$/i, 'post'],
  [/^stor(y|ies)$/i, 'story'],
]
const HEADING = /^(week\s*\d+|days?\s*\d+(?:\s*[–-]\s*\d+)?)\s*[—–-]\s*(.+)$/i

/** A founder by the name written in a plan: "Skanda", "tanisha", or "Both". */
const ownerFrom = (name, users) => {
  const said = name.trim().toLowerCase()
  if (said === 'both') return { ownerId: null, forBoth: true }
  const user = users.find((u) => u.name.trim().toLowerCase() === said || u.name.trim().toLowerCase().split(/\s+/)[0] === said)
  return { ownerId: user?.id ?? null, forBoth: false, unknown: user ? null : name.trim() }
}

/**
 * Reads a plan pasted from a document or chat: week headings such as "Week 1 —
 * Things we actually do", and rows of Day, Format, Owner and Topic, separated by
 * tabs, pipes or wide spaces. Day 1 falls on `startDay`. Anything else, such as
 * an introduction or the column titles, is skipped.
 */
export const parsePlan = (text, users, startDay) => {
  const posts = []
  const problems = []
  let theme = null
  for (const raw of (text ?? '').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) continue
    const heading = line.match(HEADING)
    if (heading && !/\t|\|/.test(line)) {
      theme = `${heading[1]} — ${heading[2]}`
      continue
    }
    const cells = line
      .split(/\t|\s*\|\s*|\s{2,}/)
      .map((c) => c.trim())
      .filter(Boolean)
    if (cells.length < 4 || !/^\d+$/.test(cells[0])) continue
    const [dayText, formatText, ownerText, ...rest] = cells
    const day = Number(dayText)
    const format = FORMAT_WORDS.find(([pattern]) => pattern.test(formatText))?.[1]
    const topic = rest.join(' ').trim()
    if (!format) {
      problems.push(`Day ${day}: “${formatText}” isn’t a Reel, Carousel, Post or Story.`)
      continue
    }
    const owner = ownerFrom(ownerText, users)
    if (owner.unknown) problems.push(`Day ${day}: nobody called “${owner.unknown}”, so it has no owner.`)
    posts.push({ day, postDate: addDays(startDay, day - 1), format, topic, theme, ownerId: owner.ownerId, forBoth: owner.forBoth })
  }
  return { posts, problems }
}

/** "8 Reels and 22 Carousels" for a confirmation. */
export const planSummary = (posts) => {
  const counts = FORMATS.map((f) => [f, posts.filter((p) => p.format === f.value).length]).filter(([, n]) => n)
  return counts.map(([f, n]) => `${n} ${f.label}${n === 1 ? '' : 's'}`).join(', ').replace(/, ([^,]*)$/, ' and $1')
}

const istMoment = (day, time) => Date.parse(`${day}T${time}:00+05:30`)
const numberFor = (key) => {
  let hash = 0x811c9dc5
  for (let i = 0; i < key.length; i++) hash = Math.imul(hash ^ key.charCodeAt(i), 0x01000193)
  return (hash >>> 0) & 0x7fffffff
}

/**
 * The 5 pm reminders for posts not yet done, for one founder. Every founder is
 * reminded every day there is a post: its owner to create it, the other so
 * nothing is missed.
 */
export const contentRemindersFor = (posts, userId, users, nowMs) =>
  posts
    .filter((p) => !p.done_at && p.post_date)
    .map((p) => {
      const at = istMoment(p.post_date, CONTENT_REMINDER_TIME)
      const format = FORMAT_LABEL[p.format] ?? 'post'
      const mine = p.for_both || p.owner_id === userId || !p.owner_id
      const owner = users.find((u) => u.id === p.owner_id)?.name
      const title = mine ? `Create today’s ${format}${p.for_both ? ' together' : ''}` : `${owner}’s ${format} is due today`
      return { id: numberFor(`content:${p.id}:${userId}@${at}`), at, title, body: p.topic, url: `/content/${p.id}` }
    })
    .filter((r) => r.at > nowMs)
