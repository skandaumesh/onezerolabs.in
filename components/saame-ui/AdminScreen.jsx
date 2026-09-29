"use client"

import { adminStats, adminTrend, adminClasses, adminNav } from "./demo"

/**
 * The office dashboard.
 *
 * Deliberately not labelled with an institution name. The product is live at
 * MLA Academy and the section says so, but the figures on this screen are
 * invented, so attaching MLA's name to them would present made-up numbers as
 * the client's real ones. The screenshot this replaces did show MLA's actual
 * totals, which was the client's data to publish and not ours.
 */

const NAV_ICONS = {
  Dashboard: "M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 14h7v6H4z",
  Students: "M4 20v-1a5 5 0 0 1 10 0v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  Reports: "M6 3h9l4 4v14H6zM14 3v5h5",
  "View Attendance": "M4 5h16v16H4zM4 10h16M9 3v4M15 3v4",
  Promote: "M4 18l6-6 4 4 6-8",
  "AI Assistant": "M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7z",
  Teachers: "M3 7l9-4 9 4-9 4zM7 11v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5",
  "Parent Status": "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9",
  Announcements: "M4 10v4h3l5 4V6L7 10zM16 9a4 4 0 0 1 0 6",
  Mentors: "M4 20v-1a5 5 0 0 1 10 0v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 20v-1a4 4 0 0 0-3-3.8",
}

/* The sidebar, on its own. The homepage floats this as a separate card over
   the window, the way the reference detaches it; the product page keeps it
   attached inside AdminDashboard below. */
export function AdminSidebar({ floating = false, glass = false }) {
  const surface = glass ? "bg-white/[0.58] backdrop-blur-xl" : "bg-white"
  return (
    <aside className={`flex w-[132px] shrink-0 flex-col py-3 ${surface} ${
        floating ? "rounded-xl" : "border-r border-slate-200/80"
      }`}>
      <div className="mb-3 flex items-center gap-1.5 px-3">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B0D12] text-[5px] font-bold text-white">
          LABS
        </div>
        <span className="text-[7.5px] font-bold leading-tight text-slate-500">
          SAAME
          <br />
          <span className="font-medium text-slate-400">Office Console</span>
        </span>
      </div>

      <nav className="space-y-[1px] px-1.5">
        {adminNav.map((item) => {
          const on = item === "Dashboard"
          return (
            <div
              key={item}
              className={`flex items-center gap-1.5 rounded-md px-2 py-[5px] ${
                on ? "bg-[#EEEFFC] text-[#5B5BD6]" : "text-slate-500"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d={NAV_ICONS[item]} />
              </svg>
              <span className={`truncate text-[8px] ${on ? "font-bold" : "font-medium"}`}>{item}</span>
            </div>
          )
        })}
      </nav>

      <div className="mt-auto px-3">
        <p className="mb-1 text-[6.5px] font-bold tracking-wider text-slate-400">QUICK STATS</p>
        <div className="mb-1 flex items-center gap-1.5">
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#D6F2E0] text-[6px] font-bold text-[#1B9E57]">
            P
          </span>
          <span className="text-[7.5px] font-medium text-slate-500">412 Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#FBDDE1] text-[6px] font-bold text-[#E5334A]">
            A
          </span>
          <span className="text-[7.5px] font-medium text-slate-500">70 Absent</span>
        </div>
      </div>
    </aside>
  )
}

export function AdminMain() {
  const max = 100
  const card = "bg-white"
  return (
    <div className="min-w-0 flex-1 overflow-hidden px-3.5 py-3">
      <p className="text-[13px] font-bold">Welcome back</p>
      <p className="mb-2.5 text-[7.5px] font-medium text-slate-400">Tuesday, 15 September 2026</p>

      {/* Stat cards */}
      <div className="mb-2.5 grid grid-cols-4 gap-1.5">
        {adminStats.map((s) => (
          <div key={s.label} className={`rounded-lg border border-slate-200/80 ${card} px-2 py-1.5`}>
            <p className="truncate text-[6.5px] font-semibold text-slate-400">{s.label}</p>
            <p className="mt-0.5 text-[15px] font-bold leading-none">{s.value}</p>
            <p className="mt-1 text-[5.5px] text-slate-300">Updated just now</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {/* Trend */}
        <div className={`min-w-0 flex-1 rounded-lg border border-slate-200/80 ${card} p-2.5`}>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[8.5px] font-bold">Attendance Trend</p>
            <div className="flex gap-[2px] rounded bg-slate-100 p-[2px]">
              {["Week", "Month", "Year"].map((t) => (
                <span
                  key={t}
                  className={`rounded px-1.5 py-[2px] text-[6px] font-semibold ${
                    t === "Month" ? "bg-white text-[#12161F] shadow-sm" : "text-slate-400"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex h-[112px] items-end gap-[3px] border-l border-slate-200 pl-1.5">
            {adminTrend.map((v, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-[2px] ${i % 3 === 1 ? "bg-[#F5C86B]" : "bg-[#F19AA6]"}`}
                style={{ height: `${(v / max) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="w-[150px] shrink-0 space-y-2">
          <div className={`rounded-lg border border-slate-200/80 ${card} p-2`}>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[8.5px] font-bold">Today</p>
              <span className="text-[6px] text-slate-400">3 classes</span>
            </div>
            <div className="flex gap-1.5">
              <div className="flex-1 rounded bg-[#E9F7EF] py-1.5 text-center">
                <p className="text-[13px] font-bold leading-none text-[#1B9E57]">128</p>
                <p className="mt-0.5 text-[5.5px] font-semibold text-[#1B9E57]/70">PRESENT</p>
              </div>
              <div className="flex-1 rounded bg-[#FCEDEF] py-1.5 text-center">
                <p className="text-[13px] font-bold leading-none text-[#E5334A]">17</p>
                <p className="mt-0.5 text-[5.5px] font-semibold text-[#E5334A]/70">ABSENT</p>
              </div>
            </div>
            <div className="mt-1.5 flex items-center justify-between border-t border-slate-100 pt-1.5">
              <div>
                <p className="text-[5.5px] font-semibold text-slate-400">RATE</p>
                <p className="text-[9px] font-bold">88%</p>
              </div>
              <div className="text-right">
                <p className="text-[5.5px] font-semibold text-slate-400">CLASSES</p>
                <p className="text-[9px] font-bold">3</p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg border border-slate-200/80 ${card} p-2`}>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[8.5px] font-bold">
                All Classes <span className="font-medium text-slate-400">(28)</span>
              </p>
              <div className="flex gap-[2px]">
                <span className="rounded bg-slate-100 px-1 py-[1px] text-[5.5px] font-semibold text-[#12161F]">
                  Best
                </span>
                <span className="rounded px-1 py-[1px] text-[5.5px] font-semibold text-slate-400">
                  Worst
                </span>
              </div>
            </div>
            <div className="space-y-[3px]">
              {adminClasses.map((c) => (
                <div key={c.rank} className="flex items-center gap-1.5">
                  <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[#FBEFC8] text-[5.5px] font-bold text-[#9A7B12]">
                    {c.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[7px] font-bold leading-tight">{c.name}</p>
                    <p className="text-[5.5px] text-slate-400">{c.sessions}</p>
                  </div>
                  <span className="shrink-0 text-[7.5px] font-bold text-[#1B9E57]">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Both halves together, as the console really looks. */
export function AdminDashboard() {
  return (
    <div className="flex h-[360px] w-full overflow-hidden bg-[#FBFBFD] text-[#12161F]">
      <AdminSidebar />
      <AdminMain />
    </div>
  )
}
