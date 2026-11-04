import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { dueLabel, formatTime, minutesIST } from '../lib/dates.mjs'
import { parseTask, whenText } from '../lib/parse-task.mjs'

// Wednesday 4 November 2026, 10:00 am.
const TODAY = '2026-11-04'
const TOMORROW = '2026-11-05'
const users = [{ id: 'me', name: 'Skanda' }, { id: 'her', name: 'Tanisha' }]
const parse = (said, minutesNow = 600) => parseTask(said, { today: TODAY, minutesNow, users, meId: 'me' })

const cases = [
  // Your own example, and the ways people say it.
  ['I have meeting today at 7', 'Meeting', TODAY, '19:00'],
  ['i have a meeting today at 7', 'Meeting', TODAY, '19:00'],
  ['I have a meeting at 7 today', 'Meeting', TODAY, '19:00'],
  ['meeting today 7 pm', 'Meeting', TODAY, '19:00'],
  ['meeting today at 7 p.m.', 'Meeting', TODAY, '19:00'],
  ['meeting at seven today', 'Meeting', TODAY, '19:00'],
  ["I've got a meeting today at 7:30", 'Meeting', TODAY, '19:30'],
  ['meeting today at 7.30', 'Meeting', TODAY, '19:30'],
  ['meeting today at half past 7', 'Meeting', TODAY, '19:30'],
  ['meeting today at 7 30 pm', 'Meeting', TODAY, '19:30'],

  // With people and details kept in the title.
  ['meeting with Acme today at 7', 'Meeting with Acme', TODAY, '19:00'],
  ['call Globex tomorrow at 11 about the payment', 'Call Globex about the payment', TOMORROW, '11:00'],
  ['remind me to send invoice to Initech tomorrow', 'Send invoice to Initech', TOMORROW, null],
  ['add task deploy the website on Friday', 'Deploy the website', '2026-11-06', null],
  ['I need to call Umbrella at 3', 'Call Umbrella', TODAY, '15:00'],
  ["don't forget to pay hosting bill on Monday", 'Pay hosting bill', '2026-11-09', null],
  ['monthly maintenance for Umbrella tomorrow', 'Monthly maintenance for Umbrella', TOMORROW, null],

  // Dates.
  ['review day after tomorrow', 'Review', '2026-11-06', null],
  ['review next Friday', 'Review', '2026-11-13', null],
  ['review in 3 days', 'Review', '2026-11-07', null],
  ['review in a week', 'Review', '2026-11-11', null],
  ['review next week', 'Review', '2026-11-11', null],
  ['review on 12th November', 'Review', '2026-11-12', null],
  ['review on November 12', 'Review', '2026-11-12', null],
  ['review on the 20th', 'Review', '2026-11-20', null],
  ['review on 12/11', 'Review', '2026-11-12', null],
  ['review on 15 January', 'Review', '2027-01-15', null],
  ['review on the 2nd', 'Review', '2026-12-02', null],
  ['review on Wednesday', 'Review', '2026-11-11', null],

  // Times.
  ['standup tomorrow morning at 9', 'Standup', TOMORROW, '09:00'],
  ['standup tomorrow at 9', 'Standup', TOMORROW, '09:00'],
  ['dinner tonight at 8', 'Dinner', TODAY, '20:00'],
  ['client call this evening at 6', 'Client call', TODAY, '18:00'],
  ['lunch tomorrow at noon', 'Lunch', TOMORROW, '12:00'],
  ['deploy at midnight tomorrow', 'Deploy', TOMORROW, '00:00'],
  ['backup tomorrow at 17:45', 'Backup', TOMORROW, '17:45'],
  ['call tomorrow at quarter to 5', 'Call', TOMORROW, '16:45'],
  ['call tomorrow at 7 am', 'Call', TOMORROW, '07:00'],
  ['call at 12 pm tomorrow', 'Call', TOMORROW, '12:00'],
  ['call at 12 am tomorrow', 'Call', TOMORROW, '00:00'],
  ['meeting at 7', 'Meeting', TODAY, '19:00'],
  ['deploy tonight at 12', 'Deploy', TOMORROW, '00:00'],
  ['meeting in evening at 6', 'Meeting', TODAY, '18:00'],

  // A part of the day that is only part of the name.
  ['morning standup tomorrow at 9', 'Morning standup', TOMORROW, '09:00'],
  ['night shift tomorrow', 'Night shift', TOMORROW, null],

  // Numbers that are not times.
  ['call 7 clients tomorrow', 'Call 7 clients', TOMORROW, null],
  ['buy 3 domains', 'Buy 3 domains', null, null],
  ['write proposal', 'Write proposal', null, null],
]

