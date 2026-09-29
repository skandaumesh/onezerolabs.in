/**
 * Demo data for the SAAME screens rendered on the marketing site.
 *
 * Every name, ID and number in this file is invented. That is the whole point
 * of the file existing: the section used to be built from screenshots of the
 * live MLA Academy deployment, and four of those screenshots carried a real
 * student's name, one carried a student ID and a parent's phone number, and the
 * admin shot carried the institution's real operating figures. Rendering the
 * screens in code instead means the site can show the product honestly without
 * publishing anyone's data.
 *
 * Rules for anything added here:
 *  - invented people only, never a name from the database;
 *  - phone numbers stay masked, so no real-looking number is ever printed;
 *  - institutional totals stay invented, and are never presented as MLA's.
 *
 * The programmes (BCA, BCom, BBA, MCA, MBA) and the 75% attendance threshold
 * are real product behaviour, not data, so they are reproduced accurately.
 */

export const teacherName = "Priya Nair"

export const teacherClasses = [
  { code: "#1", subject: "FINTECH MANAGEMENT", stream: "MBA", sem: "SEM 2" },
  { code: "#2", subject: "BUSINESS ANALYTICS", stream: "MBA", sem: "SEM 2" },
  { code: "#3", subject: "MARKETING ANALYTICS", stream: "BDA", sem: "SEM 6" },
]

export const teacherSubjects = [
  { name: "KANNADA", stream: "BCOM", sem: "SEM 2" },
  { name: "CONSTITUTIONAL VAL...", stream: "BCOM", sem: "SEM 2" },
  { name: "APPLICATION OF PYTH...", stream: "BDA", sem: "SEM 6" },
  { name: "MARKETING ANALYTICS", stream: "BDA", sem: "SEM 6" },
  { name: "FINTECH MANAGEMENT", stream: "MBA", sem: "SEM 2" },
  { name: "BUSINESS ANALYTICS", stream: "MBA", sem: "SEM 2" },
]

/* The assistant answers from the database, so the demo shows a lookup.
   The phone is masked on purpose: the screenshot this replaces printed a real
   parent's number in full. */
export const aiQuery = "Who is aarav menon"

export const aiAnswer = {
  name: "AARAV MENON",
  rows: [
    ["ID", "U18DM24C0117"],
    ["Stream", "BDA"],
    ["Semester", "6"],
    ["Academic Year", "2026"],
  ],
  parentPhone: "+91 ••••• ••210",
  mentor: "Dr Anita Rao",
  followUps: [
    "What is Aarav Menon's attendance?",
    "Who is Aarav Menon's mentor?",
  ],
}

/* The third app is the student's own. They sign in with their UUCMS ID,
   see their own record, and can share it. Parents are still reached by the
   product, but through notifications sent from the office, not an app of
   their own. */
export const studentName = "AARAV MENON"
export const studentInitials = "AM"

export const studentToday = {
  greeting: "Good afternoon",
  date: "Tue, 15 Sep, 2026",
  present: 2,
  absent: 1,
  schedule: [
    { initials: "AF", subject: "ADVANCED FINANCIAL ACCOUNTING", time: "9:30 AM - 10:30 AM", status: "Present" },
    { initials: "BR", subject: "BUSINESS REGULATIONS", time: "11:00 AM - 12:00 PM", status: "Present" },
    { initials: "CV", subject: "CONSTITUTIONAL VALUES-II", time: "4:30 PM - 5:30 PM", status: "Absent" },
  ],
}

export const studentOverall = {
  attendance: 82,
  present: 194,
  absent: 42,
  subjects: [
    { initials: "AF", name: "ADVANCED FINANCIAL ACCOUNTING", present: 31, absent: 9, pct: 78 },
    { initials: "BR", name: "BUSINESS REGULATIONS", present: 34, absent: 12, pct: 74 },
    { initials: "CV", name: "CONSTITUTIONAL VALUES-II", present: 38, absent: 5, pct: 88 },
  ],
}

