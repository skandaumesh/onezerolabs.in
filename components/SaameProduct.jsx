"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

import { PhoneFrame, BrowserFrame } from "./saame-ui/Frames"
import { APPS, RENDERERS, FACTS, MODULES } from "./saame-ui/apps"

/**
 * /products/saame: the whole product, since the homepage now shows one screen
 * and sends people here.
 *
 * Light, like the rest of the site. The generic product template this replaces
 * for SAAME was still dark (bg-[#050505], white text) from the theme that was
 * abandoned months ago, so a visitor left a light homepage and landed on a
 * black page.
 *
 * Screens are rendered in code from the shared data in saame-ui/apps, the same
 * source the homepage reads. Two copies is how the site ended up advertising a
 * "Parent App" here after the product had been renamed to the student app
 * everywhere else, and how it came to quote 1,500+ students and 1,500+ active
 * parents, neither of which appears anywhere in the product.
 */

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const LABEL = "font-mono text-[10px] uppercase tracking-[0.35em] text-ozl-muted"

function Section({ eyebrow, title, aside, children, className = "" }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: 0.08 }}
      className={`relative mx-auto w-full max-w-6xl px-4 md:px-8 ${className}`}
    >
      <motion.div
        variants={fade}
        className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between"
      >
        <div>
          {eyebrow && <span className={`${LABEL} mb-3 block`}>{eyebrow}</span>}
          <h2 className="text-2xl tracking-wide text-ozl-ink font-[family-name:var(--font-instrument-serif)] md:text-[2.1rem]">
            {title}
          </h2>
        </div>
        {aside && (
          <p className="max-w-xs text-[13px] leading-relaxed text-ozl-muted">{aside}</p>
        )}
      </motion.div>
      <motion.div variants={fade}>{children}</motion.div>
    </motion.section>
  )
}

