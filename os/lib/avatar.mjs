/**
 * Profile photos. The phone crops the chosen photo to a square from its middle
 * and shrinks it to AVATAR_EDGE pixels, so the server only keeps a small JPEG.
 */

export const AVATAR_EDGE = 512
export const MAX_AVATAR_BYTES = 300 * 1024

/** SQL for a user's photo version: when it last changed, as whole seconds, or null without a photo. */
export const avatarVersion = (alias = 'u') =>
  `CASE WHEN ${alias}.avatar IS NOT NULL THEN floor(extract(epoch FROM ${alias}.avatar_updated_at))::int END`

/** Where a founder's photo is served, or null if they have none. The version makes a new photo a new address. */
export const avatarUrl = (id, version) => (id && version ? `/profile/photo/${id}?v=${version}` : null)
