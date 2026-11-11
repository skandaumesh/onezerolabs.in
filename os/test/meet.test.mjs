import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { looksLikeMeeting, parseMeetLink } from '../lib/meet.mjs'

describe('meeting tasks', () => {
  test('meeting-like names ask for a Meet link', () => {
    for (const t of ['Meeting with MRN', 'Client call', 'Catch-up with Tanisha', 'Product demo', 'Weekly sync', 'Interview a designer', 'Standup']) {
      assert.equal(looksLikeMeeting(t), true, t)
    }
    for (const t of ['Send invoice', 'Design homepage', 'Calligraphy logo']) assert.equal(looksLikeMeeting(t), false, t)
  })
})

describe('Google Meet links', () => {
  test('full links, links without https, and bare codes all work', () => {
    assert.deepEqual(parseMeetLink('https://meet.google.com/abc-defg-hij'), { link: 'https://meet.google.com/abc-defg-hij' })
    assert.deepEqual(parseMeetLink('meet.google.com/abc-defg-hij?authuser=0&pli=1'), { link: 'https://meet.google.com/abc-defg-hij' })
    assert.deepEqual(parseMeetLink('  ABC-DEFG-HIJ '), { link: 'https://meet.google.com/abc-defg-hij' })
  })

  test('empty is fine: an in-person meeting', () => {
    assert.deepEqual(parseMeetLink(''), { link: null })
    assert.deepEqual(parseMeetLink(null), { link: null })
  })

  test('other sites and tricks are refused', () => {
    for (const bad of ['https://zoom.us/j/123', 'https://meet.google.com.evil.example/abc-defg-hij', 'javascript:alert(1)', 'https://meet.google.com/', 'hello']) {
      assert.ok(parseMeetLink(bad).error, bad)
    }
  })
})
