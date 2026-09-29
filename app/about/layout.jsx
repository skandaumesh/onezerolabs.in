import JsonLd from '@/components/JsonLd'
import { breadcrumbs, CLIENT_NAMES, listNames, ORG_ID, pageMetadata, SITE_URL } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'About Us: Web & Software Studio in Bengaluru',
  description:
    'A Bengaluru studio building websites, software and brands. Clients include MLA Academy of Higher Learning, Praasa Consultancy and Vaayu Chest & Sleep.',
  path: '/about',
})

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${SITE_URL}/about`,
    name: 'About OneZeroLabs',
    about: { '@id': ORG_ID },
    description: `OneZeroLabs designs, builds and runs websites, software and brand systems. Clients include ${listNames(CLIENT_NAMES)}.`,
  },
  breadcrumbs(['About', '/about']),
]

export default function AboutLayout({ children }) {
  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  )
}
