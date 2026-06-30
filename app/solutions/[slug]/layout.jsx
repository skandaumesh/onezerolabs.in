import { solutionsData } from '@/data/solutionsData'

const baseUrl = 'https://www.onezerolabs.in'

export function generateStaticParams() {
  return Object.keys(solutionsData).map((slug) => ({ slug }))
}

export function generateMetadata({ params }) {
  const data = solutionsData[params.slug]
  if (!data) return { title: 'Solution Not Found | OneZeroLabs' }

  const title = `${data.title} Solutions | OneZeroLabs`
  const description = data.hero?.subheadline || data.overview || data.hero?.headline || ''
  const url = `${baseUrl}/solutions/${params.slug}`
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

export default function SolutionSlugLayout({ children }) {
  return <>{children}</>
}
