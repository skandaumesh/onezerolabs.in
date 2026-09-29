import JsonLd from '@/components/JsonLd'
import { solutionsData } from '@/data/solutionsData'
import { breadcrumbs, ORG_ID, pageMetadata, SITE_URL } from '@/lib/seo'

export function generateStaticParams() {
  return Object.keys(solutionsData).map((slug) => ({ slug }))
}

// Who each solution is for, as a searcher would put it.
const AUDIENCE = {
  education: 'Schools & Colleges',
  startups: 'Startups',
  smes: 'Small Businesses',
  healthcare: 'Healthcare Providers',
  consultants: 'Consultants',
}

const audienceFor = (slug, data) => AUDIENCE[slug] || data.title

export function generateMetadata({ params }) {
  const data = solutionsData[params.slug]
  if (!data) return { title: 'Solution not found', robots: { index: false } }

  return pageMetadata({
    title: `Websites & Software for ${audienceFor(params.slug, data)}`,
    description: data.hero?.subheadline || data.overview || data.hero?.headline || '',
    path: `/solutions/${params.slug}`,
  })
}

export default function SolutionSlugLayout({ children, params }) {
  const data = solutionsData[params.slug]
  const schema = data && [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Websites & software for ${audienceFor(params.slug, data).toLowerCase()}`,
      description: data.hero?.subheadline || data.hero?.headline || '',
      url: `${SITE_URL}/solutions/${params.slug}`,
      provider: { '@id': ORG_ID },
      areaServed: { '@type': 'Country', name: 'India' },
      audience: { '@type': 'Audience', audienceType: data.title },
      ...(data.howWeHelp
        ? {
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: data.title,
              itemListElement: data.howWeHelp.map((s) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: s.title, description: s.description },
              })),
            },
          }
        : {}),
    },
    breadcrumbs(['Solutions', '/solutions'], [data.title, `/solutions/${params.slug}`]),
  ]

  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  )
}
