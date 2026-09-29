"use client"

import Image from "next/image"

/**
 * The logo set into a soft keycap, the way a backlit key sits in a light
 * keyboard: a raised plastic square with a glow bleeding out from under it.
 *
 * HOW THE RAISED LOOK IS MADE. Four shadows doing four different jobs, and the
 * effect falls apart if any is dropped:
 *   1. a wide, soft, downward drop      -- the cap sitting above the surface
 *   2. a tight, darker drop             -- contact shadow, stops it floating
 *   3. inset white along the top edge   -- light catching the moulded lip
 *   4. inset grey along the bottom edge -- the inside of the far wall
 * Reversing 3 and 4 inverts it into a pressed-in hole, which is the usual way
 * this style goes wrong.
 *
 * The glow is a separate blurred layer BEHIND the cap rather than a shadow on
 * it, because a coloured outer shadow hugs the border radius and reads as a
 * neon outline; a blurred radial reads as light escaping.
 */
export function KeycapLogo({
  // The OneZeroLabs mark -- the same file the navbar uses. NOTE: public/logo/
  // holds CLIENT logos (Praasa, Vetaas), not this site's own; the site's mark
  // lives at the top level of public/.
  src = "/logo-print.png",
  alt = "OneZeroLabs",
  size = 88,
  glow = true,
  className = "",
}) {
  // Radius and padding track the size so one number changes the whole cap.
  const radius = Math.round(size * 0.27)
  const padX = Math.round(size * 0.16)
  const padY = Math.round(size * 0.26)

  return (
    <div className={`relative inline-flex ${className}`} style={{ width: size, height: size }}>
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-5 -z-10"
          style={{
            background:
              "radial-gradient(circle at 50% 55%, rgba(150,190,255,0.55) 0%, rgba(190,215,255,0.28) 45%, transparent 72%)",
            filter: "blur(18px)",
          }}
        />
      )}

      <div
        className="group relative flex h-full w-full items-center justify-center transition-transform duration-300 ease-ozl hover:-translate-y-0.5"
        style={{
          borderRadius: radius,
          padding: `${padY}px ${padX}px`,
          background: "linear-gradient(145deg, #FFFFFF 0%, #EDF1F8 100%)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: [
            "0 20px 30px -14px rgba(100,116,139,0.38)",
            "0 6px 12px -6px rgba(100,116,139,0.22)",
            "inset 0 2px 3px rgba(255,255,255,1)",
            "inset 0 -4px 8px rgba(148,163,184,0.24)",
          ].join(", "),
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="h-full w-full object-contain"
          // The cap is a decorative frame; the mark inside is the real content,
          // so it carries the alt text and this stays out of the way.
          priority={false}
        />
      </div>
    </div>
  )
}
