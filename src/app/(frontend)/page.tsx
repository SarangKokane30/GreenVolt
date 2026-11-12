import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { InquiryForm } from '@/components/InquiryForm'
import { TestimonialCarousel } from '@/components/TestimonialCarousel'
import { getCMS } from '@/lib/cms'

export const metadata = { title: 'GreenVolt Energy Solutions | Powering Sustainable Mobility', description: 'Explore GreenVolt LiFePO₄ battery solutions for mobility, energy storage and industrial applications.' }

type ResolvedMedia = { url?: string; alt?: string }
type Media = ResolvedMedia | number | string
type Product = { id: string | number; slug: string; name: string; description?: string; category?: { name?: string } | number | string; images?: Array<{ image?: Media; alt?: string }> }
type Service = { id: string | number; name: string; description?: string; image?: Media }
type Certificate = { id: string | number; name: string; type: string; authority?: string; expiryDate?: string; document?: Media }
type Project = { id: string | number; title: string; slug: string; application?: string; summary?: string; image?: Media }
type Testimonial = { id: string | number; quote: string; attribution: string; role?: string; organization?: string }

function media(value?: Media): ResolvedMedia | null { return value && typeof value === 'object' ? value : null }

export default async function HomePage() {
  const cms = await getCMS()
  const [productRecords, homepage, applicationRecords, serviceRecords, certificateRecords, testimonialRecords, projectRecords] = cms ? await Promise.all([
    cms.find({ collection: 'products', where: { and: [{ status: { equals: 'published' } }, { featured: { equals: true } }] }, depth: 2, limit: 3, sort: 'name' }).then(r => r.docs).catch(() => []),
    cms.findGlobal({ slug: 'homepage' }).catch(() => null),
    cms.find({ collection: 'applications', where: { status: { equals: 'published' } }, limit: 6, sort: 'name' }).then(r => r.docs).catch(() => []),
    cms.find({ collection: 'services', where: { status: { equals: 'published' } }, depth: 1, limit: 4, sort: 'name' }).then(r => r.docs).catch(() => []),
    cms.find({ collection: 'certifications', where: { and: [{ status: { equals: 'published' } }, { expiryDate: { greater_than_equal: new Date().toISOString().slice(0, 10) } }] }, depth: 1, limit: 4, sort: 'name' }).then(r => r.docs).catch(() => []),
    cms.find({ collection: 'testimonials', where: { status: { equals: 'published' } }, limit: 8 }).then(r => r.docs).catch(() => []),
    cms.find({ collection: 'projects', where: { status: { equals: 'published' } }, depth: 1, limit: 3, sort: '-createdAt' }).then(r => r.docs).catch(() => []),
  ]) : [[], null, [], [], [], [], []]

  const products = productRecords as unknown as Product[]
  const applications = applicationRecords as unknown as Array<{ id: string | number; name: string; description?: string }>
  const services = serviceRecords as unknown as Service[]
  const certificates = certificateRecords as unknown as Certificate[]
  const testimonials = testimonialRecords as unknown as Testimonial[]
  const projects = projectRecords as unknown as Project[]
  const heroTitle = homepage?.heroTitle || 'Powering sustainable mobility and energy storage.'
  const heroText = homepage?.heroText || 'LiFePO₄ battery solutions shaped around the needs of your application.'

  return <main>
    <section className="hero hero-photo">
      <Image className="hero-photo-image" src="/images/greenvolt-battery-hero.png" alt="Modular lithium battery pack in a studio setting" fill priority sizes="100vw" />
      <div className="hero-shade" />
      <div className="wrap hero-grid"><div className="hero-copy-block"><p className="eyebrow">Lithium energy solutions</p><h1>{heroTitle}</h1><p className="lead">{heroText}</p><div className="actions"><Link className="button primary" href="/products">Explore products <span aria-hidden="true">↗</span></Link><Link className="button light-outline" href="#request-quote">Request a quote</Link></div><p className="hero-caption">LiFePO₄ battery systems · Built around your requirements</p></div><div className="hero-index"><span>01</span><i/>BATTERY SYSTEMS</div></div>
      <a className="hero-scroll" href="#company-intro"><span/>Scroll to explore</a>
    </section>

    <section className="section intro-section" id="company-intro"><div className="wrap intro-grid">
      <div className="intro-photo"><Image src="/images/lifepo4-technology.png" alt="Close view of a modular battery pack and battery management components" fill sizes="(max-width: 760px) 100vw, 45vw"/><span className="image-note">Battery systems · LiFePO₄</span></div>
      <div className="intro-copy"><p className="eyebrow">About GreenVolt</p><h2>Energy solutions, shaped around the work they do.</h2><p>{homepage?.aboutIntro || 'GreenVolt Energy Solutions focuses on lithium battery solutions for mobility, energy storage and industrial use. Tell us what you are building and we can begin with your application requirements.'}</p><div className="intro-points"><div><span>01</span><p><b>Technology focus</b><small>LiFePO₄ systems and application requirements.</small></p></div><div><span>02</span><p><b>Clear information</b><small>Product details are shared when confirmed.</small></p></div><div><span>03</span><p><b>Quality records</b><small>Published certificates are visible in our quality section.</small></p></div></div><Link className="text-link" href="/about">More about GreenVolt <span aria-hidden="true">↗</span></Link></div>
    </div></section>

    <section className="section applications-section"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">Applications</p><h2>Energy for a range of industries.</h2></div><p>Explore application areas, or talk with us about a use case not listed here.</p></div>
      {applications.length ? <div className="application-grid">{applications.map((item, index) => <Link className="application-card" href={`/contact?type=custom-solution&application=${encodeURIComponent(item.name)}`} key={item.id}><span className="application-number">0{index + 1}</span><h3>{item.name}</h3><p>{item.description || 'Discuss your application requirements with GreenVolt.'}</p><span className="application-arrow" aria-hidden="true">↗</span></Link>)}</div> : <div className="application-grid">{['Electric mobility', 'Energy storage', 'Industrial equipment', 'Backup power', 'Drones & robotics', 'Custom applications'].map((item, index) => <Link className="application-card" href={`/contact?type=custom-solution&application=${encodeURIComponent(item)}`} key={item}><span className="application-number">0{index + 1}</span><h3>{item}</h3><p>Potential application area. Share your use case with our team.</p><span className="application-arrow" aria-hidden="true">↗</span></Link>)}</div>}
    </div></section>

    <section className="section products-section"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">Featured products</p><h2>Find a place to start.</h2></div><Link className="text-link" href="/products">View all products <span aria-hidden="true">↗</span></Link></div>
      {products.length ? <div className="product-showcase">{products.map((product, index) => { const image = media(product.images?.[0]?.image); return <Link className={`showcase-card showcase-${index + 1}`} href={`/products/${product.slug}`} key={product.id}><div className="showcase-image">{image?.url ? <Image src={image.url} alt={product.images?.[0]?.alt || image.alt || product.name} fill sizes="(max-width: 760px) 100vw, 33vw"/> : <div className="showcase-placeholder"><span>LiFePO₄</span></div>}<span className="showcase-number">0{index + 1}</span></div><div className="showcase-info"><div><h3>{product.name}</h3><p>{product.description}</p></div><span className="round-arrow" aria-hidden="true">↗</span></div></Link>})}</div> : <div className="cms-empty"><span className="cms-empty-mark">GV</span><div><h3>Product range</h3><p>Featured products will appear here when product information is verified and published in the admin.</p></div><Link className="text-link" href="/products">Browse product categories <span aria-hidden="true">↗</span></Link></div>}
    </div></section>

    <section className="section technology-section"><div className="wrap technology-grid"><div className="technology-image"><Image src="/images/lifepo4-technology.png" alt="Battery cell assembly with management electronics and insulated connections" fill sizes="(max-width: 760px) 100vw, 48vw"/><span className="technology-image-label">Cell · Pack · BMS</span></div><div className="technology-copy"><p className="eyebrow">Technology</p><h2>One system. Many connected decisions.</h2><p>Cell chemistry is one part of battery performance. Pack architecture, battery management, thermal and electrical design, charging, and use conditions all matter.</p><div className="tech-list"><Link href="/technology"><span>01</span><b>LiFePO₄ chemistry</b><span>↗</span></Link><Link href="/technology"><span>02</span><b>Battery architecture</b><span>↗</span></Link><Link href="/technology"><span>03</span><b>Battery management systems</b><span>↗</span></Link><Link href="/technology"><span>04</span><b>Testing & safety considerations</b><span>↗</span></Link></div><Link className="button dark-button" href="/technology">Explore our technology <span aria-hidden="true">↗</span></Link></div></div></section>

    <section className="section services-section"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">Manufacturing & services</p><h2>Talk through the next step.</h2></div><p>Services appear here after they are confirmed and published by the GreenVolt team.</p></div>
      {services.length ? <div className="service-grid">{services.map((service, index) => { const image = media(service.image); return <article className="service-card" key={service.id}><div className={`service-image service-image-${index + 1}`}>{image?.url ? <Image src={image.url} alt={image.alt || service.name} fill sizes="(max-width: 760px) 100vw, 33vw"/> : <div className="service-image-placeholder"><span>GREENVOLT / {String(index + 1).padStart(2, '0')}</span></div>}</div><div className="service-content"><span className="eyebrow">Service · {String(index + 1).padStart(2, '0')}</span><h3>{service.name}</h3><p>{service.description}</p><Link href={`/contact?type=custom-solution&service=${encodeURIComponent(service.name)}`} aria-label={`Ask about ${service.name}`}>Discuss this service <span aria-hidden="true">↗</span></Link></div></article>})}</div> : <div className="services-pending"><div><span className="eyebrow">Editable in Payload CMS</span><h3>Verified services will be shown here.</h3><p>Only capabilities and services confirmed by the GreenVolt administrator are published on this page.</p></div><Link className="button outline" href="/contact?type=general">Ask us a question <span aria-hidden="true">↗</span></Link></div>}
    </div></section>

    <section className="quality-band"><div className="wrap quality-layout"><div className="quality-intro"><p className="eyebrow">Quality & certifications</p><h2>Documentation you can verify.</h2><p>We publish certificates and test documents once their scope and validity are confirmed.</p><Link className="light-link" href="/certifications">View quality records <span aria-hidden="true">↗</span></Link></div><div className="quality-records">{certificates.length ? certificates.map((certificate) => <article className="quality-record" key={certificate.id}><span>{certificate.type === 'company' ? 'Company record' : 'Product record'}</span><h3>{certificate.name}</h3><p>{certificate.authority || 'Issuing authority'}</p>{certificate.expiryDate && <small>Valid through {new Date(certificate.expiryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</small>}</article>) : <div className="quality-pending"><span className="quality-emblem">Q</span><div><h3>No certificates published yet</h3><p>Only current certificates are displayed here.</p></div></div>}</div></div></section>

    {testimonials.length > 0 && <section className="section testimonial-section"><div className="wrap testimonial-layout"><div><p className="eyebrow">Customer perspectives</p><h2>In their words.</h2><p>Testimonials are published after approval and attribution by the customer.</p></div><TestimonialCarousel items={testimonials}/></div></section>}

    {projects.length > 0 && <section className="section projects-section"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">Project stories</p><h2>Applications in context.</h2></div><p>Project information is published only when approved for sharing.</p></div><div className="project-grid">{projects.map((project, index) => {const image = media(project.image);return <Link className={`project-card project-${index + 1}`} href={`/projects/${project.slug}`} key={project.id}><div className="project-image">{image?.url ? <Image src={image.url} alt={image.alt || project.title} fill sizes="(max-width: 760px) 100vw, 50vw"/> : <div className="service-image-placeholder"><span>PROJECT / {String(index + 1).padStart(2, '0')}</span></div>}</div><div className="project-caption"><span>{project.application || 'Battery application'}</span><h3>{project.title}</h3><p>{project.summary}</p><span className="text-link">Read project story ↗</span></div></Link>})}</div></div></section>}

    <section className="section quote-section" id="request-quote"><div className="wrap quote-layout"><div className="quote-intro"><p className="eyebrow">Request a quote</p><h2>Let&apos;s talk about what your system needs.</h2><p>Share your application and requirements. The team can use those details to start a product or technical conversation.</p><div className="quote-steps"><div><span>01</span><p><b>Tell us the application</b><small>Include the use case and operating context.</small></p></div><div><span>02</span><p><b>Share requirements</b><small>Voltage, capacity and quantity help frame the request.</small></p></div><div><span>03</span><p><b>We’ll follow up</b><small>Use verified contact details so we can respond.</small></p></div></div></div><Suspense fallback={<div className="form-loading">Loading quote form…</div>}><InquiryForm/></Suspense></div></section>
  </main>
}
