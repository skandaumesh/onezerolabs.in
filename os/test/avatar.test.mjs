import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { avatarUrl } from '../lib/avatar.mjs'

describe('profile photos', () => {
  test('a photo’s address changes when the photo does', () => {
    assert.equal(avatarUrl('u1', 1794457800), '/profile/photo/u1?v=1794457800')
    assert.notEqual(avatarUrl('u1', 1794457800), avatarUrl('u1', 1794457900))
  })

  test('no photo, no address', () => {
    assert.equal(avatarUrl('u1', null), null)
    assert.equal(avatarUrl(null, 5), null)
  })
})
