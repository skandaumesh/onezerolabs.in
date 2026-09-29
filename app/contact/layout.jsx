import JsonLd from '@/components/JsonLd'
import { breadcrumbs, ORG_ID, pageMetadata, SITE_URL } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Contact Us: Book a Call',
  description:
    'Talk to OneZeroLabs about a website, custom software or a brand project. Book a call or send a message and we will get back to you within 24 hours.',
  path: '/contact',
})

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${SITE_URL}/contact`,
    name: 'Contact OneZeroLabs',
    about: { '@id': ORG_ID },
  },
  breadcrumbs(['Contact', '/contact']),
]

export default function ContactLayout({ children }) {
  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  )
}