export default function SaameProduct() {
  const [appId, setAppId] = useState(APPS[0].id)

  // Each app shows its home screen only -- the first in its list. The other
  // screens stay in the shared data but aren't offered here.
  const app = APPS.find((a) => a.id === appId) || APPS[0]
  const screen = app.screens[0]
  const Screen = RENDERERS[screen.id]
  const key = `${app.id}-${screen.id}`

  const selectApp = (id) => setAppId(id)

  return (
    <main className="relative w-full overflow-hidden bg-ozl-base pb-24 text-ozl-ink md:pb-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[900px] w-[1200px] -translate-x-1/2 -translate-y-1/3 bg-[radial-gradient(ellipse_at_center,rgba(108,99,255,0.14)_0%,rgba(125,211,252,0.08)_45%,transparent_72%)] blur-[120px]" />

      {/* Hero */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-28 md:px-8 md:pb-20 md:pt-36">
        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
          <motion.span variants={fade} className={`${LABEL} mb-5 block`}>
            Our own product
          </motion.span>
          <motion.h1
            variants={fade}
            className="max-w-3xl text-4xl leading-[1.05] tracking-wide text-ozl-ink font-[family-name:var(--font-instrument-serif)] md:text-[4rem]"
          >
            SAAME: the system a college{" "}
            <span className="italic text-ozl-muted">runs on.</span>
          </motion.h1>
          <motion.p
            variants={fade}
            className="mt-6 max-w-2xl text-base leading-relaxed text-ozl-ink/65 md:text-lg"
          >
            Attendance, mentoring, reports and parent notifications in one place, with an
            app each for teaching staff, the office and students. It replaces the register,
            the spreadsheet and the WhatsApp group with one system that holds the record.
          </motion.p>

          <motion.div variants={fade} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[linear-gradient(to_bottom,#2B3245_0%,#111827_100%)] px-6 text-sm font-medium text-white shadow-[0_14px_34px_-14px_rgba(17,24,39,0.65)] transition-all duration-ozl ease-ozl hover:brightness-110 [touch-action:manipulation]"
            >
              Book a walkthrough
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <span className="flex items-center gap-2 text-[12px] font-medium text-ozl-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Live at MLA Academy of Higher Learning, Bengaluru
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Walkthrough */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fade}
          className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white
          shadow-[0_30px_70px_-30px_rgba(15,23,42,0.22),0_1px_3px_rgba(15,23,42,0.05)]"
        >
          {/* App rail */}
          <div className="flex flex-wrap items-center justify-between gap-y-2 border-b border-slate-200/80 bg-slate-50/60 px-4 md:px-5">
            <div className="flex">
              {APPS.map((a) => {
                const on = a.id === appId
                return (
                  <button
                    key={a.id}
                    onClick={() => selectApp(a.id)}
                    className={`relative cursor-pointer px-3 py-4 text-[13px] tracking-tight transition-colors duration-ozl ease-ozl md:px-4 ${
                      on ? "font-semibold text-ozl-ink" : "font-medium text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {a.label}
                    {on && (
                      <motion.span
                        layoutId="saame-product-rail"
                        className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-ozl-violet md:inset-x-3"
                      />
                    )}
                  </button>
                )
              })}
            </div>
            <span className="pr-1 text-[11px] font-medium text-slate-400">{app.blurb}</span>
          </div>

          <div className="grid lg:grid-cols-[1fr_330px]">
            {/* Stage */}
            <div className="relative flex flex-col items-center overflow-hidden px-4 pt-7 sm:px-6">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(15,23,42,0.10) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 78% 68% at 50% 46%, black 16%, transparent 100%)",
                  maskImage:
                    "radial-gradient(ellipse 78% 68% at 50% 46%, black 16%, transparent 100%)",
                }}
              />
              <motion.div
                aria-hidden
                animate={{ opacity: [0.45, 0.72, 0.45], scale: [1, 1.06, 1] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute left-1/2 top-[54%] h-[380px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(108,99,255,0.30) 0%, rgba(125,211,252,0.16) 45%, transparent 72%)",
                  filter: "blur(58px)",
                }}
              />

              <div className="relative z-10 mt-auto flex w-full items-end justify-center">
                <AnimatePresence mode="wait">
                  {/* Fade and rise only: a scale that animates can leave the
                      screen rastered soft, as happened to the homepage console. */}
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 18 }}
                    transition={{ type: "spring", stiffness: 115, damping: 18 }}
                    className="flex w-full items-end justify-center"
                  >
                    {app.device === "mobile" ? (
                      <PhoneFrame>
                        <Screen />
                      </PhoneFrame>
                    ) : (
                      <div className="w-full max-w-[560px]">
                        <BrowserFrame url="saame.onezerolabs.in/office" scale={1.06}>
                          <Screen />
                        </BrowserFrame>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Detail */}
            <div className="flex flex-col border-t border-slate-200/80 p-6 lg:border-l lg:border-t-0 lg:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-1 flex-col"
                >
                  <h3 className="text-[19px] font-semibold tracking-tight text-ozl-ink">
                    {screen.name}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ozl-ink/60">{screen.desc}</p>

                  <div className="mt-7 space-y-2.5">
                    <div className="flex justify-end">
                      <p className="max-w-[90%] rounded-2xl rounded-br-md bg-[#FDECE0] px-3.5 py-2.5 text-[13px] leading-snug text-[#7C3F1D]">
                        {screen.ask}
                      </p>
                    </div>
                    <div className="flex justify-start">
                      <p className="max-w-[90%] rounded-2xl rounded-bl-md bg-[#E9EEFD] px-3.5 py-2.5 text-[13px] leading-snug text-[#26346B]">
                        {screen.reply}
                      </p>
                    </div>
                  </div>

                  <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-ozl-muted">
                    How it behaves
                  </p>
                  <ul className="mt-3.5 space-y-3">
                    {screen.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5">
                        <svg
                          viewBox="0 0 24 24"
                          className="mt-[3px] h-3.5 w-3.5 shrink-0 text-ozl-violet"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12l5 5L19 7" />
                        </svg>
                        <span className="text-[13px] leading-relaxed text-ozl-ink/70">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              <p className="mt-8 border-t border-slate-200/80 pt-5 text-[11px] leading-relaxed text-slate-400">
                Screens are the live product, rendered here with sample data. No student
                information is shown.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Modules */}
      <Section
        eyebrow="Scope"
        title="What it covers"
        aside="Six modules, one database. Nothing here is a separate product bolted on afterwards."
        className="mt-24 md:mt-32"
      >
        <div className="grid grid-cols-1 border-t border-ozl-glassBorder sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <div
              key={m.name}
              className={`relative border-b border-ozl-glassBorder p-6 transition-colors duration-ozl ease-ozl hover:bg-white/70 md:p-7
              ${i % 2 === 0 ? "sm:border-r" : ""}
              lg:border-r ${i % 3 === 2 ? "lg:border-r-0" : ""}
              ${i % 2 === 1 ? "sm:border-r-0 lg:border-r" : ""}`}
            >
              <div className="mb-4 flex items-center gap-2.5">
                <svg
                  viewBox="0 0 24 24"
                  className="text-ozl-violet"
                  style={{ height: 16, width: 16 }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={m.icon} />
                </svg>
                <p className="text-[15px] font-semibold tracking-tight text-ozl-ink">{m.name}</p>
              </div>
              <p className="text-[13.5px] leading-relaxed text-ozl-ink/60">{m.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Facts and close */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fade}
        className="relative z-10 mx-auto mt-24 w-full max-w-6xl px-4 md:mt-32 md:px-8"
      >
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.value} className="border-l border-ozl-glassBorder pl-4">
              <p className="text-[19px] font-semibold tracking-tight text-ozl-ink md:text-[22px]">
                {f.value}
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ozl-muted">{f.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-5 border-t border-ozl-glassBorder pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-[15px] leading-relaxed text-ozl-ink/70">
            If your institution still runs on registers and spreadsheets, this is what the
            alternative looks like.
          </p>
          <div className="flex shrink-0 gap-3">
            <Link
              href="/contact"
              className="flex min-h-[44px] items-center justify-center rounded-full bg-[linear-gradient(to_bottom,#2B3245_0%,#111827_100%)] px-6 text-sm font-medium text-white shadow-[0_14px_34px_-14px_rgba(17,24,39,0.65)] transition-all duration-ozl ease-ozl hover:brightness-110 [touch-action:manipulation]"
            >
              Talk to us
            </Link>
            <Link
              href="/"
              className="flex min-h-[44px] items-center justify-center rounded-full border border-ozl-glassBorder bg-white px-6 text-sm font-medium text-ozl-ink transition-all duration-ozl ease-ozl hover:bg-white/90 [touch-action:manipulation]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  )
}
