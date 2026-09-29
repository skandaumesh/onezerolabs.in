import { servicesData } from '@/data/servicesData'
import { solutionsData } from '@/data/solutionsData'
import { breadcrumbs, ORG_ID, SITE_URL } from '@/lib/seo'

/* Structured data for the section index pages. Rendered by the pages, not the
   section layouts: those layouts also wrap every sub-page, which then carried
   a second breadcrumb trail. */

const collection = (path, name, entries) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  url: `${SITE_URL}${path}`,
  name,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: entries.map((e, i) => ({ '@type': 'ListItem', position: i + 1, ...e })),
  },
})

export const servicesIndexSchema = [
  collection(
    '/services',
    'OneZeroLabs services',
    Object.entries(servicesData).map(([slug, s]) => ({ name: s.title, url: `${SITE_URL}/services/${slug}` }))
  ),
  breadcrumbs(['Services', '/services']),
]

export const solutionsIndexSchema = [
  collection(
    '/solutions',
    'Solutions by industry',
    Object.entries(solutionsData).map(([slug, s]) => ({ name: s.title, url: `${SITE_URL}/solutions/${slug}` }))
  ),
  breadcrumbs(['Solutions', '/solutions']),
]

// The projects on the portfolio page, with the client where it is public.
const PROJECTS = [
  { name: 'SAAME academic management platform', about: 'MLA Academy of Higher Learning', url: `${SITE_URL}/portfolio/LMS` },
  { name: 'Praasa Consultancy website', about: 'Praasa Consultancy', url: 'https://praasaconsultancy.com/' },
  { name: 'Marks management system' },
  { name: 'Samruddhi Pathway website', about: 'Samruddhi Pathway', url: 'https://samruddhipathwayltd.com/' },
  { name: 'AI student information chatbot' },
]

export const portfolioSchema = [
  collection(
    '/portfolio',
    'OneZeroLabs portfolio',
    PROJECTS.map((p) => ({
      item: {
        '@type': 'CreativeWork',
        name: p.name,
        creator: { '@id': ORG_ID },
        ...(p.url ? { url: p.url } : {}),
        ...(p.about ? { about: { '@type': 'Organization', name: p.about } } : {}),
      },
    }))
  ),
  breadcrumbs(['Portfolio', '/portfolio']),
]
