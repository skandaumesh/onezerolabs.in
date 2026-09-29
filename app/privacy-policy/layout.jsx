import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description: 'How OneZeroLabs collects, uses and protects the information you share with us.',
  path: '/privacy-policy',
})

export default function PrivacyLayout({ children }) {
  return children
}
