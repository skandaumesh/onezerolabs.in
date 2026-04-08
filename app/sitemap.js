// app/sitemap.js
const baseUrl = 'https://onezerolabs.in';

// Defines how many sitemaps to generate (id 0-3 = 4 sitemaps)
export function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
}

const sitemapData = {
  0: [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/services`, changeFrequency: 'monthly', priority: 0.9 },
  ],
  1: [
    { url: `${baseUrl}/portfolio`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
  ],
  2: [
    { url: `${baseUrl}/contact`, changeFrequency: 'yearly', priority: 0.8 },
  ],
  3: [
    // Reserved for future pages — blog, case studies, etc.
  ],
};

export default function sitemap({ id }) {
  return sitemapData[id].map((entry) => ({
    ...entry,
    lastModified: new Date(),
  }));
}
