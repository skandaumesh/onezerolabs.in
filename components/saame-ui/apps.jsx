import { TeacherHome, TeacherSubjects, TeacherAI } from "./TeacherScreens"
import { StudentDaily, StudentOverall, StudentInsights } from "./StudentScreens"
import { AdminDashboard } from "./AdminScreen"

/**
 * The SAAME screens, their questions and what each one actually does.
 *
 * Shared, because the homepage and /products/saame both draw on it and they
 * must not drift: the homepage shows one screen as a taster, the product page
 * walks through all seven. Keeping two copies is how the site ended up
 * claiming a "Parent App" in one place after the product had been renamed in
 * another.
 *
 * Every point below is checkable against the product repository. The figures
 * this section used to carry (1,500+ parents, 92.4%, 10,000+ records, 0.1s)
 * appear nowhere in it and were dropped rather than restated.
 */

export const APPS = [
  {
    id: "teacher",
    label: "Teacher app",
    device: "mobile",
    blurb: "An installable app the teaching staff use in class.",
    screens: [
      {
        id: "classes",
        name: "My classes",
        desc: "Every class a lecturer owns, with marking one tap away.",
        ask: "How long does marking a class take?",
        reply: "One tap. With no signal it queues on the device and syncs later.",
        points: [
          "The list belongs to the lecturer, not to an administrator",
          "Marking works with no connection, and the queue drains when signal returns",
          "A subject can be marked more than once a day, which timetables need",
        ],
      },
      {
        id: "subjects",
        name: "Subjects",
        desc: "Subjects held per programme and semester, maintained by the lecturer.",
        ask: "Who decides what a lecturer teaches?",
        reply: "They do. Subjects are held per programme and semester, not set centrally.",
        points: [
          "Added and removed by the lecturer, with no request to the office",
          "A subject carries its stream, so BCom Kannada is distinct from BCA's",
          "Cached locally, so the list opens instantly on the next visit",
        ],
      },
      {
        id: "ai",
        name: "AI assistant",
        desc: "A question in plain English becomes a database query, and comes back answered.",
        ask: "Who is Aarav Menon?",
        reply: "Typed in English, turned into a database query, answered from live data.",
        points: [
          "Four layers of intent classification run before the database is touched",
          "Deterministic, so the same question always yields the same query",
          "Drops to a smaller model when rate limited rather than failing",
        ],
      },
    ],
  },
  {
    id: "office",
    label: "Office console",
    device: "desktop",
    blurb: "The administrative side: students, staff, reports and records.",
    screens: [
      {
        id: "dashboard",
        name: "Dashboard",
        desc: "Attendance across the institution, by trend, by day and by class.",
        ask: "Where is attendance slipping?",
        reply: "Ranked by class, every day, without anyone building a report.",
        points: [
          "Trend by week, month or year, over every programme at once",
          "Classes ranked best and worst as registers come in",
          "Low attendance surfaces here rather than waiting for a report run",
        ],
      },
    ],
  },
  {
    /* The student's own app. It was built as a parents app and renamed: the
       product's own history records it ("Call it MLAAHL, not the parents app"),
       sign-in takes the student's UUCMS ID, and the student uploads their photo
       and shares their attendance themselves. Parents are still reached, but by
       notification from the office rather than an app. */
    id: "student",
    label: "Student app",
    device: "mobile",
    blurb: "An Android app students install to follow their own attendance.",
    screens: [
      {
        id: "daily",
        name: "Daily status",
        desc: "What happened today, class by class, as soon as it is marked.",
        ask: "Was I marked present today?",
        reply: "Every class, the moment the lecturer submits the register.",
        points: [
          "Each class for the day carries its own present or absent mark",
          "Signed in with the student's own UUCMS ID",
          "Appears as the register is submitted, not overnight",
        ],
      },
      {
        id: "overall",
        name: "Overall",
        desc: "The running total, and where it comes from subject by subject.",
        ask: "Which subject is pulling me down?",
        reply: "The running total for the semester, broken out subject by subject.",
        points: [
          "Present and absent counts shown per subject, not just a percentage",
          "The semester total sits next to the subjects that produced it",
          "Shareable as a link, or straight over WhatsApp",
        ],
      },
      {
        id: "insights",
        name: "Insights",
        desc: "Which subjects sit under the 75% requirement, before it becomes a problem.",
        ask: "Am I going to fall short for the exam?",
        reply: "Anything under 75% is flagged early, not in the week before.",
        points: [
          "Every subject measured against the 75% attendance requirement",
          "At-risk subjects counted separately from passing ones",
          "Condonation rules are answered by the assistant, not buried in a notice",
        ],
      },
    ],
  },
]

export const RENDERERS = {
  classes: TeacherHome,
  subjects: TeacherSubjects,
  ai: TeacherAI,
  dashboard: AdminDashboard,
  daily: StudentDaily,
  overall: StudentOverall,
  insights: StudentInsights,
}

export const findScreen = (appId, screenId) => {
  const app = APPS.find((a) => a.id === appId)
  return app && app.screens.find((s) => s.id === screenId)
}

/* The six modules, as one list. This lived on the homepage until that block was
   cut down to a single screen; it belongs on the product page, where there is
   room to say what each one does. */
export const MODULES = [
  {
    name: "Attendance",
    desc: "Multiple programmes, multiple sessions a day, marked from the classroom.",
    icon: "M4 5h16v16H4zM4 10h16M9 3v4M15 3v4M9 15l2 2 4-4",
  },
  {
    name: "Mentoring",
    desc: "Mentor to mentee mapping, a session register, and one session per mentor per day enforced in the database.",
    icon: "M4 20v-1a5 5 0 0 1 10 0v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 20v-1a4 4 0 0 0-3-3.8",
  },
  {
    name: "Announcements",
    desc: "Posted once by the office or a teacher, delivered to the people it concerns.",
    icon: "M4 10v4h3l5 4V6L7 10zM16 9a4 4 0 0 1 0 6",
  },
  {
    name: "Reports",
    desc: "Subject and semester matrices, exported to Excel or to a print-ready layout.",
    icon: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h4",
  },
  {
    name: "AI assistant",
    desc: "Plain-English questions resolved against the live database, not a canned FAQ.",
    icon: "M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7zM5 17l.8 2 2 .8-2 .8L5 22l-.8-2-2-.8 2-.8z",
  },
  {
    name: "Records",
    desc: "Enrolment, promotion between semesters, and student photographs.",
    icon: "M4 6h16v14H4zM4 6l2-3h12l2 3M9 12h6",
  },
]

/* The technology behind SAAME (frameworks, database, hosting, models) is
   deliberately not listed on the site. */
