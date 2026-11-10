import Link from 'next/link'
import { getCMS } from '@/lib/cms'

export const metadata = { title: "GreenVolt Energy Solutions | Powering What's Next", description: 'LiFePO₄ battery solutions for electric mobility, energy storage and industrial applications.' }

export default async function HomePage() {
  const cms = await getCMS()
  const [products, homepage] = cms ? await Promise.all([
    cms.find({ collection: 'products', where: { and: [{ status: { equals: 'published' } }, { featured: { equals: true } }] }, limit: 3, sort: 'name' }).then(r => r.docs).catch(() => []),
    cms.findGlobal({ slug: 'homepage' }).catch(() => null),
  ]) : [[], null]
  const heroTitle = homepage?.heroTitle || 'Powering sustainable mobility and energy storage.'
  const heroText = homepage?.heroText || 'Thoughtfully engineered LiFePO₄ battery solutions for electric mobility, energy storage and industrial applications.'
  const sections = ['Electric mobility', 'Energy storage', 'Industrial equipment', 'Backup power', 'Drones & robotics', 'Custom applications']
  return <main><section className="hero"><div className="wrap hero-grid"><div><p className="eyebrow">Lithium energy solutions</p><h1>{heroTitle}</h1><p className="lead">{heroText}</p><div className="actions"><Link className="button primary" href="/products">Explore products ↗</Link><Link className="button outline" href="/contact?type=quote">Request an inquiry</Link></div><p className="quiet">Product specifications and certifications are shared where verified.</p></div><div className="visual"><div className="battery"><b>GREENVOLT</b><span>ENERGY SOLUTIONS · LiFePO₄</span></div></div></div></section>
    <section className="section"><div className="wrap"><div className="section-head"><div><p className="eyebrow">Our products</p><h2>Battery solutions for what comes next.</h2></div><Link className="text-link" href="/products">Browse catalogue ↗</Link></div>{products.length ? <div className="cards">{products.map(p => { const product=p as {id:string|number;slug:string;name:string;description?:string}; return <Link className="card" key={product.id} href={`/products/${product.slug}`}><span className="eyebrow">Featured product</span><h3>{product.name}</h3><p>{product.description}</p><b>View details ↗</b></Link>})}</div> : <div className="empty-state">Product listings will appear here once verified product information is added in the admin dashboard. <Link href="/products">Explore categories ↗</Link></div>}</div></section>
    <section className="section dark"><div className="wrap two-col"><div><p className="eyebrow">LiFePO₄ technology</p><h2>Designed around the application.</h2><p>Cell selection, pack architecture, battery management and operating conditions all shape system performance. We keep technical discussions grounded in your application and verified product data.</p><Link className="button primary" href="/technology">Explore technology ↗</Link></div><div className="fact-box"><h3>Technical information</h3><p>Specific performance, safety and life cycle claims depend on the product configuration and verified test data. Ask us about information applicable to your requirements.</p></div></div></section>
    <section className="section"><div className="wrap"><div className="section-head"><div><p className="eyebrow">Applications</p><h2>One chemistry. Many possibilities.</h2></div><p>Potential application areas to explore with GreenVolt.</p></div><div className="chips">{sections.map(s => <span key={s}>{s}</span>)}</div></div></section>
    <section className="section mist"><div className="wrap two-col"><div><p className="eyebrow">About GreenVolt</p><h2>Energy solutions with a focus on reliability.</h2></div><div><p>{homepage?.aboutIntro || 'GreenVolt Energy Solutions focuses on lithium battery solutions built around practical application needs. Product, capability and quality information is published as the company confirms it.'}</p><Link className="text-link" href="/about">About GreenVolt ↗</Link></div></div></section>
    <section className="section dark"><div className="wrap section-head"><div><p className="eyebrow">Start a conversation</p><h2>{homepage?.finalCta || 'Let’s power your next project.'}</h2><p>Share your application and requirements for a technical discussion.</p></div><Link className="button primary" href="/contact?type=quote">Contact us ↗</Link></div></section>
  </main>
}
