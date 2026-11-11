import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { assignmentNotices, eventRemindersFor, istMoment, numberFor, remindersFor } from '../lib/reminders.mjs'

const SKANDA = { id: 's', name: 'Skanda' }
const TANISHA = { id: 't', name: 'Tanisha' }
const USERS = [SKANDA, TANISHA]

describe('reminders', () => {
  const now = istMoment('2026-11-11', '10:00')
  const task = (fields) => ({ id: 'task-1', title: 'Send proposal', due_date: '2026-11-11', due_time: null, done_at: null, assignee_id: 's', for_both: false, created_by: 's', ...fields })

  test('a time in Bengaluru is the right moment', () => {
    assert.equal(new Date(istMoment('2026-11-11', '19:00')).toISOString(), '2026-11-11T13:30:00.000Z')
  })

  test('a task with a time reminds at that time', () => {
    const [r] = remindersFor([task({ due_time: '19:00' })], 's', now)
    assert.equal(r.at, istMoment('2026-11-11', '19:00'))
    assert.equal(r.body, 'Due now, 7:00 pm')
    assert.equal(r.url, '/tasks/task-1')
  })

  test('a task with only a date reminds at 9 in the morning, if that is still to come', () => {
    assert.equal(remindersFor([task({ due_date: '2026-11-12' })], 's', now)[0].at, istMoment('2026-11-12', '09:00'))
    assert.equal(remindersFor([task({})], 's', now).length, 0) // 9 am today has passed
  })

  test('only the people on the task are reminded', () => {
    const later = task({ due_time: '18:00' })
    assert.equal(remindersFor([later], 't', now).length, 0)
    assert.equal(remindersFor([{ ...later, for_both: true, assignee_id: null }], 't', now).length, 1)
    assert.equal(remindersFor([{ ...later, assignee_id: null, created_by: 't' }], 't', now).length, 1)
  })

  test('finished tasks and times gone by are left out', () => {
    assert.equal(remindersFor([task({ due_time: '18:00', done_at: '2026-11-11T05:00:00Z' })], 's', now).length, 0)
    assert.equal(remindersFor([task({ due_time: '08:00' })], 's', now).length, 0)
  })

  test('the place goes in the notice', () => {
    const [r] = remindersFor([task({ due_time: '18:00', company_name: 'MRN', project_name: 'Website' })], 's', now)
    assert.equal(r.body, 'Due now, 6:00 pm · MRN · Website')
  })

  test('each reminder has a steady number for the phone, different for a new time', () => {
    assert.equal(numberFor('a@1'), numberFor('a@1'))
    assert.notEqual(numberFor('a@1'), numberFor('a@2'))
    assert.ok(numberFor('x') >= 0 && numberFor('x') <= 0x7fffffff)
  })
})

describe('notices about tasks', () => {
  const task = (fields) => ({ id: 'task-1', title: 'Send proposal', assignee_id: null, for_both: false, ...fields })

  test('a task given to the other founder tells them', () => {
    const [n] = assignmentNotices({ actor: TANISHA, task: task({ assignee_id: 's' }), users: USERS })
    assert.deepEqual(n, { userId: 's', kind: 'task', title: 'Tanisha assigned you a task', url: '/tasks/task-1' })
  })

  test('a meeting for both tells the other founder, not the one who set it', () => {
    const notices = assignmentNotices({ actor: TANISHA, task: task({ title: 'Meeting with MRN', for_both: true }), users: USERS })
    assert.deepEqual(notices.map((n) => [n.userId, n.title]), [['s', 'Tanisha scheduled a meeting for you both']])
  })

  test('a call for both counts as a meeting; a call for one person is a task', () => {
    assert.equal(assignmentNotices({ actor: TANISHA, task: task({ title: 'Call with Vetaas', for_both: true }), users: USERS })[0].kind, 'meeting')
    assert.equal(assignmentNotices({ actor: TANISHA, task: task({ title: 'Call the printer', assignee_id: 's' }), users: USERS })[0].kind, 'task')
  })

  test('your own tasks, and unassigned ones, tell no one', () => {
    assert.equal(assignmentNotices({ actor: SKANDA, task: task({ assignee_id: 's' }), users: USERS }).length, 0)
    assert.equal(assignmentNotices({ actor: SKANDA, task: task({}), users: USERS }).length, 0)
  })

  test('editing a task already yours does not tell you again', () => {
    const before = task({ assignee_id: 's' })
    assert.equal(assignmentNotices({ actor: TANISHA, task: task({ assignee_id: 's', title: 'Send proposal v2' }), before, users: USERS }).length, 0)
  })

  test('moving a task from one person to both tells only the one newly on it', () => {
    const before = task({ assignee_id: 't' })
    const notices = assignmentNotices({ actor: TANISHA, task: task({ for_both: true }), before, users: USERS })
    assert.deepEqual(notices.map((n) => n.userId), ['s'])
  })
})

describe('event reminders', () => {
  const now = istMoment('2026-11-11', '10:00')
  const event = (fields) => ({ id: 'ev-1', title: 'Startup meetup', happened_on: '2026-11-14', start_time: null, place: null, ...fields })

  test('an event with a start time reminds at that time the day before', () => {
    const [r] = eventRemindersFor([event({ start_time: '18:30', place: 'Koramangala' })], now)
    assert.equal(r.at, istMoment('2026-11-13', '18:30'))
    assert.equal(r.title, 'Startup meetup')
    assert.equal(r.body, 'Tomorrow at 6:30 pm · Koramangala')
    assert.equal(r.url, '/events/ev-1')
  })

  test('without a time, it reminds at 9 in the morning the day before', () => {
    assert.equal(eventRemindersFor([event({})], now)[0].at, istMoment('2026-11-13', '09:00'))
    assert.equal(eventRemindersFor([event({})], now)[0].body, 'Tomorrow')
  })

  test('a reminder whose moment has passed is left out', () => {
    // Tomorrow's event without a time would have reminded at 9 today; it is 10 now.
    assert.equal(eventRemindersFor([event({ happened_on: '2026-11-12' })], now).length, 0)
    assert.equal(eventRemindersFor([event({ happened_on: '2026-11-12', start_time: '17:00' })], now).length, 1)
  })

  test('event and task reminders never share a number', () => {
    const [e] = eventRemindersFor([event({ id: 'same' })], now)
    assert.notEqual(e.id, numberFor(`same@${e.at}`))
  })
})
