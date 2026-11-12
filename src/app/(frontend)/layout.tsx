import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MotionEffects } from '@/components/MotionEffects'
import { SiteHeader } from '@/components/SiteHeader'
import { getCMS } from '@/lib/cms'
import './site.css'

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const cms = await getCMS()
  const [categoryRecords, profile] = cms ? await Promise.all([
    cms.find({ collection: 'product-categories', sort: 'order', limit: 20 }).then(result => result.docs).catch(() => []),
    cms.findGlobal({ slug: 'company-profile' }).catch(() => null),
  ]) : [[], null]
  const categories = categoryRecords.map((category) => ({ name: category.name, slug: category.slug }))
  const socials = profile?.socialLinks || {}
  return <><MotionEffects/><SiteHeader categories={categories}/>{children}<footer className="footer"><div className="wrap footer-grid">
    <div className="footer-brand"><Link href="/"><Image src="/assets/greenvolt-logo.png" width={128} height={88} alt="GreenVolt Energy Solutions" /></Link><p>LiFePO₄ battery solutions for mobility, energy storage and industrial applications.</p></div>
    <div className="footer-column"><h2>Company</h2><Link href="/about">About GreenVolt</Link><Link href="/capabilities">Capabilities</Link><Link href="/solutions">Services</Link><Link href="/certifications">Quality & certifications</Link></div>
    <div className="footer-column"><h2>Products</h2><Link href="/products">All products</Link>{categories.slice(0, 4).map(category => <Link key={category.slug} href={`/products?category=${encodeURIComponent(category.name)}`}>{category.name}</Link>)}</div>
    <div className="footer-column footer-contact"><h2>Contact</h2>{profile?.address ? <p>{profile.address}</p> : <p>Contact details will be published when verified.</p>}{profile?.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}{profile?.phone && <a href={`tel:${profile.phone}`}>{profile.phone}</a>}<div className="footer-socials">{Object.entries(socials).filter(([, url]) => typeof url === 'string' && url.length > 0).map(([name, url]) => <a key={name} href={url as string} target="_blank" rel="noreferrer">{name}</a>)}</div></div>
    <div className="footer-bottom"><small>© {new Date().getFullYear()} GreenVolt Energy Solutions. All rights reserved.</small><div><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms & conditions</Link></div></div>
  </div></footer></>
}
