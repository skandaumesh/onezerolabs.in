// app/robots.js
export default function robots() {
  return {
    rules: [  // ← CHANGE: Use array [] instead of object {}
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/admin/'],  // Block multiple paths
      },
    ],
    sitemap: 'https://onezerolabs.in/sitemap.xml',
  }
}
