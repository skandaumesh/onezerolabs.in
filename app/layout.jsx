import { GeistSans } from 'geist/font/sans';
import { Instrument_Serif } from 'next/font/google';
import '../styles/globals.css'
import Navbar from '../components/Navbar'
import SmoothScroll from '../components/SmoothScroll'
import Footer from '../components/Footer'
import Script from 'next/script'
import { Suspense } from 'react'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-instrument-serif',
});

export const metadata = {
  metadataBase: new URL('https://www.onezerolabs.in'),

  title: 'OneZeroLabs | Business Infrastructure Studio — Bengaluru',

  description:
    'OneZeroLabs is a business infrastructure studio from Bengaluru — building brand systems, web platforms, AI integrations, and operational infrastructure for founders, SMEs, and institutions.',

  keywords: [
    'business infrastructure studio',
    'software studio Bengaluru',
    'web development India',
    'institutional software',
    'Next.js development',
    'AI automation India',
    'branding agency Bengaluru',
    'custom SaaS',
    'educational ERP',
    'full-stack development India',
    'OneZeroLabs',
  ],

  applicationName: 'OneZeroLabs',
  authors: [{ name: 'OneZeroLabs', url: 'https://www.onezerolabs.in' }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  creator: 'OneZeroLabs',
  publisher: 'OneZeroLabs',

  alternates: {
    canonical: 'https://www.onezerolabs.in',
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-96x96.png',
    apple: '/apple-touch-icon.png',
  },

  manifest: '/site.webmanifest',

  openGraph: {
    title: 'OneZeroLabs | Business Infrastructure Studio',
    description:
      'Brand, technology, marketing, and operations — built as one integrated system. OneZeroLabs is the growth partner for founders and institutions who are done managing fragmented vendors.',
    url: 'https://www.onezerolabs.in',
    siteName: 'OneZeroLabs',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OneZeroLabs | Business Infrastructure Studio',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'OneZeroLabs | Business Infrastructure Studio — Bengaluru',
    description:
      'Brand, technology, marketing, and operations — built as one integrated system.',
    creator: '@OneZeroLabs',
    images: ['/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
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
    google: 'KpgQoDDeGFSzTxXSZD4tVk6uSsjDyNojaIg_c_c9zqE', 
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({ children }) {
  /* ===============================
     WEBSITE SCHEMA (For Sitelinks)
     =============================== */
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OneZeroLabs',
    url: 'https://onezerolabs.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://onezerolabs.in/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  /* ===============================
     ORGANIZATION SCHEMA
     =============================== */
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': 'https://www.onezerolabs.in/#organization',
    name: 'OneZeroLabs',
    url: 'https://www.onezerolabs.in',
    email: 'hello@onezerolabs.in',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.onezerolabs.in/web-app-manifest-512x512.png',
      width: 512,
      height: 512
    },
    description:
      'Business infrastructure studio from Bengaluru building brand systems, web platforms, AI integrations, and operational infrastructure for founders, SMEs, and institutions.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560064',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-7483729869',
      contactType: 'Business Enquiries',
      email: 'hello@onezerolabs.in',
      availableLanguage: ['English', 'Kannada', 'Hindi']
    },
    foundingDate: '2023',
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
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "ItemList",
                  "itemListElement": [
                    {
                      "@type": "SiteNavigationElement",
                      "position": 1,
                      "name": "About Us",
                      "description": "Learn about OneZeroLabs and our mission to build high-performance digital infrastructure.",
                      "url": "https://www.onezerolabs.in/about"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "position": 2,
                      "name": "Our Services",
                      "description": "Explore our AI-powered attendance systems, SIS, and custom educational software.",
                      "url": "https://www.onezerolabs.in/services"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "position": 3,
                      "name": "Portfolio",
                      "description": "View our portfolio of successful digital transformations for educational institutions.",
                      "url": "https://www.onezerolabs.in/portfolio"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "position": 4,
                      "name": "Contact Us",
                      "description": "Get in touch with OneZeroLabs for business enquiries and software solutions.",
                      "url": "https://www.onezerolabs.in/contact"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "position": 5,
                      "name": "Privacy Protocol",
                      "description": "Read our privacy policy and data security commitments.",
                      "url": "https://www.onezerolabs.in/privacy-policy"
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className={`antialiased bg-black text-white ${GeistSans.className} ${instrumentSerif.variable}`}>
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