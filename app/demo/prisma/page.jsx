import { PrismaHero } from "@/components/ui/prisma-hero"

// Preview route for the PrismaHero component. Kept out of the sitemap and the
// nav: it exists so the block can be looked at in isolation before deciding
// where, or whether, it belongs on the site.
export const metadata = {
  title: "PrismaHero preview",
  robots: { index: false, follow: false },
}

export default function PrismaHeroDemo() {
  return <PrismaHero />
}
