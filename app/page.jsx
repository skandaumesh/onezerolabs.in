import HomePage from '@/components/HomePage'
import JsonLd from '@/components/JsonLd'
import { FAQS } from '@/data/faqData'
import { CLIENTS, DEFAULT_DESCRIPTION, ORG_ID, SITE_URL, WEBSITE_ID } from '@/lib/seo'

/* The page itself is a client component (components/HomePage.jsx); this
   server wrapper exists so the home page can declare its own canonical URL
   and structured data, which client components can't. */

export const metadata = {
  alternates: { canonical: SITE_URL },
}

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'OneZeroLabs | Website, Software & Branding Studio in Bengaluru',
      description: DEFAULT_DESCRIPTION,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORG_ID },
      inLanguage: 'en-IN',
      // The organisations in the page's logo strip.
      mentions: CLIENTS.map((c) => ({
        '@type': 'Organization',
        name: c.name,
        ...(c.url ? { url: c.url } : {}),
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      isPartOf: { '@id': `${SITE_URL}/#webpage` },
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

export default function Page() {
  return (
    <>
      <JsonLd data={homeSchema} />
      <HomePage />
    </>
  )
}
