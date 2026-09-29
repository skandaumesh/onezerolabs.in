import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Portfolio: Websites & Software We Have Built',
  description:
    'Work by OneZeroLabs: SAAME for MLA Academy of Higher Learning, websites for Praasa Consultancy and Samruddhi Pathway, an AI chatbot and more.',
  path: '/portfolio',
})

// Structured data for /portfolio is rendered by the page: see lib/schemas.js.
export default function PortfolioLayout({ children }) {
  return children
}
