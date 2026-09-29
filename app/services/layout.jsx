import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Services: Websites, Custom Software, AI & Branding',
  description:
    'Websites, custom software, AI automation, analytics, and brand and social media, from one Bengaluru team that maintains it all after launch.',
  path: '/services',
})

// Structured data for /services is rendered by the page: see lib/schemas.js.
export default function ServicesLayout({ children }) {
  return children
}
