import type { Metadata } from 'next'
import { getCMS } from '@/lib/cms'
import { canonicalFor } from '@/lib/metadata'

const canonical = canonicalFor('/technology')
export const metadata: Metadata = { title: 'LiFePO4 Battery Technology | Green Volt Energy Solution', description: 'Learn about Green Volt battery pack design, assembly and application-dependent configurations.', ...(canonical ? { alternates: { canonical } } : {}) }

export default async function TechnologyPage() {
  const cms = await getCMS()
  const homepage = cms ? await cms.findGlobal({ slug: 'homepage' }).catch(() => null) : null
  return <main className="section"><div className="wrap">
    <p className="eyebrow">Battery technology</p>
    <h1>LiFePO4 packs configured for their application.</h1>
    <p className="lead">Pack performance depends on cell selection, configuration, BMS, charging and operating conditions. Product-specific technical information is shared when confirmed for that pack.</p>
    <div className="technology-content">
      <section><h2>Cells and configuration</h2><p>Green Volt works with cylindrical and prismatic LiFePO4 cells sourced through authorised distributors. Cell format and configuration vary by product and customer requirements.</p></section>
      <section><h2>Design and assembly</h2><p>{homepage?.manufacturingIntro || 'Green Volt supports in-house battery design and customer-provided designs. Pack assembly uses spot welding for cell interconnection. Incoming cells are capacity tested and graded.'}</p></section>
      <section><h2>BMS and testing</h2><p>BMS features depend on the selected model. Pack testing varies by product; specific protections, test criteria and results are not generalized across products.</p></section>
    </div>
  </div></main>
}
