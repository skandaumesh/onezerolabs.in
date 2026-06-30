const baseUrl = 'https://www.onezerolabs.in'

export const metadata = {
  title: 'Solutions by Industry | OneZeroLabs',
  description:
    'Tailored digital infrastructure for educational institutions, startups, SMEs, healthcare, and consultants. Find the OneZeroLabs solution built for your organization.',
  alternates: { canonical: `${baseUrl}/solutions` },
  openGraph: {
    title: 'Solutions by Industry | OneZeroLabs',
    description:
      'Tailored digital infrastructure for institutions, startups, SMEs, healthcare, and consultants.',
    url: `${baseUrl}/solutions`,
    siteName: 'OneZeroLabs',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'OneZeroLabs Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solutions by Industry | OneZeroLabs',
    description: 'Tailored digital infrastructure for every kind of organization.',
    images: ['/og-image.jpg'],
  },
}

export default function SolutionsLayout({ children }) {
  return <>{children}</>
}
