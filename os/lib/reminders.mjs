/**
 * Reminders and notices for the phone app. Pure functions: what to remind whom
 * about and when, and how a notice about a task reads. The phone sets its own
 * alarms from these, so a reminder still goes off without signal.
 */

import { formatTime } from './dates.mjs'

/** A task with a date but no time is reminded about at 9 in the morning. */
export const MORNING = '09:00'
/** How far ahead the phone is told about. It asks again every time it opens, and in the background. */
export const AHEAD_DAYS = 30

/** A date and time in Bengaluru as a moment. India has no daylight saving, so +05:30 holds all year. */
export const istMoment = (day, time) => Date.parse(`${day}T${time}:00+05:30`)

/** A whole number from a string, the same every time, for the phone to name its alarm and notice by. */
export const numberFor = (key) => {
  let hash = 0x811c9dc5
  for (let i = 0; i < key.length; i++) hash = Math.imul(hash ^ key.charCodeAt(i), 0x01000193)
  return (hash >>> 0) & 0x7fffffff
}

/** Who a task reminds: whoever it is assigned to, both founders, or, if nobody, whoever added it. */
export const remindsUser = (task, userId) =>
  task.for_both || task.assignee_id === userId || (!task.assignee_id && task.created_by === userId)

/** The reminders still to come for one founder's open tasks. */
export const remindersFor = (tasks, userId, nowMs) =>
  tasks
    .filter((t) => !t.done_at && t.due_date && remindsUser(t, userId))
    .map((t) => {
      const at = istMoment(t.due_date, t.due_time ?? MORNING)
      const where = [t.company_name, t.project_name].filter(Boolean).join(' · ')
      const when = t.due_time ? `Due now, ${formatTime(t.due_time)}` : 'Due today'
      return { id: numberFor(`${t.id}@${at}`), at, title: t.title, body: where ? `${when} · ${where}` : when, url: `/tasks/${t.id}` }
    })
    .filter((r) => r.at > nowMs)
    .sort((a, b) => a.at - b.at)

const MEETING = /\b(meet|meeting|meetings|catch[- ]?up|demo|interview|visit)\b/i

/**
 * Who should hear about a task that was added or changed, and what they are
 * told. Only people newly given the task hear about it, never the person who
 * gave it, so editing a task's notes does not ping anyone again.
 */
export const assignmentNotices = ({ actor, task, before = null, users }) => {
  const people = (t) => (!t ? [] : t.for_both ? users.map((u) => u.id) : t.assignee_id ? [t.assignee_id] : [])
  const had = new Set(people(before))
  const recipients = people(task).filter((id) => id !== actor.id && !had.has(id))
  if (!recipients.length) return []

  const meeting = MEETING.test(task.title) || (task.for_both && /\bcall\b/i.test(task.title))
  const title = task.for_both
    ? meeting
      ? `${actor.name} scheduled a meeting for you both`
      : `${actor.name} added a task for you both`
    : meeting
      ? `${actor.name} scheduled a meeting with you`
      : `${actor.name} assigned you a task`
  return recipients.map((userId) => ({ userId, kind: meeting ? 'meeting' : 'task', title, url: `/tasks/${task.id}` }))
}
