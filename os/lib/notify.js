import 'server-only'

import { after } from 'next/server'
import { todayIST } from '@/lib/dates.mjs'
import { sql } from '@/lib/db.mjs'
import { whenText } from '@/lib/parse-task.mjs'
import { pushTo } from '@/lib/push.mjs'
import { assignmentNotices } from '@/lib/reminders.mjs'

const allUserIds = async () => (await sql('SELECT id FROM users')).map((u) => u.id)

/**
 * After a task is added or changed: tells anyone newly given it, in the app and
 * on their phone, and has every phone set its reminders again. Pushes go after
 * the response, so saving never waits on Google.
 */
export async function taskChanged(actor, task, before = null) {
  const users = await sql('SELECT id, name FROM users')
  const notices = task ? assignmentNotices({ actor, task, before, users }) : []
  const body = task ? [task.title, whenText(task.due_date, task.due_time, todayIST())].filter(Boolean).join(' · ') : null

  const saved = []
  for (const n of notices) {
    const [row] = await sql(
      `INSERT INTO notifications (user_id, kind, title, body, url, actor_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [n.userId, n.kind, n.title, body, n.url, actor.id]
    )
    saved.push({ ...n, id: row.id })
  }

  after(async () => {
    for (const n of saved) await pushTo([n.userId], { type: 'notify', id: n.id, title: n.title, body: body ?? '', url: n.url })
    await pushTo(users.map((u) => u.id), { type: 'sync' })
  })
}

/** After a task is ticked off or deleted: only the reminders change. */
export async function tasksMoved() {
  const ids = await allUserIds()
  after(() => pushTo(ids, { type: 'sync' }))
}
