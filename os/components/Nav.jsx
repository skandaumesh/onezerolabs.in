'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CircleUser, Files, FolderKanban, IndianRupee, Landmark, LayoutDashboard, ListChecks, ReceiptText, Users } from 'lucide-react'
import { motion, MotionConfig } from 'motion/react'
import { Avatar } from '@/components/ui'

const ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients & CRM', short: 'Clients', icon: Users },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
]

// In the desktop sidebar. Phones keep to five tabs, so there they open from Overview.
const REVENUE = { href: '/revenue', label: 'Revenue', icon: IndianRupee }
const INVOICES = { href: '/invoices', label: 'Invoices', icon: ReceiptText }
const BANK = { href: '/bank', label: 'Bank', icon: Landmark }
const DOCUMENTS = { href: '/documents', label: 'Documents', icon: Files }

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

export function SidebarNav({ userName }) {
  const { isActive, onNavigate } = useActiveItem()
  const profileActive = isActive(PROFILE.href)
  return (
    <MotionConfig reducedMotion="user">
      <nav aria-label="Main" className="flex min-h-0 flex-1 flex-col gap-0.5 px-3 pb-3">
        {[...ITEMS, REVENUE, INVOICES, BANK, DOCUMENTS].map(({ href, label, icon: Icon }) => {
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
            <Avatar name={userName} />
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
  const { isActive, onNavigate } = useActiveItem({ '/': [REVENUE.href, INVOICES.href, BANK.href, DOCUMENTS.href] })
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
