import Link from 'next/link'
import { BUTTON_SECONDARY } from '@/components/ui'

export default function HubNotFound() {
  return (
    <div className="card-surface rounded-card bg-surface p-8 text-center">
      <h1 className="text-title text-ink">Not found</h1>
      <p className="mt-2 text-body text-muted md:text-sub">This record may have been deleted.</p>
      <Link href="/" className={`${BUTTON_SECONDARY} mt-5`}>
        Back to Overview
      </Link>
    </div>
  )
}
