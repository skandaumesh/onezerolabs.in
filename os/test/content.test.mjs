import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { contentRemindersFor, parsePlan, planSummary, STEPS } from '../lib/content.mjs'

const USERS = [{ id: 's', name: 'Skanda' }, { id: 't', name: 'Tanisha Karve' }]
const PLAN = [
  'OneZeroLabs — 30-day content calendar',
  'Posting plan: 2 Reels every week.',
  'Week 1 — Things we actually do',
  'Day\tFormat\tOwner\tTopic',
  '1\tCarousel\tSkanda\tA client wants a website. What do we do first?',
  '2\tReel\tSkanda\tFrom a client’s first message to the first demo',
  '3\tCarousel\tTanisha\tBefore making posts, what do we collect?',
  '',
  'Week 2 — Things we learned while doing the work',
  '8\tCarousel\tSkanda\t5 things I check before making a website live',
  'Days 29–30 — More personal, still useful',
  '21\tCarousel\tBoth\tHow we manage client work between tech and marketing',
].join('\n')

describe('reading a pasted plan', () => {
  const { posts, problems } = parsePlan(PLAN, USERS, '2026-11-16')

  test('every row becomes a post, and the rest is skipped', () => {
    assert.equal(posts.length, 5)
    assert.deepEqual(problems, [])
  })

  test('day 1 is the start date, and later days follow it', () => {
    assert.equal(posts[0].postDate, '2026-11-16')
    assert.equal(posts[3].postDate, '2026-11-23') // day 8
  })

  test('formats, owners by first name, and Both are read', () => {
    assert.deepEqual(posts.map((p) => p.format), ['carousel', 'reel', 'carousel', 'carousel', 'carousel'])
    assert.equal(posts[2].ownerId, 't')
    assert.deepEqual([posts[4].ownerId, posts[4].forBoth], [null, true])
  })

  test('each post keeps its week heading', () => {
    assert.equal(posts[0].theme, 'Week 1 — Things we actually do')
    assert.equal(posts[3].theme, 'Week 2 — Things we learned while doing the work')
    assert.equal(posts[4].theme, 'Days 29–30 — More personal, still useful')
  })

  test('pipes and wide spaces work as well as tabs', () => {
    const { posts: p } = parsePlan('1 | Reel | Skanda | A demo\n2    Carousel    Tanisha    Tips', USERS, '2026-11-16')
    assert.deepEqual(p.map((x) => [x.format, x.topic]), [['reel', 'A demo'], ['carousel', 'Tips']])
  })

  test('an unknown format or owner is reported, not guessed', () => {
    const { posts: p, problems: why } = parsePlan('1\tPodcast\tSkanda\tTalk\n2\tReel\tRahul\tShoot', USERS, '2026-11-16')
    assert.equal(p.length, 1)
    assert.equal(why.length, 2)
  })

  test('a summary reads naturally', () => {
    assert.equal(planSummary(posts), '1 Reel and 4 Carousels')
  })

  test('every format starts with a checklist ending in Post', () => {
    for (const steps of Object.values(STEPS)) assert.equal(steps.at(-1), 'Post')
  })
})

describe('5 pm reminders', () => {
  const now = Date.parse('2026-11-16T10:00:00+05:30')
  const post = (fields) => ({ id: 'p1', post_date: '2026-11-16', format: 'reel', topic: 'Demo day', owner_id: 's', for_both: false, done_at: null, ...fields })

  test('the owner is reminded at 5 pm to create it', () => {
    const [r] = contentRemindersFor([post({})], 's', USERS, now)
    assert.equal(r.at, Date.parse('2026-11-16T17:00:00+05:30'))
    assert.equal(r.title, 'Create today’s Reel')
    assert.equal(r.body, 'Demo day')
    assert.equal(r.url, '/content/p1')
  })

  test('the other founder hears whose post it is', () => {
    assert.equal(contentRemindersFor([post({})], 't', USERS, now)[0].title, 'Skanda’s Reel is due today')
  })

  test('a post for both reminds both to make it together', () => {
    assert.equal(contentRemindersFor([post({ owner_id: null, for_both: true })], 't', USERS, now)[0].title, 'Create today’s Reel together')
  })

  test('done posts and past 5 pms are left out', () => {
    assert.equal(contentRemindersFor([post({ done_at: '2026-11-16T08:00:00Z' })], 's', USERS, now).length, 0)
    assert.equal(contentRemindersFor([post({ post_date: '2026-11-15' })], 's', USERS, now).length, 0)
  })
})