describe('reading a sentence', () => {
  for (const [said, title, date, time] of cases) {
    test(said, () => {
      const task = parse(said)
      assert.deepEqual([task.title, task.dueDate, task.dueTime], [title, date, time])
    })
  }

  test('a time already gone flips to the other half of the day', () => {
    assert.equal(parse('meeting today at 9').dueTime, '21:00') // at 10 am, 9 am has gone
    assert.equal(parse('meeting today at 11').dueTime, '11:00') // 11 am is still to come
  })

  test('a time with no date is the next time it comes round', () => {
    const lateAtNight = 23 * 60 + 30
    const task = parse('meeting at 7', lateAtNight)
    assert.deepEqual([task.dueDate, task.dueTime], [TOMORROW, '19:00'])
  })

  test('saying am or pm is never second-guessed', () => {
    assert.equal(parse('meeting today at 9 am').dueTime, '09:00')
    assert.equal(parse('meeting today at 9 pm').dueTime, '21:00')
  })

  test('impossible times are ignored rather than stored', () => {
    assert.equal(parse('call at 25').dueTime, null)
    assert.equal(parse('call at 7:75').dueTime, null)
  })

  test('nothing left to name the task means no title', () => {
    assert.equal(parse('today at 7').title, null)
    assert.equal(parse('I have').title, null)
    assert.equal(parse('').title, null)
  })
})

describe('who and how urgent', () => {
  const who = (said) => parse(said).assigneeId

  test('it is yours unless you say otherwise', () => {
    assert.equal(who('meeting today at 7'), 'me')
    assert.equal(who('meeting with Tanisha today at 7'), 'me')
  })

  test('clear phrasing gives it to the other founder', () => {
    assert.equal(who('tell Tanisha to post the reel tomorrow'), 'her')
    assert.equal(who('ask tanisha to call Globex'), 'her')
    assert.equal(who('Tanisha has a meeting today at 7'), 'her')
    assert.equal(who('review proposal for Tanisha'), 'her')
    assert.equal(who('assign to Tanisha update the invoice'), 'her')
  })

  test('a first name finds an account with a full name', () => {
    const full = [{ id: 'me', name: 'Skanda Umesh' }, { id: 'her', name: 'Tanisha Rao' }]
    const read = (said) => parseTask(said, { today: TODAY, minutesNow: 600, users: full, meId: 'me' })
    assert.equal(read('tell Tanisha to post the reel').assigneeId, 'her')
    assert.equal(read('tell Tanisha Rao to post the reel').assigneeId, 'her')
    assert.equal(read('tell Tanisha Rao to post the reel').title, 'Post the reel')
    assert.equal(read('tell Tanisha to post the reel').assigneeName, 'Tanisha Rao')
  })

  test('"we", "both of us" or both names make it a task for both', () => {
    for (const said of [
      'we have a meeting today at 7',
      'We need to call Globex tomorrow',
      "ok we've got the review on Friday",
      'meeting for both of us at 5',
      'assign to both the proposal review',
      'Skanda and Tanisha have a call at 4',
      'Tanisha and I meet Acme tomorrow',
      'review the invoice with me and Tanisha',
    ]) {
      const task = parse(said)
      assert.equal(task.forBoth, true, said)
      assert.equal(task.assigneeId, null, said)
      assert.equal(task.assigneeName, 'Both', said)
    }
    assert.equal(parse('we have a meeting today at 7').title, 'Meeting')
    assert.equal(parse('meeting for both of us at 5').title, 'Meeting')
    assert.equal(parse('Skanda and Tanisha have a call at 4').title, 'Call')
  })

  test('naming one person beats "we", and plain sentences stay yours', () => {
    assert.equal(parse('we should tell Tanisha to post the reel').assigneeId, 'her')
    assert.equal(parse('we should tell Tanisha to post the reel').forBoth, false)
    for (const said of ['meeting with Tanisha today at 7', 'weekly report on Wednesday', 'website fixes tomorrow', 'I have meeting today at 7']) {
      assert.equal(parse(said).forBoth, false, said)
    }
    assert.equal(parse('meeting with Tanisha today at 7').assigneeId, 'me')
  })

  test('the name does not stay in the title when it only says who', () => {
    assert.equal(parse('tell Tanisha to post the reel tomorrow').title, 'Post the reel')
    assert.equal(parse('Tanisha has a meeting today at 7').title, 'Meeting')
    assert.equal(parse('meeting with Tanisha today at 7').title, 'Meeting with Tanisha')
  })

  test('priority', () => {
    assert.equal(parse('call Globex today').priority, 'medium')
    assert.equal(parse('urgent call Globex today').priority, 'critical')
    assert.equal(parse('call Globex asap').priority, 'critical')
    assert.equal(parse('important meeting tomorrow').priority, 'high')
    assert.equal(parse('tidy files low priority').priority, 'low')
    assert.equal(parse('urgent call Globex today').title, 'Call Globex')
    assert.equal(parse('important meeting tomorrow').title, 'Meeting')
  })
})

