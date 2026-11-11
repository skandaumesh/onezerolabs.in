import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { fitWithin, isJpeg, photoCount } from '../lib/events.mjs'

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
