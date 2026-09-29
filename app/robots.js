import { SITE_URL } from '@/lib/seo'

// Same host as the canonicals and sitemap entries (www); this pointed at the
// bare domain before.
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Internal tools and design experiments, not pages for search.
        disallow: ['/tools/', '/demo/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