describe('repeats', () => {
  test('every week, month and year', () => {
    assert.equal(parse('backup every week').recurrence, 'weekly')
    assert.equal(parse('invoice Umbrella every month').recurrence, 'monthly')
    assert.equal(parse('renew domain every year').recurrence, 'yearly')
    assert.equal(parse('backup every week').dueDate, TODAY) // a repeat needs a date to count from
  })

  test('every Monday starts on the next Monday', () => {
    const task = parse('team review every Monday at 10')
    assert.deepEqual([task.title, task.recurrence, task.dueDate, task.dueTime], ['Team review', 'weekly', '2026-11-09', '10:00'])
  })

  test('a word like monthly in a name does not make it repeat', () => {
    assert.equal(parse('monthly maintenance for Umbrella').recurrence, 'none')
  })
})

describe('showing the time', () => {
  test('formats times', () => {
    assert.equal(formatTime('19:00'), '7:00 pm')
    assert.equal(formatTime('09:05'), '9:05 am')
    assert.equal(formatTime('00:30'), '12:30 am')
    assert.equal(formatTime('12:00:00'), '12:00 pm')
  })

  test('reads naturally', () => {
    assert.equal(whenText(TODAY, '19:00', TODAY), 'Today, 7:00 pm')
    assert.equal(whenText(TOMORROW, null, TODAY), 'Tomorrow')
    assert.equal(whenText('2026-11-12', '09:00', TODAY), '12 Nov, 9:00 am')
    assert.equal(whenText(null, null, TODAY), null)
  })

  test("today's time turns late only once it has passed", () => {
    assert.deepEqual(dueLabel(TODAY, TODAY, '19:00', 600), { text: 'Today, 7:00 pm', tone: 'soon' })
    assert.deepEqual(dueLabel(TODAY, TODAY, '19:00', 19 * 60 + 1), { text: 'Today, 7:00 pm', tone: 'late' })
    assert.deepEqual(dueLabel(TODAY, TODAY, null, 23 * 60), { text: 'Today', tone: 'soon' })
  })

  test('IST minutes do not depend on the server clock', () => {
    assert.equal(minutesIST(new Date('2026-11-04T13:30:00Z')), 19 * 60)
    assert.equal(minutesIST(new Date('2026-11-03T18:30:00Z')), 0)
  })
})
