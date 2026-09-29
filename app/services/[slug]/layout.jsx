import JsonLd from '@/components/JsonLd'
import { servicesData } from '@/data/servicesData'
import { breadcrumbs, ORG_ID, pageMetadata, SITE_URL } from '@/lib/seo'

export function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({ slug }))
}

export function generateMetadata({ params }) {
  const data = servicesData[params.slug]
  if (!data) return { title: 'Service not found', robots: { index: false } }

  return pageMetadata({
    title: `${data.title} Services in Bengaluru`,
    description: data.overview || data.hero?.subheadline || '',
    path: `/services/${params.slug}`,
  })
}

export default function ServiceSlugLayout({ children, params }) {
  const data = servicesData[params.slug]
  const url = `${SITE_URL}/services/${params.slug}`
  const schema = data && [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: data.title,
      serviceType: data.title,
      description: data.overview || data.hero?.subheadline || '',
      url,
      provider: { '@id': ORG_ID },
      areaServed: { '@type': 'Country', name: 'India' },
      hasOfferCatalog: data.servicesList && {
        '@type': 'OfferCatalog',
        name: data.title,
        itemListElement: data.servicesList.map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: s.title, description: s.description },
        })),
      },
    },
    breadcrumbs(['Services', '/services'], [data.title, `/services/${params.slug}`]),
  ]

  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  )
}
