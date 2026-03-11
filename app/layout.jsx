import '../styles/globals.css'
import Navbar from '../components/Navbar'
import SmoothScroll from '../components/SmoothScroll'
import Footer from '../components/Footer'
import Script from 'next/script'
import { Suspense } from 'react'

export const metadata = {
  metadataBase: new URL('https://onezerolabs.in'),

  title: {
    default: 'OneZeroLabs | Enterprise Software for Educational Institutions',
    template: '%s | OneZeroLabs',
  },

  description:
    'OneZeroLabs builds high-performance digital infrastructure for educational institutions. We specialize in AI-powered attendance systems, automated student management, and scalable institutional platforms.',

  keywords: [
    'smart attendance system',
    'college management software',
    'educational ERP system',
    'institutional digital transformation',
    'LMS for colleges India',
    'student data analytics',
    'custom EdTech solutions',
    'educational software development Bengaluru',
    'OneZeroLabs',
    'academic workflow automation',
  ],

  applicationName: 'OneZeroLabs',
  authors: [{ name: 'OneZeroLabs', url: 'https://onezerolabs.in' }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  creator: 'OneZeroLabs',
  publisher: 'OneZeroLabs',

  alternates: {
    canonical: 'https://onezerolabs.in',
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-96x96.png',
    apple: '/apple-touch-icon.png',
  },

  manifest: '/site.webmanifest',

  openGraph: {
    title: 'OneZeroLabs | Digital Infrastructure for Education',
    description:
      'Digitizing academic workflows with AI-powered attendance, student management, and high-performance institutional applications.',
    url: 'https://onezerolabs.in',
    siteName: 'OneZeroLabs',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OneZeroLabs – Software Solutions for Educational Institutions',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'OneZeroLabs | Enterprise EdTech Solutions',
    description:
      'Engineering the future of institutional digital infrastructure with scalable web and mobile applications.',
    creator: '@OneZeroLabs',
    images: ['/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  category: 'technology',
  classification: 'Software Development',

  verification: {
    google: 'google-site-verification-placeholder', // User should replace this with actual token
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({ children }) {
  /* ===============================
     ORGANIZATION SCHEMA
     =============================== */
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://onezerolabs.in/#organization',
    name: 'OneZeroLabs',
    url: 'https://onezerolabs.in',
    logo: {
      '@type': 'ImageObject',
      url: 'https://onezerolabs.in/web-app-manifest-512x512.png',
      width: 512,
      height: 512
    },
    description:
      'OneZeroLabs develops high-performance software solutions for institutions, specializing in attendance management, student data ecosystems, and academic workflow automation.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560064',
      addressCountry: 'India'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-7483729869',
      contactType: 'Business Enquiries',
      email: 'onezerolabs82@gmail.com',
      availableLanguage: ['English', 'Kannada', 'Hindi']
    },
    sameAs: [
      'https://www.linkedin.com/company/onezerolabs',
      'https://github.com/skandaumesh'
    ]
  }

  /* ===============================
     SERVICE SCHEMA
     =============================== */
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Institutional Software & Digital Infrastructure Development',
    provider: {
      '@id': 'https://onezerolabs.in/#organization'
    },
    areaServed: {
      '@type': 'Country',
      name: 'India'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Educational Software Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI-Powered Attendance Management Systems'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Student Information Systems (SIS)'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Academic ERP Development'
          }
        }
      ]
    },
    description:
      'Designing and deploying enterprise-grade digital systems for educational institutions, focused on scalability, security, and institutional efficiency.'
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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