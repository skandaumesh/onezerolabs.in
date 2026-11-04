/**
 * Turns a spoken or typed sentence into a task: "I have meeting today at 7" becomes
 * Meeting, today, 7:00 pm. Plain rules with no outside service, so it is instant,
 * free, and sends nothing anywhere. Runs in the browser for the live preview and on
 * the server when saving, so both always agree.
 */

import { addDays, daysBetween, formatDay, formatTime, isValidDay } from './dates.mjs'

const NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 }
const NUMBER = Object.keys(NUMBER_WORDS).join('|')
const MINUTE_WORDS = { fifteen: '15', thirty: '30', 'forty five': '45', 'forty-five': '45' }
const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const WEEKDAY = WEEKDAYS.join('|')
const MONTH = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)'
const MONTH_STARTS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const PREP = '(?:at|by|around|@)'

const pad = (n) => String(n).padStart(2, '0')
const weekdayOf = (day) => new Date(`${day}T00:00:00Z`).getUTCDay()

/** The next such weekday, never today: saying "on Friday" on a Friday means next week. */
const nextWeekday = (today, name) => addDays(today, (WEEKDAYS.indexOf(name) - weekdayOf(today) + 7) % 7 || 7)

/** A day and month, in this year or, if that has passed, the next. */
const onDayMonth = (today, dayNumber, month) => {
  const year = Number(today.slice(0, 4))
  const candidate = `${year}-${pad(month)}-${pad(dayNumber)}`
  if (!isValidDay(candidate)) return null
  return candidate >= today ? candidate : `${year + 1}-${pad(month)}-${pad(dayNumber)}`
}

/** A day of the month with no month named: this month if still to come, otherwise next. */
const onDayOfMonth = (today, dayNumber) => {
  const year = Number(today.slice(0, 4))
  const month = Number(today.slice(5, 7))
  const thisMonth = `${year}-${pad(month)}-${pad(dayNumber)}`
  if (isValidDay(thisMonth) && thisMonth >= today) return thisMonth
  const next = month === 12 ? `${year + 1}-01-${pad(dayNumber)}` : `${year}-${pad(month + 1)}-${pad(dayNumber)}`
  return isValidDay(next) ? next : null
}

/**
 * Works out a 24-hour hour. "7 pm" and 19 are exact. A bare "7" is read as working
 * hours: 8 to 11 in the morning, 12 to 7 in the afternoon. For something today, a time
 * already gone flips to the other half of the day, so "at 9" at 10 am means 9 pm.
 */
const resolveHour = (hour, minute, meridiem, dayPart, isToday, minutesNow) => {
  if (meridiem) return hour % 12 + (meridiem === 'pm' ? 12 : 0)
  if (hour > 12 || hour === 0) return hour
  if (dayPart === 'morning') return hour % 12
  if (dayPart === 'afternoon' || dayPart === 'evening') return hour % 12 + 12
  if (dayPart === 'night') return hour === 12 ? 0 : hour + 12 * (hour < 6 ? 0 : 1)
  const usual = hour === 12 ? 12 : hour <= 7 ? hour + 12 : hour
  if (isToday && usual * 60 + minute <= minutesNow) {
    const other = (usual + 12) % 24
    if (other * 60 + minute > minutesNow) return other
  }
  return usual
}

const LEADING_FILLER = new RegExp(
  '^(?:' +
    [
      'okay', 'ok', 'hey', 'hi', 'please', 'so', 'um', 'uh', 'also', 'and',
      "i(?:'ve| have)(?: got)?(?: to)?", 'i got(?: to)?', 'i need to', 'i must', 'i should', 'i want to', "i will", "i'll", "i'm going to", 'i am going to',
      "we(?:'ve| have)(?: got)?(?: to)?", 'we need to', 'we must', 'we should', "we'll",
      'remind me(?: to| about| of)?', 'remember(?: to)?', "don'?t forget(?: to)?", 'need to', 'have to', 'got to',
      '(?:add|create|make)(?: a| an)?(?: new)? (?:task|work|to-?do)(?: to| for| called)?',
      'new (?:task|work)(?: to| for)?',
      "there(?:'s| is)", 'schedule', 'set up', 'book', 'can you', 'could you',
    ].join('|') +
    ')\\b[,\\s]*',
  'i'
)

