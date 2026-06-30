// app/sitemap.js
import { servicesData } from '@/data/servicesData'
import { productsData } from '@/data/productsData'
import { solutionsData } from '@/data/solutionsData'

const baseUrl = 'https://www.onezerolabs.in'

export default function sitemap() {
  const now = new Date()

  const staticPages = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/services`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/solutions`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/portfolio`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/portfolio/LMS`, changeFrequency: 'monthly', priority: 0.7 },
  ]

  const servicePages = Object.keys(servicesData).map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const productPages = Object.keys(productsData).map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const solutionPages = Object.keys(solutionsData).map((slug) => ({
    url: `${baseUrl}/solutions/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages, ...productPages, ...solutionPages].map((p) => ({
    ...p,
    lastModified: now,
  }))
}
