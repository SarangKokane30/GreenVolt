import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL
  let sitemap: string | undefined
  try {
    if (configuredUrl) {
      const parsed = new URL(configuredUrl)
      if (parsed.protocol === 'https:' || process.env.NODE_ENV !== 'production') sitemap = new URL('/sitemap.xml', parsed).toString()
    }
  } catch { /* A domain is intentionally omitted until a valid site URL is configured. */ }
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }, ...(sitemap ? { sitemap } : {}) }
}
