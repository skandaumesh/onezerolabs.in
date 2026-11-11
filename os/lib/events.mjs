/**
 * Event photos. The phone shrinks each photo before it is sent, to a full copy
 * no longer than FULL_EDGE pixels and a small one for lists, both JPEG. The
 * server only checks that what arrives really is a JPEG of a sensible size.
 */

export const FULL_EDGE = 2048
export const THUMB_EDGE = 480
export const FULL_QUALITY = 0.82
export const THUMB_QUALITY = 0.72

export const MAX_PHOTO_BYTES = 4 * 1024 * 1024
export const MAX_THUMB_BYTES = 400 * 1024
export const MAX_PHOTOS_PER_EVENT = 60

/** A JPEG starts FF D8 FF and ends FF D9. Anything else is refused. */
export const isJpeg = (bytes) =>
  bytes.length > 4 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff && bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9

/** The size a photo is drawn at so its longest edge is at most `edge`, never enlarged. */
export const fitWithin = (width, height, edge) => {
  const scale = Math.min(1, edge / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

export const photoCount = (n) => (n === 1 ? '1 photo' : `${n} photos`)
