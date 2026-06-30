import { productsData } from '@/data/productsData'

const baseUrl = 'https://www.onezerolabs.in'

export function generateStaticParams() {
  return Object.keys(productsData).map((slug) => ({ slug }))
}

export function generateMetadata({ params }) {
  const data = productsData[params.slug]
  if (!data) return { title: 'Product Not Found | OneZeroLabs' }

  const title = `${data.title} | OneZeroLabs`
  const description = data.hero?.subheadline || data.hero?.headline || ''
  const url = `${baseUrl}/products/${params.slug}`
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

export default function ProductSlugLayout({ children, params }) {
  const data = productsData[params.slug]
  const schema = data && {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: data.title,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Android, Web',
    description: data.hero?.subheadline || data.hero?.headline || '',
    url: `${baseUrl}/products/${params.slug}`,
    publisher: { '@id': `${baseUrl}/#organization` },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    featureList: data.capabilities?.map((c) => c.title),
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
