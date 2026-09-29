import JsonLd from '@/components/JsonLd'
import { productsData } from '@/data/productsData'
import { breadcrumbs, ORG_ID, pageMetadata, SITE_URL } from '@/lib/seo'

export function generateStaticParams() {
  return Object.keys(productsData).map((slug) => ({ slug }))
}

// Search titles and descriptions, where the product's own copy is too short.
const SEO = {
  saame: {
    title: 'SAAME: College Attendance & Academic Management System',
    description:
      'SAAME, the college attendance and academic system by OneZeroLabs: attendance, mentoring, reports and parent alerts. Live at MLA Academy, Bengaluru.',
    long:
      'SAAME is the attendance and academic management system a college runs on: attendance, mentoring, reports and parent notifications, with apps for teachers, the office and students. Built by OneZeroLabs and live at MLA Academy of Higher Learning, Bengaluru.',
  },
}

export function generateMetadata({ params }) {
  const data = productsData[params.slug]
  if (!data) return { title: 'Product not found', robots: { index: false } }

  const seo = SEO[params.slug] || {}
  return pageMetadata({
    title: seo.title || data.title,
    description: seo.description || data.hero?.subheadline || data.hero?.headline || '',
    path: `/products/${params.slug}`,
  })
}

export default function ProductSlugLayout({ children, params }) {
  const data = productsData[params.slug]
  const url = `${SITE_URL}/products/${params.slug}`
  /* No price in the offer: an "Offer" at 0 told search engines SAAME is free,
     which it isn't. */
  const schema = data && [
    params.slug === 'saame' && {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SAAME',
      alternateName: 'SAAME college management system',
      applicationCategory: 'EducationalApplication',
      applicationSubCategory: 'Attendance and academic management',
      operatingSystem: 'Android, Web',
      description: SEO.saame.long,
      url,
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      featureList: [
        'Attendance marking, including offline',
        'Mentoring',
        'Subject and semester reports',
        'Parent notifications',
        'Teacher app, office console and student app',
        'Plain-English AI assistant over live data',
      ],
    },
    // Home > product: there is no /products index page to sit between.
    breadcrumbs([data.title, `/products/${params.slug}`]),
  ].filter(Boolean)

  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  )
}
