import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { InquiryForm } from '@/components/InquiryForm'
import { TestimonialCarousel } from '@/components/TestimonialCarousel'
import { companyDefaults, safeHttpsUrl } from '@/lib/company'
import { getCMS } from '@/lib/cms'
import { canonicalFor } from '@/lib/metadata'

const canonical = canonicalFor('/')
export const metadata: Metadata = {
  title: 'Green Volt Energy Solution | Custom LiFePO4 Battery Packs',
  description: 'Customised LiFePO4 battery packs for electric mobility, energy storage and industrial applications.',
  ...(canonical ? { alternates: { canonical } } : {}),
  openGraph: { title: 'Green Volt Energy Solution', description: 'Customised LiFePO4 battery packs for mobility, storage and industry.', type: 'website' },
}

type ProductImage = { url?: string; alt?: string } | number | string
type Product = { id: string | number; slug: string; name: string; description?: string; productType?: string; category?: { name?: string } | number | string; images?: Array<{ image?: ProductImage; alt?: string }> }
type Application = { id?: string | number; name: string; slug?: string; description?: string }
type Testimonial = { id: string | number; quote: string; attribution: string; role?: string; organization?: string }
type Certificate = { id: string | number; name: string; type: string; authority?: string; scope?: string; expiryDate?: string }

const verifiedApplications = [
  { name: 'Two-wheeler EVs', description: 'LiFePO4 battery packs for electric two-wheeler applications.' },
  { name: 'Three-wheeler EVs', description: 'Battery solutions for electric three-wheelers.' },
  { name: 'Four-wheeler EVs', description: 'Custom pack discussions for electric four-wheelers.' },
  { name: 'Commercial vehicles', description: 'Battery requirements for commercial electric mobility.' },
  { name: 'Solar energy storage', description: 'Battery pack requirements for solar storage systems.' },
  { name: 'Inverters and backup', description: 'Custom battery requirements for inverter and backup use.' },
  { name: 'Industrial equipment', description: 'Battery applications for industrial equipment.' },
  { name: 'Agricultural equipment', description: 'Battery requirements for agricultural equipment.' },
]

function productImage(value?: ProductImage) {
  return value && typeof value === 'object' ? value : null
}

