import JsonLd from '@/components/JsonLd'
import { breadcrumbs, ORG_ID, pageMetadata, SAAME_ID, SITE_URL } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'SAAME Case Study: College Attendance & Academic Platform',
  description:
    'How OneZeroLabs built SAAME for MLA Academy of Higher Learning: offline attendance, semester promotion, compliance reports and an AI assistant.',
  path: '/portfolio/LMS',
  type: 'article',
})

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'SAAME case study: a college attendance and academic platform',
    url: `${SITE_URL}/portfolio/LMS`,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    about: [
      { '@id': SAAME_ID },
      { '@type': 'CollegeOrUniversity', name: 'MLA Academy of Higher Learning' },
    ],
  },
  breadcrumbs(['Portfolio', '/portfolio'], ['SAAME case study', '/portfolio/LMS']),
]

export default function LmsLayout({ children }) {
  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  )
}
