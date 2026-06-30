const baseUrl = 'https://www.onezerolabs.in'

export const metadata = {
  title: 'SAAME LMS — Institutional Attendance & Academic Platform | OneZeroLabs',
  description:
    'A deep dive into SAAME: a production LMS with offline-first attendance, 0.1s zero-latency marking, automated batch promotion, compliance reporting, and a cognitive AI assistant — built by OneZeroLabs.',
  alternates: { canonical: `${baseUrl}/portfolio/LMS` },
  openGraph: {
    title: 'SAAME LMS Case Study | OneZeroLabs',
    description:
      'Offline-first attendance, zero-latency marking, and an AI assistant — inside the SAAME institutional platform.',
    url: `${baseUrl}/portfolio/LMS`,
    siteName: 'OneZeroLabs',
    type: 'article',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'SAAME LMS Case Study' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAAME LMS Case Study | OneZeroLabs',
    description: 'Offline-first attendance, zero-latency marking, and an AI assistant.',
    images: ['/og-image.jpg'],
  },
}

export default function LmsLayout({ children }) {
  return <>{children}</>
}
