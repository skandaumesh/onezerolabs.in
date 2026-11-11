'use client'

import { useEffect, useRef, useState } from 'react'
import { pdfThumbnail } from '@/lib/pdf-client'

/**
 * A PDF's first page, as the Files app shows it. Drawn only once it scrolls near
 * the screen; until then, and if it can't be drawn, the plain page stays.
 */
export function PdfThumb({ src, children }) {
  const ref = useRef(null)
  const [thumb, setThumb] = useState(null)

  useEffect(() => {
    let alive = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        pdfThumbnail(src, 72)
          .then((t) => alive && setThumb(t))
          .catch(() => {})
      },
      { rootMargin: '300px' }
    )
    observer.observe(ref.current)
    return () => {
      alive = false
      observer.disconnect()
    }
  }, [src])

  return (
    <span ref={ref} className="flex h-full items-end justify-center">
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb.url}
          alt=""
          data-thumb=""
          className="max-h-full w-auto rounded-[3px] bg-paper shadow-[0_1px_4px_rgba(0,0,0,0.2)] ring-1 ring-line"
          style={{ aspectRatio: `1 / ${thumb.ratio}` }}
        />
      ) : (
        children
      )}
    </span>
  )
}
