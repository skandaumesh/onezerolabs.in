"use client"

import { motion } from "framer-motion"

const logos = [
  { src: "/clients/svg/mla.svg",     alt: "MLA Academy of Higher Learning",   w: 1077, h: 1053, display: 88 },
  { src: "/clients/svg/vaayu.svg",   alt: "Vaayu Chest & Sleep Specialists",  w: 1125, h: 1105, display: 92 },
  { src: "/clients/svg/vetaas.svg",  alt: "Vetaas Education Foundation",      w:  808, h:  860, display: 74 },
  { src: "/clients/svg/praasa.svg",  alt: "Praasa Consultancy",               w:  935, h:  840, display: 72 },
  { src: "/clients/svg/elevare.svg", alt: "Elevare Connect",                  w: 1241, h:  498, display: 58 },
  { src: "/clients/svg/elan.svg",    alt: "Élan Vital",                      w: 1192, h:  227, display: 32 },
]

function LogoRow({ ariaHidden = false }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {logos.map((logo) => (
        <motion.div
          key={logo.src}
          whileHover={{ scale: 1.1, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          // Equal padding either side of each logo, not a fixed-width slot. A
          // fixed slot spaced logos by their centres, so wide wordmarks
          // (Elevare, Élan Vital) nearly filled theirs and ended up almost
          // touching on phones while the round badges floated apart. Padding
          // gives the same gap between every pair, whatever the logo's width.
          className="flex shrink-0 items-center justify-center cursor-pointer px-6 sm:px-8 md:px-12"
        >
          <img
            src={logo.src}
            alt={logo.alt}
            width={logo.w}
            height={logo.h}
            loading="lazy"
            decoding="async"
            style={{ height: `${logo.display * 0.62}px`, width: "auto" }}
            className="w-auto max-w-none opacity-[0.68] transition-opacity duration-500 hover:opacity-100 md:hidden"
          />
          <img
            src={logo.src}
            alt={logo.alt}
            width={logo.w}
            height={logo.h}
            loading="lazy"
            decoding="async"
            style={{ height: `${logo.display * 0.75}px`, width: "auto" }}
            className="w-auto max-w-none opacity-[0.68] transition-opacity duration-500 hover:opacity-100 hidden md:block"
          />
        </motion.div>
      ))}
    </div>
  )
}

export default function ClientMarquee() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative w-full border-b border-ozl-glassBorder bg-transparent pb-6 pt-3 md:pb-12 md:pt-5 z-20"
    >
      <span className="mb-6 block text-center text-[10px] md:text-[11px] font-mono tracking-[0.4em] text-ozl-muted uppercase font-semibold">
        Our collaborations
      </span>

      <div className="group relative w-full overflow-hidden">
        <div
          className="flex w-max animate-marquee items-center will-change-transform
          [animation-play-state:running]
          group-hover:[animation-play-state:paused]
          motion-reduce:animate-none motion-reduce:justify-center motion-reduce:flex-wrap motion-reduce:w-full"
        >
          <LogoRow />
          {[1, 2, 3, 4, 5].map((i) => (
            <LogoRow key={i} ariaHidden />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