const cleanTitle = (raw) => {
  let title = raw.replace(/\s+/g, ' ').replace(/\s+([,.!?])/g, '$1').trim()
  for (let pass = 0; pass < 4; pass++) {
    title = title.replace(LEADING_FILLER, '').replace(/^(?:a|an|the|my|our|some)\s+/i, '').trim()
    // Words left stranded once the date and time were lifted out.
    title = title.replace(/[\s,.!?;:-]+$/, '').replace(/\s+(?:on|at|by|for|from|in|the|this|next|and|to|please)$/i, '').trim()
  }
  return title ? title[0].toUpperCase() + title.slice(1) : null
}

/**
 * @returns {{ title, dueDate, dueTime, priority, assigneeId, assigneeName, recurrence }}
 * `title` is null when nothing was left that says what the task is.
 */
export const parseTask = (input, { today, minutesNow = 0, users = [], meId = null }) => {
  let text = ` ${String(input ?? '').replace(/\s+/g, ' ').trim()} `
  const take = (pattern) => {
    const match = text.match(pattern)
    if (match) text = text.replace(match[0], ' ')
    return match
  }

  // Speech writes these several ways. Settle on one spelling before reading times.
  text = text
    .replace(/\b([ap])\.\s?m\b\.?/gi, (_, letter) => `${letter}m`)
    .replace(new RegExp(`\\b(${NUMBER})\\s+(fifteen|thirty|forty[- ]five)\\b`, 'gi'), (_, w, m) => `${NUMBER_WORDS[w.toLowerCase()]}:${MINUTE_WORDS[m.toLowerCase()]}`)
    .replace(new RegExp(`\\b(${NUMBER})\\s+(am|pm|o'?clock)\\b`, 'gi'), (_, w, end) => `${NUMBER_WORDS[w.toLowerCase()]} ${end}`)
    .replace(new RegExp(`\\b(at|by|around|half past|quarter past|quarter to)\\s+(${NUMBER})\\b`, 'gi'), (_, p, w) => `${p} ${NUMBER_WORDS[w.toLowerCase()]}`)
    .replace(/\b(at|by|around)\s+(\d{1,2})\s+(\d{2})\b/gi, '$1 $2:$3')
    .replace(/\b(\d{1,2})\s+(\d{2})\s*(am|pm)\b/gi, '$1:$2 $3')

  // Who it is for. Only clear phrasing counts, so "meeting with Tanisha" stays yours.
  let assigneeId = meId
  // People say first names, whatever the account is called. Full names come first so
  // "Tanisha Rao" is taken whole, not just its first word.
  const firstName = (name) => name.split(/\s+/)[0]
  const names = users
    .flatMap((u) => [u.name, firstName(u.name)])
    .sort((a, b) => b.length - a.length)
    .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  if (names) {
    const byName = (found) => {
      const said = found.toLowerCase()
      return users.find((u) => u.name.toLowerCase() === said || firstName(u.name).toLowerCase() === said)?.id ?? meId
    }
    const asked = take(new RegExp(`\\b(?:tell|ask|remind)\\s+(${names})\\s+to\\b`, 'i'))
    const assigned = asked || take(new RegExp(`\\b(?:assign(?:ed)?(?:\\s+(?:it|this))?\\s+to|for)\\s+(${names})\\b`, 'i'))
    const subject = assigned || take(new RegExp(`\\b(${names})\\s+(?:has to|needs to|need to|should|must|will|has|have to)\\b`, 'i'))
    if (subject) assigneeId = byName(subject[1])
  }
  take(/\b(?:assign(?:ed)?(?:\s+(?:it|this))?\s+to|for)\s+me\b/i)
  const assigneeName = users.find((u) => u.id === assigneeId)?.name ?? null

  let priority = 'medium'
  if (take(/\b(?:very\s+)?(?:urgent(?:ly)?|critical|asap|as soon as possible)\b/i)) priority = 'critical'
  else if (take(/\b(?:very\s+important|high[- ]priority|important)\b/i)) priority = 'high'
  else if (take(/\blow[- ]priority\b/i)) priority = 'low'

  // Repeats. Only "every ...": "monthly maintenance" is a name, not a schedule.
  let recurrence = 'none'
  let dueDate = null
  const everyDay = take(new RegExp(`\\bevery\\s+(${WEEKDAY})\\b`, 'i'))
  if (everyDay) {
    recurrence = 'weekly'
    dueDate = nextWeekday(today, everyDay[1].toLowerCase())
  } else if (take(/\bevery\s+week\b/i)) recurrence = 'weekly'
  else if (take(/\bevery\s+month\b/i)) recurrence = 'monthly'
  else if (take(/\bevery\s+year\b/i)) recurrence = 'yearly'

  // "tomorrow morning" says when, but "morning standup" is only a name. So a part of
  // the day counts only straight after a day, or after words like "in the" or "this".
  let dayPart = null
  text = text.replace(new RegExp(`\\b(today|tomorrow|tmrw|tomorow|${WEEKDAY})\\s+(morning|afternoon|evening|night)\\b`, 'i'), (_, when, part) => {
    dayPart = part.toLowerCase()
    return when
  })

  // The date.
  let match
  if (!dueDate) {
    if (take(/\bday after tomorrow\b/i)) dueDate = addDays(today, 2)
    else if (take(/\b(?:tomorrow|tmrw|tomorow)\b/i)) dueDate = addDays(today, 1)
    else if (take(/\btonight\b/i)) {
      dueDate = today
      dayPart = 'night'
    } else if (take(/\btoday\b/i)) dueDate = today
    else if ((match = take(new RegExp(`\\bin\\s+(\\d+|a|an|${NUMBER})\\s+(day|week)s?\\b`, 'i')))) {
      const word = match[1].toLowerCase()
      const count = /^\d+$/.test(word) ? Number(word) : NUMBER_WORDS[word] ?? 1
      dueDate = addDays(today, count * (match[2].toLowerCase() === 'week' ? 7 : 1))
    } else if (take(/\bnext\s+week\b/i)) dueDate = addDays(today, 7)
    else if ((match = take(new RegExp(`\\bnext\\s+(${WEEKDAY})\\b`, 'i')))) {
      // The one in the following week, not the coming one.
      dueDate = addDays(nextWeekday(today, match[1].toLowerCase()), 7)
    } else if ((match = take(new RegExp(`\\b(?:on\\s+|this\\s+|by\\s+)?(${WEEKDAY})\\b`, 'i')))) {
      dueDate = nextWeekday(today, match[1].toLowerCase())
    } else if ((match = take(new RegExp(`\\b(?:on\\s+|by\\s+)?(?:the\\s+)?(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?${MONTH}\\b`, 'i')))) {
      dueDate = onDayMonth(today, Number(match[1]), MONTH_STARTS.indexOf(match[2].slice(0, 3).toLowerCase()) + 1)
    } else if ((match = take(new RegExp(`\\b(?:on\\s+|by\\s+)?${MONTH}\\s+(?:the\\s+)?(\\d{1,2})(?:st|nd|rd|th)?\\b`, 'i')))) {
      dueDate = onDayMonth(today, Number(match[2]), MONTH_STARTS.indexOf(match[1].slice(0, 3).toLowerCase()) + 1)
    } else if ((match = take(/\b(?:on\s+|by\s+)?(\d{1,2})[/-](\d{1,2})\b/))) {
      dueDate = onDayMonth(today, Number(match[1]), Number(match[2])) // day first, as in India
    } else if ((match = take(/\b(?:on|by)\s+(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)\b/i))) {
      dueDate = onDayOfMonth(today, Number(match[1]))
    }
  }

  if (!dayPart) {
    const part = take(/\b(?:this|in(?:\s+the)?|at)\s+(morning|afternoon|evening|night)\b/i)
    if (part) dayPart = part[1].toLowerCase()
  }

  // The time.
  let hour = null
  let minute = 0
  let meridiem = null
  if ((match = take(new RegExp(`\\b(?:${PREP}\\s*)?(noon|midday|midnight)\\b`, 'i')))) {
    const word = match[1].toLowerCase()
    hour = word === 'midnight' ? 0 : 12
    meridiem = word === 'midnight' ? 'am' : 'pm'
  } else if ((match = take(new RegExp(`\\b(?:${PREP}\\s*)?half past\\s+(\\d{1,2})\\b`, 'i')))) {
    hour = Number(match[1])
    minute = 30
  } else if ((match = take(new RegExp(`\\b(?:${PREP}\\s*)?quarter past\\s+(\\d{1,2})\\b`, 'i')))) {
    hour = Number(match[1])
    minute = 15
  } else if ((match = take(new RegExp(`\\b(?:${PREP}\\s*)?quarter to\\s+(\\d{1,2})\\b`, 'i')))) {
    hour = Number(match[1]) - 1 || 12
    minute = 45
  } else if ((match = take(new RegExp(`(?:\\b${PREP}\\s*|\\s)(\\d{1,2}):(\\d{2})(?:\\s*(am|pm))?(?=[\\s,.!?]|$)`, 'i')))) {
    hour = Number(match[1])
    minute = Number(match[2])
    meridiem = match[3]?.toLowerCase() ?? null
  } else if ((match = take(new RegExp(`(?:\\b${PREP}\\s*|@\\s*)(\\d{1,2})\\.(\\d{2})(?:\\s*(am|pm))?(?=[\\s,!?]|$)`, 'i')))) {
    hour = Number(match[1])
    minute = Number(match[2])
    meridiem = match[3]?.toLowerCase() ?? null
  } else if ((match = take(new RegExp(`(?:\\b${PREP}\\s*|\\s)(\\d{1,2})\\s*(am|pm)(?=[\\s,.!?]|$)`, 'i')))) {
    hour = Number(match[1])
    meridiem = match[2].toLowerCase()
  } else if ((match = take(new RegExp(`(?:\\b${PREP}\\s*|@\\s*)(\\d{1,2})(?:\\s*o'?clock)?(?=[\\s,.!?]|$)`, 'i')))) {
    hour = Number(match[1])
  } else if ((match = take(/\b(\d{1,2})\s*o'?clock\b/i))) {
    hour = Number(match[1])
  }

  // Out-of-range times are not times; ignore them rather than store nonsense.
  if (hour !== null && (hour > 23 || minute > 59 || (meridiem && hour > 12))) hour = null

  let dueTime = null
  if (hour !== null) {
    const isToday = !dueDate || dueDate === today
    let resolved = resolveHour(hour, minute, meridiem, dayPart, isToday, minutesNow)
    // A time with no date means the next time it comes round.
    if (!dueDate) dueDate = resolved * 60 + minute > minutesNow ? today : addDays(today, 1)
    // "Tonight at 12" or "tonight at 2" is already tomorrow on the calendar.
    else if (dayPart === 'night' && resolved < 6 && dueDate === today) dueDate = addDays(today, 1)
    resolved %= 24
    dueTime = `${pad(resolved)}:${pad(minute)}`
  } else if (!dueDate && dayPart) {
    dueDate = today
  }
  if (recurrence !== 'none' && !dueDate) dueDate = today

  return { title: cleanTitle(text), dueDate, dueTime, priority, assigneeId, assigneeName, recurrence }
}

/** "Today, 7:00 pm", "Tomorrow", "12 Nov". Null when there is no date. */
export const whenText = (dueDate, dueTime, today) => {
  if (!dueDate) return null
  const diff = daysBetween(today, dueDate)
  const day = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : formatDay(dueDate, today)
  return dueTime ? `${day}, ${formatTime(dueTime)}` : day
}
