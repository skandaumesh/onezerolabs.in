/**
 * Dates. The founders work in IST but the server may run in UTC, where "today"
 * is still yesterday until 05:30 IST. So today always comes from todayIST(), and
 * due dates stay plain 'YYYY-MM-DD' strings that never pass through a timezone.
 */

const TZ = 'Asia/Kolkata'

export const todayIST = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(now)

export const hourIST = (now = new Date()) =>
  Number(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hour12: false }).format(now)) % 24

/** Minutes since midnight in IST. */
export const minutesIST = (now = new Date()) => {
  const [hour, minute] = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false })
    .format(now)
    .split(':')
    .map(Number)
  return (hour % 24) * 60 + minute
}

/** '19:00' or '19:00:00' -> '7:00 pm'. */
export const formatTime = (time) => {
  const [hour, minute] = time.split(':').map(Number)
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'am' : 'pm'}`
}

const toUTC = (day) => new Date(`${day}T00:00:00Z`)

export const addDays = (day, n) => {
  const d = toUTC(day)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export const daysBetween = (from, to) => Math.round((toUTC(to) - toUTC(from)) / 86400000)

export const isValidDay = (s) =>
  /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(toUTC(s).getTime()) && toUTC(s).toISOString().startsWith(s)

/** '2026-11-03' -> '3 Nov', with the year only when it is not the current one. */
export const formatDay = (day, today = todayIST()) => {
  const options = { day: 'numeric', month: 'short', timeZone: 'UTC' }
  if (day.slice(0, 4) !== today.slice(0, 4)) options.year = 'numeric'
  return new Intl.DateTimeFormat('en-GB', options).format(toUTC(day))
}

export const formatDateTime = (value) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(value))

/** How a due date reads and how urgent it looks. */
export const dueLabel = (day, today = todayIST(), time = null, minutesNow = minutesIST()) => {
  const diff = daysBetween(today, day)
  const at = time ? `, ${formatTime(time)}` : ''
  if (diff < 0) return { text: `${-diff} day${diff === -1 ? '' : 's'} late`, tone: 'late' }
  if (diff === 0) {
    const [hour, minute] = time ? time.split(':').map(Number) : [24, 0]
    // Today's 7 pm turns red once 7 pm has gone.
    return { text: `Today${at}`, tone: hour * 60 + minute < minutesNow ? 'late' : 'soon' }
  }
  if (diff === 1) return { text: `Tomorrow${at}`, tone: 'soon' }
  return { text: `${formatDay(day, today)}${at}`, tone: 'plain' }
}

/** How long ago a moment was: "Just now", "5 min ago", "4:30 pm", "Yesterday", or the date. */
export const ago = (value, now = new Date()) => {
  const then = new Date(value)
  const minutes = Math.floor((now - then) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const day = todayIST(then)
  const today = todayIST(now)
  if (day === today) return formatDateTime(then).split(', ').pop()
  if (daysBetween(day, today) === 1) return 'Yesterday'
  return formatDay(day, today)
}
