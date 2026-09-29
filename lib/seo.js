/* One place for the facts search engines read about OneZeroLabs, so the
   metadata, the structured data and the sitemap can't drift apart. Plain
   module (no "use client"), so server layouts can import it. */

// The live host. Every canonical URL, sitemap entry and schema @id uses it.
export const SITE_URL = 'https://www.onezerolabs.in'

export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

export const SITE_NAME = 'OneZeroLabs'

export const DEFAULT_DESCRIPTION =
  'Bengaluru studio building websites, custom software and brand identity for schools, colleges and businesses, then keeping them running. Makers of SAAME.'

// The site-wide share image (1200x630), used wherever a page has none.
export const OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'OneZeroLabs: Designing the Future of Digital Infrastructure',
}

/* Organisations we have worked with, as shown in the homepage logo strip and
   the portfolio. `url` only where we know the client's site. */
export const CLIENTS = [
  { name: 'MLA Academy of Higher Learning', sector: 'Higher education', work: 'SAAME attendance and academic system' },
  { name: 'Vaayu Chest & Sleep Specialists', sector: 'Healthcare' },
  { name: 'Vetaas Education Foundation', sector: 'Education' },
  { name: 'Praasa Consultancy', sector: 'Consulting', url: 'https://praasaconsultancy.com/', work: 'Corporate website' },
  { name: 'Elevare Connect', sector: 'Business' },
  { name: 'Élan Vital', sector: 'Business' },
  { name: 'Samruddhi Pathway', sector: 'Consulting', url: 'https://samruddhipathwayltd.com/', work: 'Business consulting website' },
]

export const CLIENT_NAMES = CLIENTS.map((c) => c.name)

// "A, B, C and D" -- for sentences that name clients.
export const listNames = (names) =>
  names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`

/* Search results cut descriptions at about 155-160 characters. Longer copy
   (mostly from the data files) is ended at the last full sentence that fits,
   or at a word with an ellipsis. */
export function clipDescription(text, max = 158) {
  const t = (text || '').replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const head = t.slice(0, max)
  const stop = Math.max(head.lastIndexOf('. '), head.lastIndexOf('.'))
  if (stop > max * 0.55) return head.slice(0, stop + 1)
  return head.slice(0, head.lastIndexOf(' ')).replace(/[,;:]$/, '') + '…'
}

/* Page metadata with the canonical URL and share cards filled in the same
   way everywhere. `title` is the page's own part; " | OneZeroLabs" is added
   here as an absolute title, because Next.js stops applying the root layout's
   title template below any layout that sets a plain title. */
export function pageMetadata({ title, description: rawDescription, path, image, type = 'website', robots }) {
  const url = `${SITE_URL}${path}`
  const images = [image || OG_IMAGE]
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME}`
  const description = clipDescription(rawDescription)
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: { title: fullTitle, description, url, siteName: SITE_NAME, type, locale: 'en_IN', images },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: images.map((i) => i.url) },
    ...(robots ? { robots } : {}),
  }
}

// BreadcrumbList for a page: pass [name, path] pairs after Home.
export function breadcrumbs(...trail) {
  const items = [['Home', '/'], ...trail]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${SITE_URL}${path === '/' ? '' : path}`,
    })),
  }
}
