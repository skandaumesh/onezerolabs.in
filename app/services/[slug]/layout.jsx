import { servicesData } from '@/data/servicesData'

const baseUrl = 'https://www.onezerolabs.in'

export function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({ slug }))
}

export function generateMetadata({ params }) {
  const data = servicesData[params.slug]
  if (!data) return { title: 'Service Not Found | OneZeroLabs' }

  const title = `${data.title} | OneZeroLabs`
  const description = data.overview || data.hero?.subheadline || ''
  const url = `${baseUrl}/services/${params.slug}`
  const image = data.image || '/og-image.jpg'

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'OneZeroLabs',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: data.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default function ServiceSlugLayout({ children, params }) {
  const data = servicesData[params.slug]
  const schema = data && {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.title,
    description: data.overview || data.hero?.subheadline || '',
    provider: { '@id': `${baseUrl}/#organization` },
    areaServed: { '@type': 'Country', name: 'India' },
    url: `${baseUrl}/services/${params.slug}`,
    hasOfferCatalog: data.servicesList && {
      '@type': 'OfferCatalog',
      name: data.title,
      itemListElement: data.servicesList.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.description },
      })),
    },
  }

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {children}
    </>
  )
}
