import '../styles/globals.css'
import Navbar from '../components/Navbar'
import SmoothScroll from '../components/SmoothScroll'
import Footer from '../components/Footer'
import Script from 'next/script'
import { Suspense } from 'react'

export const metadata = {
  metadataBase: new URL('https://onezerolabs.in'),

  title: {
    default: 'OneZeroLabs | Software Solutions for Educational Institutions',
    template: '%s | OneZeroLabs',
  },

  description:
    'OneZeroLabs builds and deploys web and mobile software solutions for educational institutions, including attendance systems, student data management, and institutional digital platforms.',

  keywords: [
    'edtech software development',
    'college attendance system',
    'student management software',
    'educational institution software',
    'web application development',
    'mobile app development',
    'custom software solutions',
    'OneZeroLabs',
  ],

  authors: [{ name: 'OneZeroLabs', url: 'https://onezerolabs.in' }],
  creator: 'OneZeroLabs',
  publisher: 'OneZeroLabs',

  alternates: {
    canonical: 'https://onezerolabs.in',
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  openGraph: {
    title: 'OneZeroLabs | Institutional Software Solutions',
    description:
      'Building digital systems for educational institutions including attendance, student management, and institutional web and mobile applications.',
    url: 'https://onezerolabs.in',
    siteName: 'OneZeroLabs',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: 'https://onezerolabs.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OneZeroLabs – Educational Software Solutions',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'OneZeroLabs | Educational Software Solutions',
    description:
      'Web and mobile software solutions for colleges and educational institutions.',
    images: ['https://onezerolabs.in/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({ children }) {
  /* ===============================
     ORGANIZATION SCHEMA (SAFE)
     =============================== */
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://onezerolabs.in/#organization',
    name: 'OneZeroLabs',
    url: 'https://onezerolabs.in',
    logo: 'https://onezerolabs.in/web-app-manifest-512x512.png',
    description:
      'OneZeroLabs develops and deploys software solutions for educational institutions, focusing on attendance systems, student data management, and institutional digital platforms.',
    foundingDate: '2024',
    foundingLocation: 'Bangalore, Karnataka, India',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Business Enquiries',
      telephone: '+91-7483729869',
      email: 'onezerolabs82@gmail.com',
    },
    sameAs: [
      'https://www.linkedin.com/company/onezerolabs',
    ],
  }

  /* ===============================
     SERVICE SCHEMA (HONEST)
     =============================== */
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Educational Institution Software Development',
    provider: {
      '@type': 'Organization',
      name: 'OneZeroLabs',
      url: 'https://onezerolabs.in',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    serviceType: [
      'Attendance Management Systems',
      'Student Data Management',
      'Institutional Web Applications',
      'Institutional Mobile Applications',
      'Custom Software Development',
    ],
    description:
      'Design and development of web and mobile software solutions for educational institutions, tailored to institutional workflows and operational needs.',
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="format-detection" content="telephone=no" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      </head>

      <body className="antialiased bg-black text-white">
        <SmoothScroll>
          <Navbar />
          <div className="relative z-10 w-full bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <main id="main-content" className="bg-black">{children}</main>
          </div>
          <Footer />
        </SmoothScroll>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0ZBFRVQH9Z"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0ZBFRVQH9Z', { anonymize_ip: true });
            `,
          }}
        />
      </body>

    </html>
  )
}