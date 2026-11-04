import Image from 'next/image'
import Link from 'next/link'
import { Banners } from '@/components/Banner'
import { SidebarNav, TabBar } from '@/components/Nav'
import { VoiceAdd } from '@/components/VoiceAdd'
import { requireUser } from '@/lib/auth'
import { listUsers } from '@/lib/queries'

// Every page reads the session and live data. Nothing here may be cached or
// prerendered at build time.
export const dynamic = 'force-dynamic'

export default async function HubLayout({ children }) {
  const user = await requireUser()
  const users = await listUsers()

  return (
    <div className="min-h-dvh md:flex">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col bg-sidebar md:flex">
        <Link href="/" className="press flex items-center gap-2.5 px-6 py-5">
          <Image src="/logo-print.png" alt="" width={28} height={28} className="logo-mark h-7 w-auto" />
          <span className="text-headline text-ink">OneZeroLabs OS</span>
        </Link>

        <SidebarNav userName={user.name} />
      </aside>

      {/* The bottom padding lets the last row scroll clear of the tab bar and mic button. */}
      <main className="min-w-0 flex-1 px-4 pb-[calc(env(safe-area-inset-bottom)+10rem)] pt-[calc(env(safe-area-inset-top)+0.5rem)] md:px-10 md:pb-24 md:pt-10">
        <div className="mx-auto max-w-5xl">
          <Link href="/" aria-label="Overview" className="press mb-2 flex h-11 w-fit items-center md:hidden">
            <Image src="/logo-print.png" alt="OneZeroLabs" width={28} height={28} className="logo-mark h-6 w-auto" />
          </Link>

          <div className="page-in">{children}</div>
        </div>
      </main>

      <TabBar />
      <VoiceAdd users={users} meId={user.id} />
      <Banners />
    </div>
  )
}
