'use client'

import { useEffect, useState } from 'react'
import { Share2 } from 'lucide-react'
import { ProblemAlert } from '@/components/Alert'

/**
 * Opens the phone's own share sheet with the file attached, for WhatsApp, email and
 * so on. Shown only where the browser can share files, which needs a secure page:
 * it appears on the hosted app and over the USB link, not on the plain Wi-Fi address.
 */
export function ShareFile({ href, fileName, title, type = 'application/pdf', className }) {
  const [canShare, setCanShare] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const probe = new File([''], fileName, { type })
    setCanShare(Boolean(navigator.canShare?.({ files: [probe] })))
  }, [fileName, type])

  if (!canShare) return null

  const share = async () => {
    setError(null)
    try {
      const response = await fetch(href)
      if (!response.ok) throw new Error('download failed')
      const file = new File([await response.blob()], fileName, { type })
      await navigator.share({ files: [file], title })
    } catch (e) {
      // Closing the share sheet counts as an error too, and needs no message.
      if (e.name !== 'AbortError') setError('Download it instead.')
    }
  }

  return (
    <>
      <button type="button" onClick={share} className={className}>
        <Share2 size={16} aria-hidden="true" />
        Share
      </button>
      {error && <ProblemAlert title="Couldn’t Share" message={error} onClose={() => setError(null)} />}
    </>
  )
}
