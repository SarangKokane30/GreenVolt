import type { MetadataRoute } from 'next'
import { getCMS } from '@/lib/cms'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const paths = ['', '/about', '/products', '/solutions', '/technology', '/capabilities', '/certifications', '/contact', '/privacy', '/terms']
  const cms = await getCMS()
  const [products, projects] = cms ? await Promise.all([
    cms.find({ collection: 'products', where: { status: { equals: 'published' } }, limit: 1000 }).then(result => result.docs).catch(() => []),
    cms.find({ collection: 'projects', where: { status: { equals: 'published' } }, limit: 1000 }).then(result => result.docs).catch(() => []),
  ]) : [[], []]
  const dynamicPaths = [
    ...products.map((product) => `/products/${product.slug}`),
    ...projects.map((project) => `/projects/${project.slug}`),
  ]
  const lastModified = new Date()
  return [...paths, ...dynamicPaths].map((path) => ({ url: `${base}${path}`, lastModified }))
}
