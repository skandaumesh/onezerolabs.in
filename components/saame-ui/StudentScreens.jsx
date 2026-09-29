"use client"

import {
  studentName,
  studentInitials,
  studentToday,
  studentOverall,
  studentInsights,
} from "./demo"

const SHELL =
  "relative h-full w-full overflow-hidden rounded-t-[2.1rem] bg-[#EDECEA] pt-7 pb-4"

/* Bar heights and the threshold line are both derived from this, in pixels,
   so they cannot drift apart the way two percentage scales did. */
const CHART_H = 68

function Header() {
  return (
    <div className="flex items-center gap-2.5 px-3.5 pb-3 pt-1">
      <div className="flex flex-col gap-[3px]">
        <span className="h-[2px] w-3.5 rounded bg-[#12161F]" />
        <span className="h-[2px] w-2.5 rounded bg-[#12161F]" />
      </div>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="text-[9.5px] font-semibold text-[#7E93A8]">{studentToday.greeting}</p>
        <p className="truncate text-[13px] font-bold text-[#12161F]">{studentName}</p>
      </div>
      <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#12161F" strokeWidth="2" strokeLinecap="round">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#E5334A] text-[7px] font-bold text-white">
          1
        </span>
      </div>
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5B841] text-[9px] font-bold text-white">
        {studentInitials}
      </div>
    </div>
  )
}

