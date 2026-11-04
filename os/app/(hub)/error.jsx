'use client'

import { BUTTON_PRIMARY } from '@/components/ui'

export default function HubError({ reset }) {
  return (
    <div className="card-surface rounded-card bg-surface p-8 text-center">
      <h1 className="text-title text-ink">Something went wrong</h1>
      <p className="mt-2 text-body text-muted md:text-sub">This page could not load. Anything already saved is safe.</p>
      <button type="button" onClick={reset} className={`${BUTTON_PRIMARY} mt-5`}>
        Try again
      </button>
    </div>
  )
}
