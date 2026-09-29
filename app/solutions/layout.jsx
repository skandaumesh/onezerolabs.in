import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Solutions for Schools, Startups, SMEs & Healthcare',
  description:
    'Websites, software and digital systems for schools and colleges, startups, small businesses, healthcare providers and consultants.',
  path: '/solutions',
})

// Structured data for /solutions is rendered by the page: see lib/schemas.js.
export default function SolutionsLayout({ children }) {
  return children
}
