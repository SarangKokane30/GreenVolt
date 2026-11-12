import type { MetadataRoute } from 'next'
import { getCMS } from '@/lib/cms'

// Sitemap entries depend on published Payload content and must update without a rebuild.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!configuredUrl) return []
  let base: string
  try {
    const parsed = new URL(configuredUrl)
    if (parsed.protocol !== 'https:' && process.env.NODE_ENV === 'production') return []
    base = parsed.origin
  } catch { return [] }
  const paths = ['', '/about', '/products', '/solutions', '/technology', '/capabilities', '/certifications', '/contact']
  const cms = await getCMS()
  const [products, projects] = cms ? await Promise.all([
    cms.find({ collection: 'products', where: { and: [{ status: { equals: 'published' } }, { productType: { equals: 'standard' } }] }, limit: 1000 }).then(result => result.docs).catch(() => []),
    cms.find({ collection: 'projects', where: { status: { equals: 'published' } }, limit: 1000 }).then(result => result.docs).catch(() => []),
  ]) : [[], []]
  const dynamicPaths = [
    ...products.map((product) => `/products/${product.slug}`),
    ...projects.map((project) => `/projects/${project.slug}`),
  ]
  const lastModified = new Date()
  return [...paths, ...dynamicPaths].map((path) => ({ url: `${base}${path}`, lastModified }))
}
