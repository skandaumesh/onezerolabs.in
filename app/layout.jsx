import { GeistSans } from 'geist/font/sans';
import { EB_Garamond, Instrument_Serif, Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/globals.css'
import Navbar from '../components/Navbar'
import SmoothScroll from '../components/SmoothScroll'
import Footer from '../components/Footer'
import Script from 'next/script'
import JsonLd from '../components/JsonLd'
import { DEFAULT_DESCRIPTION, OG_IMAGE, ORG_ID, SAAME_ID, SITE_NAME, SITE_URL, WEBSITE_ID } from '../lib/seo'
import { Analytics } from '@vercel/analytics/react'

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-eb-garamond',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-instrument-serif',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata = {
  metadataBase: new URL(SITE_URL),

  // Pages set their own short title; the template adds the brand. The home
  // page uses the default.
  title: {
    default: 'OneZeroLabs | Website, Software & Branding Studio in Bengaluru',
    template: '%s | OneZeroLabs',
  },

  description: DEFAULT_DESCRIPTION,

  keywords: [
    'OneZeroLabs',
    'website development company Bengaluru',
    'web design Bengaluru',
    'custom software development Bengaluru',
    'software company Bengaluru',
    'college management software',
    'attendance management system for colleges',
    'SAAME',
    'branding agency Bengaluru',
    'social media management Bengaluru',
    'website maintenance India',
    'AI automation for business',
  ],

  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  referrer: 'origin-when-cross-origin',

  /* No canonical here. A canonical in the root layout is inherited by every
     page that doesn't set its own -- it used to point /about, /services,
     /portfolio, /contact and more at the home page, telling Google they were
     duplicates of it. Each page now sets its own (lib/seo.js pageMetadata). */

  // The 96px PNG is listed as an icon in its own right, not only as the old
  // "shortcut" link: Google picks the favicon it shows in search results from
  // these, and prefers one that is 48px or larger. Every favicon size is a
  // white disc with the logo inside it, which also survives the round crop
  // search results apply.
  //
  // `?v=2`: browsers keep favicons in their own store, keyed by URL, and a
  // normal refresh doesn't replace them -- returning visitors kept seeing the
  // old black icon. A new query string is a new URL, so they fetch the new
  // one. Bump it whenever the icon changes.
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: '48x48' },
      { url: '/favicon-96x96.png?v=2', type: 'image/png', sizes: '96x96' },
    ],
    shortcut: '/favicon-96x96.png?v=2',
    apple: '/apple-touch-icon.png?v=2',
  },

  manifest: '/site.webmanifest',

  openGraph: {
    title: 'OneZeroLabs | Website, Software & Branding Studio in Bengaluru',
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
    locale: 'en_IN',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'OneZeroLabs | Website, Software & Branding Studio in Bengaluru',
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE.url],
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

  verification: {
    google: 'KpgQoDDeGFSzTxXSZD4tVk6uSsjDyNojaIg_c_c9zqE',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  // The browser bar on phones; black was left over from the dark theme.
  themeColor: '#FFFFFF',
}

/* Who OneZeroLabs is, for search engines: one graph with the business and
   the website, sharing the @ids every other page's structured data points
   back to. Only facts the site states elsewhere; the postcode and founding
   year are left out until the site agrees on them. */
const siteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': ORG_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/web-app-manifest-512x512.png`,
        width: 512,
        height: 512,
      },
      image: `${SITE_URL}${OG_IMAGE.url}`,
      description: DEFAULT_DESCRIPTION,
      slogan: 'Designing the Future of Digital Infrastructure',
      email: 'hello@onezerolabs.in',
      telephone: '+91-7483729869',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bengaluru',
        addressRegion: 'Karnataka',
        addressCountry: 'IN',
      },
      areaServed: { '@type': 'Country', name: 'India' },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-7483729869',
        email: 'hello@onezerolabs.in',
        contactType: 'sales',
        areaServed: 'IN',
        availableLanguage: ['English', 'Kannada', 'Hindi'],
      },
      founder: [
        { '@type': 'Person', name: 'Skanda Umesh', jobTitle: 'Founder', sameAs: ['https://github.com/skandaumesh'] },
        { '@type': 'Person', name: 'Praveen Kumar', jobTitle: 'Co-Founder' },
      ],
      knowsAbout: [
        'Website design and development',
        'Custom software development',
        'College and school management software',
        'Attendance management systems',
        'AI automation',
        'Brand identity design',
        'Social media management',
        'Website maintenance and support',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'OneZeroLabs services',
        itemListElement: [
          ['Software & AI', 'Portals, dashboards and automation that replace manual work.', '/services/ai-automation'],
          ['Websites', 'Fast websites and web apps you own outright.', '/services/digital-infrastructure'],
          ['Brand & Social Media', 'Brand identity and social content, designed once and run every month.', '/services/brand-growth'],
        ].map(([name, description, path]) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name, description, url: `${SITE_URL}${path}`, provider: { '@id': ORG_ID } },
        })),
      },
      owns: { '@id': SAAME_ID },
      sameAs: ['https://www.linkedin.com/company/onezerolabs'],
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'en-IN',
      publisher: { '@id': ORG_ID },
    },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <JsonLd data={siteSchema} />
      </head>
      <body className={`antialiased bg-ozl-base text-ozl-ink ${GeistSans.className} ${ebGaramond.variable} ${instrumentSerif.variable} ${plusJakartaSans.variable}`}>
        <SmoothScroll>
          <Navbar />
          <div className="relative z-10 w-full bg-ozl-base">
            <main id="main-content" className="bg-ozl-base">{children}</main>
          </div>
          <Footer />
        </SmoothScroll>

        {/* Vercel Web Analytics */}
        <Analytics />

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