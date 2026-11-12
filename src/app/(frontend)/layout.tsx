import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MotionEffects } from '@/components/MotionEffects'
import { SiteHeader } from '@/components/SiteHeader'
import { companyDefaults, publicCompanyName, safeHttpsUrl } from '@/lib/company'
import { getCMS } from '@/lib/cms'
import './site.css'

// The shared shell reads navigation, company profile, and settings from Payload.
// Render it per request so CMS edits appear without rebuilding the site.
export const dynamic = 'force-dynamic'

function validSiteUrl(value?: string | null) {
  if (!value) return undefined
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' || process.env.NODE_ENV !== 'production' ? parsed : undefined
  } catch { return undefined }
}

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCMS()
  const [profile, settings] = cms ? await Promise.all([
    cms.findGlobal({ slug: 'company-profile' }).catch(() => null),
    cms.findGlobal({ slug: 'site-settings' }).catch(() => null),
  ]) : [null, null]
  const name = publicCompanyName(profile?.companyName || settings?.siteName)
  const description = settings?.defaultDescription || 'Customised LiFePO4 battery packs for electric mobility, energy storage and industrial applications.'
  const siteUrl = validSiteUrl(settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL)
  const ogImage = settings?.defaultOgImage && typeof settings.defaultOgImage === 'object' ? settings.defaultOgImage.url : undefined
  return {
    metadataBase: siteUrl,
    title: { default: name, template: `%s | ${name}` },
    description,
    openGraph: { siteName: name, type: 'website', description, ...(ogImage ? { images: [ogImage] } : {}) },
  }
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const cms = await getCMS()
  const [categoryResult, profile, navigationGlobal] = cms ? await Promise.all([
    cms.find({ collection: 'product-categories', where: { active: { equals: true } }, sort: 'order', limit: 20 }).then(result => result.docs).catch(() => []),
    cms.findGlobal({ slug: 'company-profile' }).catch(() => null),
    cms.findGlobal({ slug: 'navigation' }).catch(() => null),
  ]) : [[], null, null]
  const categories = categoryResult.map(category => ({ name: category.name, slug: category.slug }))
  const navigation = (navigationGlobal?.items || []).filter(item => typeof item.label === 'string' && typeof item.href === 'string')
  const socialLinks = profile?.socialLinks || {}
  const phone = profile?.phone || companyDefaults.phone
  const email = profile?.email || companyDefaults.email
  const address = profile?.address || companyDefaults.address
  const instagram = safeHttpsUrl(socialLinks.instagram, companyDefaults.instagram)
  const whatsapp = safeHttpsUrl(socialLinks.whatsapp, companyDefaults.whatsapp)
  const company = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: publicCompanyName(profile?.companyName),
    email,
    telephone: phone,
    address: { '@type': 'PostalAddress', streetAddress: 'L-Block, MIDC', addressLocality: 'Ahilyanagar', addressRegion: 'Maharashtra', addressCountry: 'IN' },
    sameAs: [instagram],
  }

  return <html lang="en" data-scroll-behavior="smooth">
    <body>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(company).replace(/</g, '\\u003c') }} />
      <MotionEffects />
      <SiteHeader categories={categories} navigation={navigation} />
      {children}
      <footer className="footer">
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <Link href="/" aria-label="Green Volt Energy Solution home"><Image src="/assets/greenvolt-logo.png" width={128} height={88} alt="Green Volt Energy Solution" /></Link>
            <p>{profile?.overview || companyDefaults.overview}</p>
          </div>
          <div className="footer-column"><h2>Company</h2><Link href="/about">About Green Volt</Link><Link href="/capabilities">Manufacturing capabilities</Link><Link href="/solutions">Applications</Link><Link href="/certifications">Quality records</Link></div>
          <div className="footer-column"><h2>Explore</h2><Link href="/products">Standard products</Link><Link href="/contact?type=custom-solution">Custom battery packs</Link><Link href="/technology">Battery technology</Link><Link href="/contact">Request a quote</Link></div>
          <div className="footer-column footer-contact"><h2>Contact</h2><p>{address}</p><a href={`mailto:${email}`}>{email}</a><a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a><div className="footer-socials"><a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a><a href={instagram} target="_blank" rel="noreferrer">Instagram</a></div></div>
          <div className="footer-bottom"><small>© {new Date().getFullYear()} {publicCompanyName(profile?.companyName)}. All rights reserved.</small><div><Link href="/privacy">Privacy information</Link><Link href="/terms">Website terms</Link></div></div>
        </div>
      </footer>
    </body>
  </html>
}
