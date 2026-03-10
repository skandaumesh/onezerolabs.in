// app/sitemap.js
export default function sitemap() {
  const baseUrl = 'https://onezerolabs.in'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',  // Changed from monthly → weekly (homepage changes more)
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,  // Increased from 0.8 (important for conversions)
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',  // Changed (portfolio updates often)
      priority: 0.9,  // Increased (shows your work)
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',  // Changed from yearly
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },

  ]
}
