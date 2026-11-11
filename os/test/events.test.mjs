import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { countdown, fitWithin, isJpeg, isUpcoming, photoCount } from '../lib/events.mjs'

describe('event photos', () => {
  test('only a whole JPEG is accepted', () => {
    assert.equal(isJpeg(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0xff, 0xd9])), true)
    assert.equal(isJpeg(Buffer.from('<svg onload=alert(1)>')), false)
    assert.equal(isJpeg(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a])), false) // a PNG
    assert.equal(isJpeg(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x00])), false) // cut off
  })

  test('photos shrink to fit, keeping their shape, and are never enlarged', () => {
    assert.deepEqual(fitWithin(4032, 3024, 2048), { width: 2048, height: 1536 })
    assert.deepEqual(fitWithin(3024, 4032, 480), { width: 360, height: 480 })
    assert.deepEqual(fitWithin(800, 600, 2048), { width: 800, height: 600 })
  })

  test('counts read naturally', () => {
    assert.equal(photoCount(1), '1 photo')
    assert.equal(photoCount(12), '12 photos')
  })
})

describe('upcoming events', () => {
  test('how soon an event is reads naturally', () => {
    assert.deepEqual(countdown('2026-11-11', '2026-11-11'), { text: 'Today', tone: 'soon' })
    assert.deepEqual(countdown('2026-11-12', '2026-11-11'), { text: 'Tomorrow', tone: 'soon' })
    assert.equal(countdown('2026-11-16', '2026-11-11').text, 'In 5 days')
    assert.equal(countdown('2026-12-25', '2026-11-11').text, '25 Dec')
  })
})

describe('upcoming or completed', () => {
  const today = '2026-11-11'
  const at = (h, m = 0) => h * 60 + m
  test('another day settles it', () => {
    assert.equal(isUpcoming({ happened_on: '2026-11-12' }, today, at(10)), true)
    assert.equal(isUpcoming({ happened_on: '2026-11-10', photos: [] }, today, at(10)), false)
  })
  test('today, an event with a time is upcoming until it starts', () => {
    assert.equal(isUpcoming({ happened_on: today, start_time: '18:30' }, today, at(10)), true)
    assert.equal(isUpcoming({ happened_on: today, start_time: '18:30' }, today, at(19)), false)
  })
  test('today, an event without a time is upcoming until it has photos', () => {
    assert.equal(isUpcoming({ happened_on: today, photos: [] }, today, at(10)), true)
    assert.equal(isUpcoming({ happened_on: today, photos: [{ id: 'p' }] }, today, at(10)), false)
  })
})
