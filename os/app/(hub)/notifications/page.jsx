import Link from 'next/link'
import { MarkRead } from '@/components/AppBridge'
import { Card, Empty, PageHeader } from '@/components/ui'
import { requireUser } from '@/lib/auth'
import { ago } from '@/lib/dates.mjs'
import { listNotifications } from '@/lib/queries'

export const metadata = { title: 'Notifications' }

// Read on this visit still counts as new, so the list doesn't change under you as it is marked read.
const JUST_READ_MS = 10 * 60 * 1000

export default async function NotificationsPage() {
  const user = await requireUser()
  const items = await listNotifications(user.id)
  const unread = items.filter((n) => !n.read_at).length
  const now = Date.now()
  const isNew = (n) => !n.read_at || now - new Date(n.read_at).getTime() < JUST_READ_MS

  return (
    <>
      <PageHeader back={{ href: '/', label: 'Overview' }} title="Notifications" />
      <MarkRead unread={unread} />
      <Card>
        {items.length ? (
          <ul className="rows">
            {items.map((n) => (
              <li key={n.id} className="row-press flex items-start gap-3 px-4 py-3">
                <span aria-hidden="true" className={`mt-2 h-2 w-2 shrink-0 rounded-full ${isNew(n) ? 'bg-accent' : 'bg-transparent'}`} />
                <span className="min-w-0 flex-1">
                  {n.url ? (
                    <Link href={n.url} className={`break-words text-body after:absolute after:inset-0 md:text-sub ${isNew(n) ? 'font-semibold text-ink' : 'text-ink'}`}>
                      {isNew(n) && <span className="sr-only">New: </span>}
                      {n.title}
                    </Link>
                  ) : (
                    <span className="break-words text-body text-ink md:text-sub">{n.title}</span>
                  )}
                  {n.body && <span className="mt-0.5 block break-words text-foot text-ink2">{n.body}</span>}
                </span>
                <span className="shrink-0 pt-0.5 text-foot text-muted">{ago(n.created_at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Empty title="No notifications yet">
            You’ll hear here when someone gives you a task or sets a meeting for you both. The Android app shows them on your phone too.
          </Empty>
        )}
      </Card>
    </>
  )
}
