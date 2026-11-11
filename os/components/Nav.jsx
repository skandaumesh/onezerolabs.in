'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, CircleUser, Files, FolderKanban, Images, IndianRupee, Landmark, LayoutDashboard, ListChecks, ReceiptText, Target, Users } from 'lucide-react'
import { motion, MotionConfig } from 'motion/react'
import { Avatar } from '@/components/ui'

const ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients & CRM', short: 'Clients', icon: Users },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
]

// In the desktop sidebar. Phones keep to five tabs, so there they open from Overview.
const GOALS = { href: '/goals', label: 'Goals', icon: Target }
const NOTIFICATIONS = { href: '/notifications', label: 'Notifications', icon: Bell }
const REVENUE = { href: '/revenue', label: 'Revenue', icon: IndianRupee }
const INVOICES = { href: '/invoices', label: 'Invoices', icon: ReceiptText }
const BANK = { href: '/bank', label: 'Bank', icon: Landmark }
const DOCUMENTS = { href: '/documents', label: 'Documents', icon: Files }
const EVENTS = { href: '/events', label: 'Events', icon: Images }

// Its own tab on phones. On desktop it sits at the foot of the sidebar, as the signed-in person.
const PROFILE = { href: '/profile', label: 'Profile', icon: CircleUser }

const isCurrent = (href, pathname) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

/**
 * The tapped item lights up at once. Waiting for the route would leave the tab
 * looking dead until the server answers.
 */
function useActiveItem(alsoCurrentOn = {}) {
  const pathname = usePathname()
  const [pending, setPending] = useState(null)

  useEffect(() => setPending(null), [pathname])

  const current = (href) => isCurrent(href, pathname) || (alsoCurrentOn[href] ?? []).some((path) => pathname.startsWith(path))
  const onNavigate = (href) => {
    if (!isCurrent(href, pathname)) setPending(href)
  }
  return { isActive: (href) => (pending ? pending === href : current(href)), onNavigate }
}

function SidebarSelection() {
  return (
    <motion.span
      layoutId="sidebar-selection"
      transition={{ type: 'spring', visualDuration: 0.35, bounce: 0 }}
      className="absolute inset-0 rounded-xl bg-thumb shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
    />
  )
}

export function SidebarNav({ userName, userPhoto = null, unread = 0 }) {
  const { isActive, onNavigate } = useActiveItem()
  const profileActive = isActive(PROFILE.href)
  return (
    <MotionConfig reducedMotion="user">
      <nav aria-label="Main" className="flex min-h-0 flex-1 flex-col gap-0.5 px-3 pb-3">
        {[ITEMS[0], NOTIFICATIONS, ...ITEMS.slice(1), GOALS, REVENUE, INVOICES, BANK, DOCUMENTS, EVENTS].map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => onNavigate(href)}
              aria-current={active ? 'page' : undefined}
              className={`press relative flex min-h-10 items-center gap-2.5 rounded-xl px-3 text-sub ${active ? 'font-medium text-ink' : 'text-ink2'}`}
            >
              {active && <SidebarSelection />}
              <Icon size={18} strokeWidth={1.75} aria-hidden="true" className={`relative ${active ? 'text-accent' : ''}`} />
              <span className="relative">{label}</span>
              {href === NOTIFICATIONS.href && unread > 0 && (
                <span className="relative ml-auto min-w-5 rounded-full bg-late px-1.5 text-center text-cap font-semibold leading-5 text-white tabular-nums">
                  {unread}
                  <span className="sr-only"> unread</span>
                </span>
              )}
            </Link>
          )
        })}

        <Link
          href={PROFILE.href}
          onClick={() => onNavigate(PROFILE.href)}
          aria-label={`${userName}, ${PROFILE.label}`}
          aria-current={profileActive ? 'page' : undefined}
          className={`press relative mt-auto flex min-h-12 items-center gap-2.5 rounded-xl px-2 text-sub ${profileActive ? 'font-medium text-ink' : 'text-ink2'}`}
        >
          {profileActive && <SidebarSelection />}
          <span className="relative">
            <Avatar name={userName} photo={userPhoto} />
          </span>
          <span className="relative truncate">{userName}</span>
        </Link>
      </nav>
    </MotionConfig>
  )
}

/** The phone's tab bar: a floating glass bar with the page scrolling under it. */
export function TabBar() {
  // Revenue and Invoices open from Overview on phones, so that tab stays lit on them.
  const { isActive, onNavigate } = useActiveItem({ '/': [NOTIFICATIONS.href, GOALS.href, REVENUE.href, INVOICES.href, BANK.href, DOCUMENTS.href, EVENTS.href] })
  return (
    <MotionConfig reducedMotion="user">
      <nav
        aria-label="Main"
        className="glass dock fixed inset-x-3 bottom-[max(0.625rem,env(safe-area-inset-bottom))] z-30 mx-auto grid max-w-[28rem] grid-cols-5 gap-0.5 rounded-[1.9rem] p-1.5 md:hidden"
      >
        {[...ITEMS, PROFILE].map(({ href, label, short, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => onNavigate(href)}
              aria-current={active ? 'page' : undefined}
              className={`press relative flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 text-tab font-medium ${
                active ? 'text-accent' : 'text-muted'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="tab-selection"
                  transition={{ type: 'spring', visualDuration: 0.35, bounce: 0 }}
                  className="absolute inset-0 rounded-[1.5rem] bg-[var(--tab-selected)]"
                />
              )}
              <Icon size={22} strokeWidth={active ? 2 : 1.75} aria-hidden="true" className="relative" />
              <span className="relative">{short ?? label}</span>
            </Link>
          )
        })}
      </nav>
    </MotionConfig>
  )
}

/** The phone's bell, beside the logo, with the unread count. */
export function PhoneBell({ unread = 0 }) {
  const pathname = usePathname()
  if (pathname === NOTIFICATIONS.href) return null
  return (
    <Link
      href={NOTIFICATIONS.href}
      aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
      className="press relative -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-ink md:hidden"
    >
      <Bell size={22} strokeWidth={1.75} aria-hidden="true" />
      {unread > 0 && (
        <span aria-hidden="true" className="absolute right-1 top-1 min-w-[1.125rem] rounded-full bg-late px-1 text-center text-[0.6875rem] font-semibold leading-[1.125rem] text-white tabular-nums">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  )
}
