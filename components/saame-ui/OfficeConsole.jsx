"use client"

import { officeStudents, officeMeta, officeNav } from "./demo"

/**
 * The office console, laid out the way the reference lays out its app: a
 * frosted navigation card beside a solid working area, with a breadcrumb, a
 * table of people, and a detail panel down the right.
 *
 * The features are SAAME's own. The navigation groups match the real console's
 * pages (non-teaching/), the table is the student list measured against the
 * 75% attendance requirement the product enforces, and the detail panel carries
 * the fields an administrator actually looks at: programme, semester, sessions
 * held, requirement.
 *
 * Every person and figure is invented. See ./demo for why that matters here.
 */

const TONES = {
  green: "bg-[#E4F5EA] text-[#1B7A45]",
  amber: "bg-[#FBEFD4] text-[#8A6212]",
  red: "bg-[#FBE2E6] text-[#B32741]",
}

const AVATAR = {
  green: "bg-[#DDF0E4] text-[#1B7A45]",
  amber: "bg-[#F7E7C9] text-[#8A6212]",
  red: "bg-[#F8DCE1] text-[#B32741]",
}

/* Frosted: this is one of the two pieces the reference puts glass on, the
   other being the top bar. The working area beside it stays opaque. */
export function OfficeSidebar() {
  return (
    <div className="flex h-full w-full flex-col gap-3 bg-white/[0.58] px-2.5 py-3 backdrop-blur-xl">
      {officeNav.map((group, gi) => (
        <div key={gi}>
          {group.section && (
            <p className="mb-1.5 px-2 text-[7px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {group.section}
            </p>
          )}
          <div className="space-y-[2px]">
            {group.items.map((item) => (
              <div
                key={item.name}
                className={`flex items-center gap-1.5 rounded-md px-2 py-[5px] ${
                  item.active ? "bg-white text-[#5B5BD6] shadow-sm" : "text-slate-600"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-2.5 w-2.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={item.icon} />
                </svg>
                <span className={`flex-1 truncate text-[8px] ${item.active ? "font-bold" : "font-medium"}`}>
                  {item.name}
                </span>
                {item.badge && (
                  <span className="rounded-full bg-slate-200/80 px-1 text-[6px] font-bold text-slate-600">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function OfficeStudents() {
  return (
    <div className="h-[360px] w-full overflow-hidden bg-white px-4 py-3.5 text-[#12161F]">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[8px] font-medium text-slate-400">
          <span>Attendance</span>
          <svg viewBox="0 0 24 24" className="h-2 w-2" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-600">BCA, Semester 5</span>
        </div>
        <span className="rounded-md border border-slate-200 px-2 py-[3px] text-[7.5px] font-medium text-slate-600">
          Export
        </span>
      </div>

      <h3 className="mb-2.5 text-[17px] font-[family-name:var(--font-instrument-serif)] tracking-wide">
        Students
      </h3>

      <div className="flex gap-2.5">
        {/* Table */}
        <div className="min-w-0 flex-1 overflow-hidden rounded-lg border border-slate-200/90">
          <div className="grid grid-cols-[1.5fr_0.7fr_0.8fr_0.8fr] gap-1 border-b border-slate-200/90 bg-slate-50/70 px-2.5 py-1.5">
            {["Name", "Attendance", "Last marked", "Status"].map((h) => (
              <span key={h} className="truncate text-[6.5px] font-bold uppercase tracking-[0.1em] text-slate-400">
                {h}
              </span>
            ))}
          </div>
          {officeStudents.map((s, i) => (
            <div
              key={s.name}
              className={`grid grid-cols-[1.5fr_0.7fr_0.8fr_0.8fr] items-center gap-1 px-2.5 py-2 ${
                i < officeStudents.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[5.5px] font-bold ${AVATAR[s.tone]}`}>
                  {s.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[8px] font-semibold leading-tight">{s.name}</p>
                  <p className="truncate text-[6.5px] text-slate-400">{s.subject}</p>
                </div>
              </div>
              <span className="text-[9px] font-bold">{s.pct}%</span>
              <span className="truncate text-[7px] text-slate-500">{s.last}</span>
              <span className={`justify-self-start rounded px-1.5 py-[2px] text-[6.5px] font-semibold ${TONES[s.tone]}`}>
                {s.status}
              </span>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="w-[122px] shrink-0 space-y-1.5 rounded-lg border border-slate-200/90 p-2">
          {officeMeta.map((m) => (
            <div key={m.label} className="flex items-center justify-between gap-1">
              <span className="truncate text-[7px] font-medium text-slate-500">{m.label}</span>
              <span className="flex shrink-0 items-center gap-1 rounded border border-slate-200 px-1 py-[2px]">
                <svg viewBox="0 0 24 24" className="h-2 w-2 text-[#5B5BD6]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={m.icon} />
                </svg>
                <span className="text-[7px] font-semibold">{m.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Second section, as the reference carries one below the table */}
      <h3 className="mb-2 mt-3.5 text-[15px] font-[family-name:var(--font-instrument-serif)] tracking-wide">
        Mentoring
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {[
          { title: "Session register", note: "One per mentor per day" },
          { title: "Mentor mapping", note: "42 mentees assigned" },
        ].map((c) => (
          <div key={c.title} className="rounded-lg border border-slate-200/90 px-2.5 py-2">
            <p className="text-[8px] font-semibold">{c.title}</p>
            <p className="mt-0.5 text-[6.5px] text-slate-400">{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
