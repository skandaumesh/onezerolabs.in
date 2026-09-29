/**
 * Homepage FAQ content, shared by the FAQ section (components/Faq.jsx) and
 * the FAQPage structured data on the home page (app/page.jsx).
 *
 * Written as a prospective client would ask, in the order they tend to ask:
 * what you do, what it costs and how long, then how working together goes.
 * Cost and timing answers name no figures -- both depend on the project.
 */

export const FAQS = [
  {
    q: "What does OneZeroLabs do?",
    a: "We build websites, custom software and brand identity for schools and colleges, startups, growing businesses, healthcare providers and consultants. Then we keep it all running after launch.",
  },
  {
    q: "How much does a project cost?",
    a: "It depends on what's being built: a website, a custom system and a monthly social media plan are priced very differently. Tell us what you need and we'll send a clear quote for that scope before any work starts.",
    link: { href: "/contact?intent=review", label: "Get a free review" },
  },
  {
    q: "How long does it take?",
    a: "That depends on scope too. A straightforward website takes weeks; a custom system takes longer. We agree the timeline and milestones with you before starting, so you know what arrives when.",
  },
  {
    q: "Can you work on a website or system we already have?",
    a: "Yes. We can fix, improve or take over what you already have, or rebuild it if that's the better option. A free review will tell you which.",
  },
  {
    q: "Who owns the website or software once it's built?",
    a: "You do. The code, the data, the domain and the accounts are yours, with no platform lock-in and no forced subscription. If we ever stop working together, everything goes with you.",
  },
  {
    q: "Do you maintain it after launch?",
    a: "Yes, and that's the part most studios skip. We handle maintenance, security and software updates, fixes and new features after launch, with response times agreed in writing.",
  },
  {
    q: "Will we work with an account manager?",
    a: "No. You work directly with the engineer building your project, in a shared channel, so nothing gets lost in a handoff and you never have to explain things twice.",
  },
  {
    q: "Can you also do our branding and social media?",
    a: "Yes. Logo and brand identity, social media planning and content, and graphic design come from the same team that builds your website, so everything looks and sounds like one company.",
  },
  {
    q: "Do you only work with businesses in Bengaluru?",
    a: "No. We're based in Bengaluru and work with clients across India. Most of the work happens over calls and a shared channel, so distance isn't a problem.",
  },
  {
    q: "What is SAAME?",
    a: "Our own software for colleges: attendance, mentoring, reports and parent notifications in one place, with an app each for teachers, the office and students. It runs every working day at MLA Academy of Higher Learning, Bengaluru.",
    link: { href: "/products/saame", label: "See SAAME" },
  },
  {
    q: "How do we get started?",
    a: "Book a call or send us a message about what you need. We'll come back with where we'd start and what it would involve.",
    link: { href: "/contact", label: "Get in touch" },
  },
]