export function StudentDaily() {
  const { date, present, absent, schedule } = studentToday
  return (
    <div className={SHELL}>
      <Header />

      <div className="mx-3.5 rounded-3xl bg-[#DDE3F7] px-3 py-3.5">
        <p className="text-center text-[14px] font-bold text-[#12161F]">Today&apos;s Status</p>

        <div className="mx-auto mt-2.5 flex w-[85%] items-center justify-between rounded-full bg-[#EDF1FB] px-1 py-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="#12161F" strokeWidth="2.6" strokeLinecap="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </span>
          <span className="text-[10px] font-bold text-[#12161F]">{date}</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="#12161F" strokeWidth="2.6" strokeLinecap="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>

        <div className="mt-3 flex items-center rounded-2xl bg-[#EDF1FB] py-3">
          <div className="flex-1 text-center">
            <div className="mb-1 flex items-center justify-center gap-1">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#D6F2E0]">
                <svg viewBox="0 0 24 24" className="h-2 w-2" fill="none" stroke="#1B9E57" strokeWidth="3.4" strokeLinecap="round">
                  <path d="M5 12l5 5L19 7" />
                </svg>
              </span>
              <span className="text-[9.5px] font-semibold text-slate-500">Present</span>
            </div>
            <p className="text-[26px] font-semibold leading-none text-[#12161F]">{present}</p>
          </div>
          <span className="h-9 w-px bg-slate-300/60" />
          <div className="flex-1 text-center">
            <div className="mb-1 flex items-center justify-center gap-1">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FBDDE1]">
                <svg viewBox="0 0 24 24" className="h-2 w-2" fill="none" stroke="#E5334A" strokeWidth="3.4" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </span>
              <span className="text-[9.5px] font-semibold text-slate-500">Absent</span>
            </div>
            <p className="text-[26px] font-semibold leading-none text-[#E5334A]">{absent}</p>
          </div>
        </div>
      </div>

      <p className="mb-2 mt-3.5 px-3.5 text-[10px] font-bold tracking-wide text-[#7E93A8]">
        CLASS SCHEDULE
      </p>

      <div className="space-y-2 px-3.5">
        {schedule.map((s) => {
          const out = s.status === "Absent"
          return (
            <div key={s.subject} className="flex items-center gap-2.5 rounded-2xl bg-[#F4F3F1] px-2.5 py-2.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9.5px] font-bold ${
                  out ? "bg-[#FBDDE1] text-[#E5334A]" : "bg-[#D6F2E0] text-[#1B9E57]"
                }`}
              >
                {s.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-bold leading-tight text-[#12161F]">{s.subject}</p>
                <p className="mt-0.5 text-[9px] font-medium text-slate-400">{s.time}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${
                  out ? "bg-[#FBDDE1] text-[#E5334A]" : "bg-[#D6F2E0] text-[#1B9E57]"
                }`}
              >
                {s.status}
              </span>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export function StudentOverall() {
  const { attendance, present, absent, subjects } = studentOverall
  return (
    <div className={SHELL}>
      <Header />

      <div className="mx-3.5 rounded-3xl bg-[#DDE3F7] p-3">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[13px] font-bold text-[#12161F]">Overall Performance</p>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="#12161F" strokeWidth="2.4" strokeLinecap="round">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-2xl bg-[#EDF1FB] px-3 py-3">
            <div className="mb-1 flex items-center gap-1">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-slate-300 text-[6px] font-bold text-slate-500">
                %
              </span>
              <span className="text-[9.5px] font-semibold text-slate-500">Attendance</span>
            </div>
            <p className="text-[28px] font-light leading-none text-[#12161F]">{attendance}%</p>
          </div>
          <div className="flex w-[40%] flex-col gap-2">
            <div className="flex items-center justify-between rounded-2xl bg-[#EDF1FB] px-2.5 py-2">
              <span className="text-[9px] font-medium text-slate-500">Present</span>
              <span className="text-[15px] font-semibold text-[#12161F]">{present}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#EDF1FB] px-2.5 py-2">
              <span className="text-[9px] font-medium text-slate-500">Absent</span>
              <span className="text-[15px] font-semibold text-[#E5334A]">{absent}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mb-2 mt-3.5 px-3.5 text-[10px] font-bold tracking-wide text-[#7E93A8]">
        SUBJECT BREAKDOWN
      </p>

      <div className="space-y-2 px-3.5">
        {subjects.map((s) => {
          const low = s.pct < studentInsights.threshold
          return (
            <div key={s.name} className="rounded-2xl bg-[#F4F3F1] px-2.5 py-2.5">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9.5px] font-bold ${
                    low ? "bg-[#FBDDE1] text-[#E5334A]" : "bg-[#D6F2E0] text-[#1B9E57]"
                  }`}
                >
                  {s.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-bold leading-tight text-[#12161F]">{s.name}</p>
                  <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                    {s.present} present &middot; {s.absent} absent
                  </p>
                </div>
                <span className="shrink-0 text-[17px] font-semibold text-[#12161F]">{s.pct}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                <div
                  className={`h-full rounded-full ${low ? "bg-[#E5334A]" : "bg-[#1B9E57]"}`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export function StudentInsights() {
  const { enrolled, passing, atRisk, threshold, bars } = studentInsights
  const max = 100
  return (
    <div className={SHELL}>
      <Header />

      <div className="mx-3.5 rounded-3xl bg-[#F4F3F1] p-3">
        <div className="mb-1.5 flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#12161F" strokeWidth="1.8">
            <rect x="4" y="3" width="13" height="17" rx="1.5" />
            <path d="M8 8h5M8 12h5" />
          </svg>
          <span className="text-[11.5px] font-bold text-[#12161F]">Enrolled Subjects</span>
        </div>
        <p className="text-[30px] font-light leading-none text-[#12161F]">{enrolled}</p>

        <div className="mt-2.5 flex gap-2">
          <div className="flex-1 rounded-2xl bg-white px-2.5 py-2">
            <div className="mb-0.5 flex items-center gap-1">
              <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#1B9E57]">
                <svg viewBox="0 0 24 24" className="h-2 w-2" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
                  <path d="M5 12l5 5L19 7" />
                </svg>
              </span>
              <span className="text-[8.5px] font-semibold text-slate-500">
                Passing (&ge;{threshold}%)
              </span>
            </div>
            <p className="text-[19px] font-semibold leading-none text-[#0F6B3C]">{passing}</p>
          </div>
          <div className="flex-1 rounded-2xl bg-white px-2.5 py-2">
            <div className="mb-0.5 flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="#E5334A">
                <path d="M12 3l10 18H2z" />
              </svg>
              <span className="text-[8.5px] font-semibold text-slate-500">
                At Risk (&lt;{threshold}%)
              </span>
            </div>
            <p className="text-[19px] font-semibold leading-none text-[#E5334A]">{atRisk}</p>
          </div>
        </div>

        <div className="mt-2 flex gap-2 rounded-2xl bg-[#FBEFC8] px-2.5 py-2">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="#9A7B12">
            <path d="M12 3l10 18H2z" />
          </svg>
          <p className="text-[9.5px] font-semibold leading-snug text-[#7A6210]">
            You have <span className="font-bold">{atRisk} subjects</span> with attendance below the
            required {threshold}% limit. Check the detailed breakdown below.
          </p>
        </div>
      </div>

      <div className="mx-3.5 mt-2.5 rounded-3xl bg-[#F4F3F1] px-3 pb-2.5 pt-3">
        <div className="mb-2 flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#12161F" strokeWidth="2" strokeLinecap="round">
            <path d="M5 20V11M12 20V5M19 20v-6" />
          </svg>
          <span className="text-[11.5px] font-bold text-[#12161F]">Subject Attendance</span>
        </div>

        {/* Each bar is a direct child of the fixed-height row, so its
            percentage height resolves against that row and nothing else, and
            the threshold line can use the same scale. The first attempt nested
            the bar under a per-column flex wrapper together with its label:
            the percentage then had no height to resolve against and every bar
            collapsed, and compensating with a second scale factor put the 75%
            line above bars worth 86% and 88%. The label is absolute here so it
            never takes part in the sizing. */}
        <div className="relative pt-4">
          <div className="relative border-l border-slate-300/70 pl-1.5" style={{ height: CHART_H }}>
            {/* The threshold the product actually enforces */}
            <div
              className="absolute inset-x-0 z-10 border-t border-dashed border-[#E5334A]/70"
              style={{ bottom: (threshold / max) * CHART_H }}
            />
            <div className="flex h-full items-end gap-1">
              {bars.map((b, i) => {
                const low = b < threshold
                return (
                  <div
                    key={i}
                    className={`relative flex-1 rounded-full ${
                      low ? "bg-[#F5A3AE]" : "bg-[#CFD8E6]"
                    }`}
                    style={{ height: (b / max) * CHART_H }}
                  >
                    <span
                      className={`absolute -top-[13px] left-1/2 -translate-x-1/2 text-[8px] font-bold ${
                        low ? "text-[#E5334A]" : "text-slate-500"
                      }`}
                    >
                      {b}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
