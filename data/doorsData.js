// The four doors into OneZeroLabs.
// Three are services. SAAME is a product we own — it gets its own treatment
// on the homepage rather than a fourth card, so it is exported separately.

export const doors = [
  {
    id: "01",
    label: "Software & AI",
    href: "/services/ai-automation",
    description:
      "Portals, dashboards and automation that replace manual work.",
    audience: "Built for schools, colleges, and businesses outgrowing spreadsheets.",
    cta: "See what we build",
  },
  {
    id: "02",
    label: "Websites",
    href: "/services/digital-infrastructure",
    description:
      "Fast sites and web apps you own outright.",
    audience: "From a first site to a full platform rebuild.",
    cta: "See our work",
  },
  {
    id: "03",
    label: "Brand & Social Media",
    href: "/services/brand-growth",
    description:
      "Identity and content, designed once and run every month.",
    audience: "For founders who don't have time to post and shouldn't have to.",
    cta: "See how it works",
  },
]

export const saameDoor = {
  label: "SAAME",
  href: "/products/saame",
  cta: "Explore SAAME",
}

// Hero nav pills: the three services plus SAAME, same door count, no false symmetry.
export const heroDoors = [
  ...doors.map(({ label, href }) => ({ label, href })),
  { label: saameDoor.label, href: saameDoor.href },
]
