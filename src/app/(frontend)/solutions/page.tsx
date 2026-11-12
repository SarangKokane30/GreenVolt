import type { Metadata } from 'next'
import Link from 'next/link'
import { getCMS } from '@/lib/cms'
import { canonicalFor } from '@/lib/metadata'

const canonical = canonicalFor('/solutions')
export const metadata: Metadata = { title: 'Battery Applications | Green Volt Energy Solution', description: 'LiFePO4 battery pack applications for electric mobility, energy storage, industrial equipment and agriculture.', ...(canonical ? { alternates: { canonical } } : {}) }

const useCases = [
  'EV two-wheelers', 'EV three-wheelers', 'EV four-wheelers', 'Commercial vehicles',
  'Solar energy storage', 'Inverters and backup', 'Industrial equipment', 'Agricultural equipment',
]

export default async function SolutionsPage() {
  const cms = await getCMS()
  const applications = cms ? await cms.find({ collection: 'applications', where: { status: { equals: 'published' } }, sort: 'order', limit: 100 }).then(result => result.docs).catch(() => []) : []
  const items = applications.length ? applications : useCases.map((name) => ({ id: name, name, description: '' }))
  return <main className="section"><div className="wrap">
    <p className="eyebrow">Applications</p>
    <h1>Custom battery packs for mobility, energy and industry.</h1>
    <p className="lead">Green Volt works with EV manufacturers and OEMs, as well as dealers, distributors, businesses and individuals. Each configuration is discussed against its application and engineering requirements.</p>
    <div className="application-grid application-page-grid">{items.map((item) => <article className="application-card" key={item.id}><h2>{item.name}</h2>{item.description && <p>{item.description}</p>}<Link href={`/contact?type=custom-solution&application=${encodeURIComponent(item.name)}`}>Discuss this application <span aria-hidden="true">↗</span></Link></article>)}</div>
    <div className="solution-cta"><div><p className="eyebrow">Custom configurations</p><h2>Have a specific vehicle or equipment in mind?</h2><p>Share voltage, capacity, available space, BMS and connection requirements. Details are subject to engineering confirmation.</p></div><Link className="button primary" href="/contact?type=custom-solution">Build your custom battery ↗</Link></div>
  </div></main>
}
