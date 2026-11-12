import type { Metadata } from 'next'
import { getCMS } from '@/lib/cms'
import { canonicalFor } from '@/lib/metadata'

const canonical = canonicalFor('/capabilities')
export const metadata: Metadata = { title: 'Manufacturing Capabilities | Green Volt Energy Solution', ...(canonical ? { alternates: { canonical } } : {}) }

const confirmedCapabilities = [
  ['Battery pack manufacturing and assembly', 'Green Volt manufactures and assembles complete LiFePO4 battery packs.'],
  ['In-house and customer-provided design', 'Both in-house design and customer-provided designs are supported.'],
  ['Cell interconnection', 'Spot welding is used for cell interconnection.'],
  ['Incoming cell checks', 'Incoming cells are capacity tested and graded.'],
  ['Product-dependent testing', 'Pack tests vary depending on the product. Specific tests and criteria are confirmed for each configuration.'],
]

export default async function CapabilitiesPage() {
  const cms = await getCMS()
  const records = cms ? await cms.find({ collection: 'capabilities', where: { status: { equals: 'published' } }, sort: 'order', limit: 100 }).then(result => result.docs).catch(() => []) : []
  const items = records.length ? records.map(record => [record.name, record.description || ''] as const) : confirmedCapabilities
  return <main className="section"><div className="wrap">
    <p className="eyebrow">Manufacturing capabilities</p>
    <h1>Battery pack design, manufacturing and assembly.</h1>
    <p className="lead">The capabilities below reflect information provided by Green Volt Energy Solution. Configuration and process details may vary by order.</p>
    <div className="cards capability-grid">{items.map(([title, description]) => <article className="card" key={title}><h2>{title}</h2><p>{description}</p></article>)}</div>
  </div></main>
}
