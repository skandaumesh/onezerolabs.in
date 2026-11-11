/**
 * Google Meet links on tasks. A task whose name sounds like a meeting asks for
 * one; what is pasted is checked and tidied into a plain https link.
 */

const MEETING = /\b(meet|meeting|meetings|call|calls|catch[- ]?up|demo|interview|sync|stand-?up|discussion)\b/i
const CODE = /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/

/** Whether a task's name sounds like a meeting, so the form asks for a Meet link. */
export const looksLikeMeeting = (title) => MEETING.test(title ?? '')

/**
 * A Google Meet link from what was typed: a full link, one without https://, or
 * just the code such as abc-defg-hij. Anything else is refused, so a task can
 * never carry a link to some other site.
 */
export const parseMeetLink = (typed) => {
  const value = (typed ?? '').trim()
  if (!value) return { link: null }
  if (CODE.test(value.toLowerCase())) return { link: `https://meet.google.com/${value.toLowerCase()}` }
  try {
    const url = new URL(/^[a-z]+:\/\//i.test(value) ? value : `https://${value}`)
    const path = url.pathname.replace(/\/+$/, '')
    if ((url.protocol === 'https:' || url.protocol === 'http:') && url.hostname === 'meet.google.com' && /^\/[\w-]{3,}(\/[\w-]+)*$/.test(path)) {
      return { link: `https://meet.google.com${path}` }
    }
  } catch {}
  return { error: 'That isn’t a Google Meet link. Paste one like meet.google.com/abc-defg-hij, or leave it empty.' }
}

/** Where "New Meet" goes: Google makes a fresh meeting there and shows its link. */
export const NEW_MEET = 'https://meet.google.com/new'
