'use client'
import { memo, useMemo } from 'react'
import './stars.css'

function StarField({ count = 100, top = 0, height = '100%' }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 3 + 4,
        opacity: Math.random() * 0.5 + 0.5,
      })),
    [count]
  )

  return (
    <div
      className="absolute left-0 w-full overflow-hidden pointer-events-none"
      style={{ top, height }}
    >
      {stars.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

export default memo(StarField)
