'use client'

import CtaSection from '@/components/CtaSection'

/* The close for the service, solution and product pages: the homepage's CTA
   card, with the page's own first-button label from its data (ctaText).

   The labels in the data end in "→", which the homepage buttons don't use,
   so it's dropped here rather than edited out of every entry. */
export default function ServiceCta({ text }) {
  const label = (text || '').replace(/\s*→\s*$/, '') || 'Start a project'
  return <CtaSection title={"Let’s build something great."} primaryLabel={label} />
}
