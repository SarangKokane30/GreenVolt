import type { Metadata } from 'next'
import { Suspense } from 'react'
import { InquiryForm } from '@/components/InquiryForm'
import { companyDefaults, safeHttpsUrl } from '@/lib/company'
import { getCMS } from '@/lib/cms'
import { canonicalFor } from '@/lib/metadata'

const canonical = canonicalFor('/contact')
export const metadata: Metadata = { title: 'Contact Green Volt Energy Solution', description: 'Request a quote or discuss custom LiFePO4 battery pack requirements with Green Volt Energy Solution.', ...(canonical ? { alternates: { canonical } } : {}) }

export default async function ContactPage() {
  const cms = await getCMS()
  const profile = cms ? await cms.findGlobal({ slug: 'company-profile' }).catch(() => null) : null
  const address = profile?.address || companyDefaults.address
  const phone = profile?.phone || companyDefaults.phone
  const email = profile?.email || companyDefaults.email
  const socials = profile?.socialLinks || {}
  const instagram = safeHttpsUrl(socials.instagram, companyDefaults.instagram)
  const whatsapp = safeHttpsUrl(socials.whatsapp, companyDefaults.whatsapp)

  return <main className="section"><div className="wrap two-col"><div>
    <p className="eyebrow">Get in touch</p>
    <h1>Let’s discuss your battery requirements.</h1>
    <p>Talk with Green Volt about LiFePO4 battery packs for EV, storage, industrial or agricultural applications.</p>
    <div className="contact-details">
      <p><b>Address</b><br/>{address}</p>
      <p><b>Phone</b><br/><a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a></p>
      <p><b>Email</b><br/><a href={`mailto:${email}`}>{email}</a></p>
      {profile?.businessHours && <p><b>Business hours</b><br/>{profile.businessHours}</p>}
      <p className="contact-social-links"><a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp the team ↗</a><a href={instagram} target="_blank" rel="noreferrer">Instagram ↗</a></p>
    </div>
    <p className="contact-note">Product details, configuration and warranty terms are confirmed for each enquiry. No online purchase or payment is processed on this website.</p>
  </div><Suspense fallback={<div className="empty-state">Loading inquiry form…</div>}><InquiryForm/></Suspense></div></main>
}
