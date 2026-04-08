// app/robots.js
export default function robots() {
  const baseUrl = 'https://onezerolabs.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/admin/'],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap/0.xml`,
      `${baseUrl}/sitemap/1.xml`,
      `${baseUrl}/sitemap/2.xml`,
      `${baseUrl}/sitemap/3.xml`,
    ],
  }
}
