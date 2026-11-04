import { isValidDay } from '@/lib/dates.mjs'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isUuid = (v) => typeof v === 'string' && UUID.test(v)

/** A trimmed string, or null when empty. */
export const text = (form, key) => {
  const v = form.get(key)
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

/** A 'YYYY-MM-DD' string, or null when empty or not a real date. */
export const day = (form, key) => {
  const v = text(form, key)
  return v && isValidDay(v) ? v : null
}

/** An 'HH:MM' time, or null when empty or not a real time. */
export const time = (form, key) => {
  const v = text(form, key)
  return v && /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v) ? v.slice(0, 5) : null
}

export const uuid = (form, key) => {
  const v = text(form, key)
  return isUuid(v) ? v : null
}

/** The value if it is one of the allowed options, otherwise the fallback. */
export const oneOf = (form, key, options, fallback) => {
  const v = text(form, key)
  return options.some((o) => o.value === v) ? v : fallback
}

/**
 * A website as a safe link, or null. Without this a stored "javascript:..." value
 * would run when the link is clicked.
 */
export const safeUrl = (value) => {
  if (!value) return null
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}