export default async function HomePage() {
  const cms = await getCMS()
  const [productResult, homepage, applicationResult, certificateResult, testimonialResult, profile] = cms ? await Promise.all([
    cms.find({ collection: 'products', where: { and: [{ status: { equals: 'published' } }, { featured: { equals: true } }, { productType: { equals: 'standard' } }] }, depth: 2, limit: 3, sort: 'name' }).catch(() => ({ docs: [] })),
    cms.findGlobal({ slug: 'homepage' }).catch(() => null),
    cms.find({ collection: 'applications', where: { status: { equals: 'published' } }, limit: 8, sort: 'order' }).catch(() => ({ docs: [] })),
    cms.find({ collection: 'certifications', where: { and: [{ status: { equals: 'published' } }, { verifiedForPublic: { equals: true } }, { publicVisibility: { equals: true } }, { or: [{ expiryDate: { greater_than_equal: new Date().toISOString().slice(0, 10) } }, { expiryDate: { exists: false } }] }] }, depth: 1, limit: 4, sort: 'name' }).catch(() => ({ docs: [] })),
    cms.find({ collection: 'testimonials', where: { status: { equals: 'published' } }, limit: 8 }).catch(() => ({ docs: [] })),
    cms.findGlobal({ slug: 'company-profile' }).catch(() => null),
  ]) : [{ docs: [] }, null, { docs: [] }, { docs: [] }, { docs: [] }, null]

  const products = productResult.docs as unknown as Product[]
  const applications = applicationResult.docs as unknown as Application[]
  const certificates = certificateResult.docs as unknown as Certificate[]
  const testimonials = testimonialResult.docs as unknown as Testimonial[]
  const listedApplications: Application[] = applications.length ? applications : verifiedApplications
  const heroTitle = homepage?.heroTitle || 'Powering the Future with Custom Lithium Battery Solutions.'
  const heroText = homepage?.heroText || 'Green Volt Energy Solution designs and manufactures customised LiFePO4 battery packs for electric mobility, energy storage and industrial applications. We work closely with customers to develop battery solutions that meet their specific requirements.'
  const socials = profile?.socialLinks || {}
  const whatsapp = safeHttpsUrl(socials.whatsapp, companyDefaults.whatsapp)
  const instagram = safeHttpsUrl(socials.instagram, companyDefaults.instagram)

  return <main>
    <section className="hero hero-photo">
      <Image className="hero-photo-image" src="/images/greenvolt-battery-hero.webp" alt="Illustrative rendering of a lithium battery pack; not a Green Volt product photograph" fill priority sizes="100vw" />
      <div className="hero-shade" />
      <div className="wrap hero-grid"><div className="hero-copy-block"><p className="eyebrow">Custom LiFePO4 battery packs</p><h1>{heroTitle}</h1><p className="lead">{heroText}</p><div className="actions"><Link className="button primary" href="/contact?type=quote">Request a Quote <span aria-hidden="true">↗</span></Link><Link className="button light-outline" href="/solutions">Explore Solutions</Link></div><p className="hero-caption">Illustrative imagery · Product configurations are confirmed per enquiry</p></div><div className="hero-index"><span>01</span><i/>BATTERY SOLUTIONS</div></div>
      <a className="hero-scroll" href="#company-intro"><span/>Scroll to explore</a>
    </section>

    <section className="section intro-section" id="company-intro"><div className="wrap intro-grid">
      <div className="intro-photo"><Image src="/images/lifepo4-technology.webp" alt="Illustrative lithium battery cell and battery management components" fill sizes="(max-width: 760px) 100vw, 45vw"/><span className="image-note">Illustrative battery technology image</span></div>
      <div className="intro-copy"><p className="eyebrow">About Green Volt</p><h2>Battery solutions shaped around your application.</h2><p>{homepage?.aboutIntro || 'Green Volt Energy Solution focuses on LiFePO4 battery packs for electric mobility, energy storage and industrial applications. With in-house battery design and assembly capabilities, the company works with customers to develop solutions around their technical and application requirements.'}</p><div className="intro-points"><div><span>01</span><p><b>Custom configurations</b><small>Voltage, capacity, dimensions and connections are discussed for each requirement.</small></p></div><div><span>02</span><p><b>Multiple cell formats</b><small>Cylindrical and prismatic cells are sourced through authorised suppliers.</small></p></div><div><span>03</span><p><b>Customer-led design</b><small>Green Volt supports in-house design and customer-provided designs.</small></p></div></div><Link className="text-link" href="/about">About the company <span aria-hidden="true">↗</span></Link></div>
    </div></section>

    <section className="section applications-section"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">Applications</p><h2>Solutions across mobility, energy and industry.</h2></div><p>{homepage?.applicationsIntro || 'Green Volt works with EV manufacturers, OEMs, dealers, businesses and individuals to discuss application-specific battery requirements.'}</p></div>
      <div className="application-grid">{listedApplications.map((item, index) => <Link className="application-card" href={`/contact?type=custom-solution&application=${encodeURIComponent(item.name)}`} key={item.id ?? item.name}><span className="application-number">{String(index + 1).padStart(2, '0')}</span><h3>{item.name}</h3><p>{item.description || 'Discuss this application with Green Volt.'}</p><span className="application-arrow" aria-hidden="true">↗</span></Link>)}</div>
    </div></section>

    <section className="section products-section"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">Battery products</p><h2>Start with a standard product or a custom pack.</h2></div><p>Published product details appear when a configuration has been confirmed for sharing.</p></div>
      {products.length ? <div className="product-showcase">{products.map((product, index) => { const image = productImage(product.images?.[0]?.image); return <Link className={`showcase-card showcase-${index + 1}`} href={`/products/${product.slug}`} key={product.id}><div className="showcase-image">{image?.url ? <Image src={image.url} alt={product.images?.[0]?.alt || image.alt || product.name} fill sizes="(max-width: 760px) 100vw, 33vw"/> : <div className="showcase-placeholder"><span>LiFePO4</span></div>}<span className="showcase-number">{String(index + 1).padStart(2, '0')}</span></div><div className="showcase-info"><div><h3>{product.name}</h3><p>{product.description}</p><small>{typeof product.category === 'object' ? product.category?.name : ''}</small></div><span className="round-arrow" aria-hidden="true">↗</span></div></Link>})}</div> : <div className="product-journeys"><article className="product-journey"><span className="eyebrow">Standard products</span><h3>Explore standard products</h3><p>Browse verified product records as they are published. Ask the team about configuration availability.</p><Link className="button outline" href="/products">Explore standard products <span aria-hidden="true">↗</span></Link></article><article className="product-journey product-journey-dark"><span className="eyebrow">Custom solutions</span><h3>Build your custom battery</h3><p>Share voltage, capacity, dimensions, equipment details and expected quantity for an engineering discussion.</p><Link className="button primary" href="/contact?type=custom-solution">Build your custom battery <span aria-hidden="true">↗</span></Link></article></div>}
    </div></section>

    <section className="section technology-section"><div className="wrap technology-grid"><div className="technology-image"><Image src="/images/lifepo4-technology.webp" alt="Illustrative battery cell assembly and management components" fill sizes="(max-width: 760px) 100vw, 48vw"/><span className="technology-image-label">Illustrative image</span></div><div className="technology-copy"><p className="eyebrow">Manufacturing & technology</p><h2>Designed and assembled around the requirements.</h2><p>{homepage?.manufacturingIntro || 'Green Volt manufactures and assembles LiFePO4 battery packs. Confirmed practices include in-house design and assembly, spot welding for cell interconnection, and incoming cell capacity testing and grading. BMS details and pack tests vary by configuration.'}</p><div className="tech-list"><div><span>01</span><b>Requirements and design discussion</b><span>↗</span></div><div><span>02</span><b>Incoming cell capacity testing and grading</b><span>↗</span></div><div><span>03</span><b>Pack assembly and spot welding</b><span>↗</span></div><div><span>04</span><b>Product-dependent pack testing</b><span>↗</span></div></div><Link className="button dark-button" href="/technology">Explore our approach <span aria-hidden="true">↗</span></Link></div></div></section>

    {certificates.length > 0 && <section className="quality-band"><div className="wrap quality-layout"><div className="quality-intro"><p className="eyebrow">Verified records</p><h2>Current documentation you can review.</h2><p>Only records that have been reviewed and approved for public display are shown.</p><Link className="light-link" href="/certifications">View quality records <span aria-hidden="true">↗</span></Link></div><div className="quality-records">{certificates.map((certificate) => <article className="quality-record" key={certificate.id}><span>{certificate.type === 'company' ? 'Company record' : 'Product record'}</span><h3>{certificate.name}</h3><p>{certificate.authority}</p>{certificate.scope && <p>{certificate.scope}</p>}{certificate.expiryDate && <small>Valid through {new Date(certificate.expiryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</small>}</article>)}</div></div></section>}

    {testimonials.length > 0 && <section className="section testimonial-section"><div className="wrap testimonial-layout"><div><p className="eyebrow">Customer perspectives</p><h2>In their words.</h2></div><TestimonialCarousel items={testimonials}/></div></section>}

    <section className="section quote-section" id="request-quote"><div className="wrap quote-layout"><div className="quote-intro"><p className="eyebrow">Request a quote</p><h2>Let’s discuss your battery requirements.</h2><p>Tell us about your vehicle or equipment, operating needs and target configuration.</p><div className="quote-steps"><div><span>01</span><p><b>Share the application</b><small>Vehicle, equipment or energy use case.</small></p></div><div><span>02</span><p><b>Add the requirements you know</b><small>Voltage, capacity, dimensions and quantity.</small></p></div><div><span>03</span><p><b>Continue the discussion</b><small>Green Volt will follow up using your contact details.</small></p></div></div><div className="quote-contact-links"><a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp the team ↗</a><a href={instagram} target="_blank" rel="noreferrer">Instagram ↗</a></div></div><Suspense fallback={<div className="form-loading">Loading quote form…</div>}><InquiryForm/></Suspense></div></section>
  </main>
}
