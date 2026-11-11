/**
 * Event photos. The phone shrinks each photo before it is sent, to a full copy
 * no longer than FULL_EDGE pixels and a small one for lists, both JPEG. The
 * server only checks that what arrives really is a JPEG of a sensible size.
 */

import { daysBetween, formatDay } from './dates.mjs'

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

/** How soon an upcoming event is: "Today", "Tomorrow", "In 5 days", or its date. */
export const countdown = (day, today) => {
  const diff = daysBetween(today, day)
  if (diff <= 0) return { text: 'Today', tone: 'soon' }
  if (diff === 1) return { text: 'Tomorrow', tone: 'soon' }
  if (diff < 14) return { text: `In ${diff} days`, tone: 'plain' }
  return { text: formatDay(day, today), tone: 'plain' }
}

/**
 * Whether an event is still to come. Another day settles it. On the day itself,
 * an event with a start time is upcoming until that time; one without a time is
 * upcoming until it has photos, which is how a finished event gets added.
 */
export const isUpcoming = (event, today, minutesNow) => {
  if (event.happened_on !== today) return event.happened_on > today
  if (event.start_time) {
    const [h, m] = event.start_time.split(':').map(Number)
    return h * 60 + m > minutesNow
  }
  return !(event.photos?.length > 0)
}
