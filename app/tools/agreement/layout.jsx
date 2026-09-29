export const metadata = {
  title: 'Agreement Generator',
  description: 'Internal tool for generating branded OneZeroLabs agreements as Word or PDF.',
  // Internal tooling: keep it out of search results and the sitemap.
  robots: { index: false, follow: false },
}

export default function AgreementToolLayout({ children }) {
  return children
}