/* 75% is the real threshold the product enforces, so the demo respects it:
   two of the seven bars below sit under the line and are flagged. */
export const studentInsights = {
  enrolled: 7,
  passing: 5,
  atRisk: 2,
  threshold: 75,
  bars: [74, 78, 81, 83, 70, 86, 88],
}

export const adminStats = [
  { label: "Total Students", value: "482" },
  { label: "Monthly Attendance", value: "81%" },
  { label: "Active Streams", value: "5" },
  { label: "Student App Usage", value: "63%" },
]

export const adminTrend = [62, 74, 58, 80, 71, 66, 84, 77, 69, 88, 73, 79, 64, 82]

export const adminClasses = [
  { rank: 1, name: "MCOM - Sem 1", sessions: "84 sessions", pct: 94 },
  { rank: 2, name: "MBA - Sem 1", sessions: "126 sessions", pct: 91 },
  { rank: 3, name: "BCA AI & ML - Sem 1", sessions: "210 sessions", pct: 87 },
  { rank: 4, name: "BCA - Sem 3", sessions: "178 sessions", pct: 85 },
  { rank: 5, name: "BCA - Sem 2", sessions: "241 sessions", pct: 83 },
]

export const adminNav = [
  "Dashboard",
  "Students",
  "Reports",
  "View Attendance",
  "Promote",
  "AI Assistant",
  "Teachers",
  "Parent Status",
  "Announcements",
  "Mentors",
]

/* Data for the office console's student view, laid out like the reference.
   Invented people, as everything in this file is. The programme names, the
   75% requirement and the condonation status are real product behaviour. */
export const officeStudents = [
  { initials: "AM", name: "Aarav Menon", subject: "Advanced Financial Accounting", pct: 82, last: "Sept 15, 2026", status: "On track", tone: "green" },
  { initials: "DS", name: "Diya Shenoy", subject: "Business Regulations", pct: 74, last: "Sept 15, 2026", status: "Below 75%", tone: "amber" },
  { initials: "RP", name: "Rohan Pai", subject: "Constitutional Values II", pct: 68, last: "Sept 14, 2026", status: "Condonation", tone: "red" },
]

export const officeMeta = [
  { label: "Programme", value: "BCA", icon: "M12 4 2 9l10 5 10-5zM5 12v4c0 1.5 3.5 3 7 3s7-1.5 7-3v-4" },
  { label: "Semester", value: "5", icon: "M4 5h16v16H4zM4 10h16M9 3v4M15 3v4" },
  { label: "Sessions held", value: "244", icon: "M12 7v5l3 2M3 12a9 9 0 1 0 3-6.7L3 8" },
  { label: "Requirement", value: "75%", icon: "M5 12l5 5L19 7" },
]

/* Grouped the way the real console's navigation is grouped. */
export const officeNav = [
  { section: null, items: [
    { name: "Home", icon: "M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
    { name: "Announcements", icon: "M4 10v4h3l5 4V6L7 10zM16 9a4 4 0 0 1 0 6", badge: "3" },
  ]},
  { section: "Attendance", items: [
    { name: "View attendance", icon: "M4 5h16v16H4zM4 10h16M9 3v4M15 3v4" },
    { name: "Reports", icon: "M6 3h9l4 4v14H6zM14 3v5h5" },
    { name: "Promote", icon: "M4 18l6-6 4 4 6-8" },
  ]},
  { section: "People", items: [
    { name: "Students", icon: "M4 20v-1a5 5 0 0 1 10 0v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", active: true },
    { name: "Teachers", icon: "M3 7l9-4 9 4-9 4zM7 11v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5" },
    { name: "Mentors", icon: "M4 20v-1a5 5 0 0 1 10 0v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 20v-1a4 4 0 0 0-3-3.8" },
  ]},
]
