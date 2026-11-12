import type { Metadata } from 'next'
import { publicCompanyName } from '@/lib/company'
import { getCMS } from '@/lib/cms'
import { canonicalFor } from '@/lib/metadata'

const canonical = canonicalFor('/about')
export const metadata: Metadata = { title: 'About Green Volt Energy Solution', ...(canonical ? { alternates: { canonical } } : {}) }

const companyOverview = 'Green Volt Energy Solution was established with a vision to contribute to the growing electric mobility and clean-energy ecosystem. Driven by an interest in battery technology, sustainable energy and customised engineering, the company focuses on LiFePO4 battery packs for a range of applications. With in-house battery design and assembly capabilities, Green Volt works with customers to develop battery solutions according to their technical and application requirements. The company aims to strengthen its manufacturing capabilities, quality systems and long-term partnerships.'
const companyMission = 'To manufacture reliable, quality-focused lithium battery solutions, make battery technology more accessible, support clean mobility and deliver customised solutions for diverse applications.'
const companyVision = 'To become a recognised and trusted battery solutions partner across India by expanding manufacturing capabilities, strengthening industry partnerships and contributing to the future of electric mobility and clean energy.'

export default async function AboutPage() {
  const cms = await getCMS()
  const profile = cms ? await cms.findGlobal({ slug: 'company-profile' }).catch(() => null) : null
  const homepage = cms ? await cms.findGlobal({ slug: 'homepage' }).catch(() => null) : null
  return <main className="section"><div className="wrap">
    <p className="eyebrow">About the company</p>
    <h1>{publicCompanyName(profile?.companyName)}</h1>
    <p className="lead">{homepage?.aboutIntro || profile?.overview || companyOverview}</p>
    <div className="cards about-values">
      <article className="card"><span className="eyebrow">Our mission</span><p>{profile?.mission || companyMission}</p></article>
      <article className="card"><span className="eyebrow">Our vision</span><p>{profile?.vision || companyVision}</p></article>
    </div>
    <div className="about-note"><h2>How we work</h2><p>Green Volt supports both in-house design and customer-provided designs. Pack configuration is discussed for each application, including voltage, capacity, dimensions, BMS, connectors and wiring, subject to engineering confirmation.</p></div>
  </div></main>
}
