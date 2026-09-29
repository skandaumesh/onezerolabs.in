"use client"

import { Bell, ChartColumn, Check, Clock, RefreshCw } from "lucide-react"

/**
 * Illustrations for the three service cards: real UI pieces with real words,
 * shown straight on, stacked for depth and faded into the card.
 *
 * Tuned against the first version's failures: stacks are narrower so their
 * right-hand chips stay inside the card after rotation, the stack is tighter so
 * the front card sits above the fade instead of inside it, and the calendar is
 * two weeks at a larger size so its labels stay readable.
 */

const TONES = {
  amber: "border-[#FCD34D] bg-[#FFFBEB] text-[#D97706]",
  green: "border-[#86EFAC] bg-[#F0FDF4] text-[#16A34A]",
  slate: "border-[#CBD5E1] bg-[#F8FAFC] text-[#475569]",
}

function Chip({ tone, children }) {
  return (
    <span
      className={`ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${TONES[tone]}`}
    >
      <Clock size={11} strokeWidth={2.5} />
      {children}
    </span>
  )
}

/* 01 Software & AI -- a stack of automations, the front one expanded. */

function TaskCard({ icon: Icon, title, time, tone, className = "", children }) {
  return (
    <div
      className={`absolute inset-x-0 rounded-2xl border border-[#0E1A33]/[0.07] bg-white p-4
      shadow-[0_12px_28px_-14px_rgba(15,23,42,0.22)] transition-transform duration-700 ease-ozl ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <Icon size={15} strokeWidth={2} className="shrink-0 text-[#0E1A33]/70" />
        <span className="truncate text-[15px] font-medium text-[#0E1A33]">{title}</span>
        <Chip tone={tone}>{time}</Chip>
      </div>
      {children}
    </div>
  )
}

function Automations() {
  return (
    <div className="absolute left-[10%] top-[9%] w-[80%]">
      <div className="relative h-[260px]">
        <TaskCard
          icon={RefreshCw}
          title="Attendance Sync"
          time="≈ 12s"
          tone="green"
          className="top-0 origin-top scale-[0.88] opacity-70 group-hover:-translate-y-1.5"
        />
        <TaskCard
          icon={Bell}
          title="Fee Reminders"
          time="≈ 30s"
          tone="amber"
          className="top-[38px] origin-top scale-[0.94] opacity-90"
        />
        <TaskCard
          icon={ChartColumn}
          title="Report Builder"
          time="≈ 2m"
          tone="slate"
          className="top-[76px] group-hover:translate-y-2"
        >
          <p className="mt-2.5 text-[13px] leading-snug text-[#64748B]">
            The weekly report, built from attendance, marks and fees.
          </p>
          <div className="mt-3 flex gap-2">
            {["Dashboards", "Automation", "AI"].map((t) => (
              <span
                key={t}
                className="rounded-lg bg-[#0E1A33]/[0.05] px-2.5 py-1 text-[12px] font-medium text-[#475569]"
              >
                {t}
              </span>
            ))}
          </div>
        </TaskCard>
      </div>
    </div>
  )
}

/* 02 Websites -- a launch checklist, the last step still running. */

const STEPS = [
  { label: "Design approved", when: "Week 1", state: "done" },
  { label: "Pages built", when: "Week 2", state: "done" },
  { label: "SEO & analytics", when: "Week 3", state: "done" },
  { label: "Going live", when: "Week 4", state: "active" },
]

function Status({ state }) {
  if (state === "done") {
    return (
      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#22C55E]">
        <Check size={11} strokeWidth={3.5} className="text-white" />
      </span>
    )
  }
  return (
    <span className="h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-[#F59E0B] border-t-transparent" />
  )
}

function Launch() {
  return (
    <div className="absolute left-[10%] top-[12%] w-[80%] transition-transform duration-700 ease-ozl group-hover:-translate-y-2">
      <div>
        {/* A second sheet behind, offset, gives the panel thickness. */}
        <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl border border-[#0E1A33]/[0.05] bg-[#F1F4F8]" />

        <div className="relative rounded-2xl border border-[#0E1A33]/[0.07] bg-white px-4 pb-1 pt-3.5 shadow-[0_14px_30px_-14px_rgba(15,23,42,0.22)]">
          <div className="mb-1.5 flex items-center gap-2 text-[14px] text-[#64748B]">
            <Check size={14} strokeWidth={2.5} />
            Site launch
          </div>
          {STEPS.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2.5 border-t border-[#0E1A33]/[0.06] py-2.5"
            >
              <Status state={s.state} />
              <span
                className={`text-[15px] ${s.state === "done" ? "text-[#334155]" : "text-[#64748B]"}`}
              >
                {s.label}
              </span>
              <span className="ml-auto font-mono text-[11px] text-[#94A3B8]">{s.when}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* 03 Brand & Social -- two weeks of scheduled content. */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]

// Two working weeks of October. Weekends are left off the grid.
const DATES = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12]

const SCHEDULE = {
  2: { label: "Post", tone: "green" },
  4: { label: "Reel", tone: "amber" },
  9: { label: "Post", tone: "green" },
  11: { label: "Story", tone: "slate" },
}

function Calendar() {
  return (
    <div className="absolute left-[10%] top-[10%] w-[80%] transition-transform duration-700 ease-ozl group-hover:-translate-y-2">
      <div>
        <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl border border-[#0E1A33]/[0.05] bg-[#F1F4F8]" />

        <div className="relative rounded-2xl border border-[#0E1A33]/[0.07] bg-white p-3.5 shadow-[0_14px_30px_-14px_rgba(15,23,42,0.22)]">
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="text-[15px] font-medium text-[#0E1A33]">Content calendar</span>
            <span className="font-mono text-[11px] text-[#94A3B8]">October</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {DAYS.map((d, i) => (
              <span key={i} className="pb-0.5 text-center font-mono text-[10px] text-[#94A3B8]">
                {d}
              </span>
            ))}
            {DATES.map((day) => {
              const item = SCHEDULE[day]
              return (
                <div
                  key={day}
                  className="flex h-[44px] flex-col justify-between rounded-md border border-[#0E1A33]/[0.05] bg-[#F8FAFC] p-1"
                >
                  <span className="text-[10px] leading-none text-[#94A3B8]">{day}</span>
                  {item && (
                    <span
                      className={`truncate rounded-[4px] border px-1 text-[10px] font-semibold leading-[14px] ${TONES[item.tone]}`}
                    >
                      {item.label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const ILLUSTRATIONS = { "01": Automations, "02": Launch, "03": Calendar }

export default function DoorIllustration({ id }) {
  const Illustration = ILLUSTRATIONS[id]
  if (!Illustration) return null

  return (
    // Negative margins cancel the panel padding so the art runs to the card's
    // edges and is cropped by its rounded corners; the mask fades it out below.
    <div
      aria-hidden
      className="relative -mx-6 -mt-6 mb-5 h-[190px] overflow-hidden sm:-mx-7 sm:-mt-7 md:-mx-8 md:-mt-8 md:mb-6"
      style={{
        maskImage: "linear-gradient(to bottom, black 68%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 68%, transparent 100%)",
      }}
    >
      {/* Laid out 1/0.82 larger and scaled down as one unit, so every piece
          keeps its proportions at the card's size. */}
      <div
        className="absolute left-0 top-0"
        style={{ width: "122%", height: "122%", transform: "scale(0.82)", transformOrigin: "top left" }}
      >
        <Illustration />
      </div>
    </div>
  )
}
