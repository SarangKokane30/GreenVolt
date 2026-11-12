import type { Metadata } from 'next'
import Link from 'next/link'
import { getCMS } from '@/lib/cms'
import { canonicalFor } from '@/lib/metadata'

const canonical = canonicalFor('/certifications')
export const metadata: Metadata = { title: 'Quality Records | Green Volt Energy Solution', description: 'View certification records Green Volt has verified and approved for public display.', ...(canonical ? { alternates: { canonical } } : {}) }

type Certificate = { id: string | number; type: string; name: string; authority?: string; number?: string; scope?: string; issueDate?: string; expiryDate?: string; document?: { url?: string } | number | string }

export default async function CertificationsPage() {
  const cms = await getCMS()
  const records = cms ? await cms.find({
    collection: 'certifications',
    where: { and: [{ status: { equals: 'published' } }, { verifiedForPublic: { equals: true } }, { publicVisibility: { equals: true } }] },
    depth: 1,
    limit: 100,
  }).then(result => result.docs as unknown as Certificate[]).catch(() => []) : []
  const today = new Date().toISOString().slice(0, 10)
  const certificates = records.filter(record => !record.expiryDate || record.expiryDate >= today)
  return <main className="section"><div className="wrap">
    <p className="eyebrow">Quality records</p>
    <h1>Certification documents.</h1>
    <p className="lead">Only certificates reviewed for issuer, scope, validity and public visibility are shown here.</p>
    {certificates.length ? <div className="cards certification-grid">{certificates.map(certificate => {
      const document = typeof certificate.document === 'object' ? certificate.document : null
      return <article className="card" key={certificate.id}>
        <span className="eyebrow">{certificate.type === 'company' ? 'Company record' : 'Product record'}</span>
        <h2>{certificate.name}</h2>
        {certificate.authority && <p><b>Issuing body:</b> {certificate.authority}</p>}
        {certificate.number && <p><b>Certificate number:</b> {certificate.number}</p>}
        {certificate.scope && <p><b>Scope:</b> {certificate.scope}</p>}
        {certificate.issueDate && <p><b>Issued:</b> {certificate.issueDate}</p>}
        {certificate.expiryDate && <p><b>Expires:</b> {certificate.expiryDate}</p>}
        {document?.url && <Link className="text-link" href={document.url}>View certificate <span aria-hidden="true">↗</span></Link>}
      </article>
    })}</div> : <p className="empty-state">Green Volt does not currently list certificate documents publicly on this website. Certification claims are not made without verified supporting documents.</p>}
  </div></main>
}
