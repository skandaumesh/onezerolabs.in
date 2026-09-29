"use client"

import {
  teacherName,
  teacherClasses,
  teacherSubjects,
  aiQuery,
  aiAnswer,
} from "./demo"

const SHELL =
  "relative h-full w-full overflow-hidden rounded-t-[2.1rem] bg-[#F6F7FB] pt-7 pb-4"

function Header() {
  return (
    <div className="flex items-center gap-2.5 px-3.5 pb-2.5 pt-1">
      {/* A stand-in teacher, not a real SAAME user: an Unsplash-licensed
          portrait (photo-1679138118375-47f78db3761d), cropped to 160px. */}
      <img
        src="/saame/teacher-avatar.jpg"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white"
        draggable={false}
      />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="text-[9px] font-medium text-slate-400">Hello,</p>
        <p className="truncate text-[13px] font-bold text-[#12161F]">{teacherName}</p>
      </div>
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#12161F" strokeWidth="2" strokeLinecap="round">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
      </div>
      <div className="flex h-7 w-7 flex-col items-center justify-center gap-[3px] rounded-lg bg-white shadow-sm">
        <span className="h-[1.5px] w-3.5 rounded bg-[#12161F]" />
        <span className="h-[1.5px] w-3.5 rounded bg-[#12161F]" />
        <span className="h-[1.5px] w-3.5 rounded bg-[#12161F]" />
      </div>
    </div>
  )
}

function WelcomeCard() {
  return (
    <div className="mx-3.5 mb-3 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.12)]">
      <div className="min-w-0 flex-1">
        <p className="text-[8.5px] font-bold tracking-wide text-slate-400">WELCOME!</p>
        <p className="mt-0.5 text-[11.5px] font-semibold text-slate-600">
          Let&apos;s schedule your classes
        </p>
      </div>
      <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg bg-[#D7F0F2]">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#2F7E86" strokeWidth="1.6">
          <rect x="3" y="4" width="18" height="11" rx="1.5" />
          <path d="M7 19h10M9 15v4M15 15v4" />
        </svg>
      </div>
    </div>
  )
}

export function TeacherHome() {
  return (
    <div className={SHELL}>
      <Header />
      <WelcomeCard />

      <div className="mb-2 flex items-center justify-between px-3.5">
        <h3 className="text-[15px] font-bold text-[#12161F]">My Classes</h3>
        <span className="rounded-full bg-[#E8E9FB] px-2.5 py-0.5 text-[10px] font-bold text-[#5B5BD6]">
          {teacherClasses.length}
        </span>
      </div>

      <div className="space-y-2.5 px-3.5">
        {teacherClasses.map((c) => (
          <div key={c.code} className="rounded-2xl bg-white p-3 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.1)]">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-md bg-[#EEEFFC] px-1.5 py-0.5 text-[9px] font-bold text-[#5B5BD6]">
                {c.code}
              </span>
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="#94A3B8" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEEFFC]">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#5B5BD6" strokeWidth="1.8">
                  <path d="M4 5h7v14H4zM13 5h7v14h-7z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold text-[#12161F]">{c.subject}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="rounded bg-[#EEEFFC] px-1.5 py-0.5 text-[8px] font-bold text-[#5B5BD6]">
                    {c.stream}
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-semibold text-slate-500">
                    {c.sem}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 py-2">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#5B5BD6" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h11M3 12h8M3 18h6M16 14l4 4-4 4" />
              </svg>
              <span className="text-[11px] font-semibold text-[#5B5BD6]">Take Attendance</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export function TeacherSubjects() {
  return (
    <div className={SHELL}>
      <Header />
      <WelcomeCard />

      <div className="mb-2 flex items-center justify-between px-3.5">
        <h3 className="text-[15px] font-bold text-[#12161F]">Subjects</h3>
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#5B5BD6] shadow-md">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
      </div>

      <div className="space-y-2 px-3.5">
        {teacherSubjects.map((s) => (
          <div key={s.name} className="flex items-center gap-2 rounded-2xl bg-white px-2.5 py-2 shadow-[0_2px_8px_-4px_rgba(15,23,42,0.1)]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEEFFC]">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#5B5BD6" strokeWidth="1.8" strokeLinejoin="round">
                <path d="M12 4 2 9l10 5 10-5zM5 12v4c0 1.5 3.5 3 7 3s7-1.5 7-3v-4" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10.5px] font-bold text-[#12161F]">{s.name}</p>
              <p className="text-[9px] font-medium text-slate-400">
                {s.stream} &middot; {s.sem}
              </p>
            </div>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5C6675]">
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#5C6675" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
            </svg>
          </div>
        ))}
      </div>

    </div>
  )
}

export function TeacherAI() {
  return (
    <div className={SHELL}>
      {/* Assistant header */}
      <div className="flex items-center gap-2 px-3.5 pb-3 pt-1">
        <div className="flex h-7 w-7 flex-col items-center justify-center gap-[3px] rounded-lg bg-white shadow-sm">
          <span className="h-[1.5px] w-3.5 rounded bg-[#5B5BD6]" />
          <span className="h-[1.5px] w-3.5 rounded bg-[#5B5BD6]" />
          <span className="h-[1.5px] w-3.5 rounded bg-[#5B5BD6]" />
        </div>
        <p className="flex-1 text-center text-[14px] font-bold text-[#12161F]">AI Assistant</p>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5B5BD6] shadow-sm">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
          </svg>
        </div>
      </div>

      {/* Question */}
      <div className="mb-3 flex justify-end px-3.5">
        <div className="max-w-[78%] rounded-2xl rounded-tr-md bg-[#EEEFFC] px-3 py-2">
          <p className="text-[10.5px] font-medium text-[#12161F]">{aiQuery}</p>
        </div>
      </div>

      {/* Answer, resolved from the database */}
      <div className="flex gap-2 px-3.5">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8E9FB]">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="#5B5BD6">
            <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] font-bold text-[#12161F]">{aiAnswer.name}</p>
          <p className="mt-1.5 text-[10px] font-bold text-[#12161F]">Student Details:</p>
          <ul className="mt-1 space-y-[3px]">
            {aiAnswer.rows.map(([k, v]) => (
              <li key={k} className="flex items-baseline gap-1.5">
                <span className="text-[7px] text-[#5B5BD6]">&#9679;</span>
                <span className="text-[9.5px] font-bold text-[#12161F]">{k}:</span>
                <span className="text-[9.5px] text-slate-500">{v}</span>
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-[9.5px]">
            <span className="font-bold text-[#12161F]">Parent Phone: </span>
            <span className="text-slate-500">{aiAnswer.parentPhone}</span>
          </p>
          <p className="mt-1 text-[9.5px]">
            <span className="font-bold text-[#12161F]">Mentor: </span>
            <span className="text-slate-500">{aiAnswer.mentor}</span>
          </p>

          <div className="mt-2.5 space-y-1.5">
            {aiAnswer.followUps.map((f) => (
              <div key={f} className="flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1.5">
                <span className="text-[9px]">&#128161;</span>
                <span className="truncate text-[9px] font-medium text-slate-600">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className="absolute inset-x-3 bottom-4 flex items-center gap-2 rounded-full bg-white px-3.5 py-2.5 shadow-[0_4px_14px_-6px_rgba(15,23,42,0.18)]">
        <span className="flex-1 text-[10.5px] text-slate-400">Ask me anything...</span>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DDE3F7]">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="#8B93A7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>
      </div>

    </div>
  )
}
