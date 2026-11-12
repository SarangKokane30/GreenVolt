import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Website Terms', robots: { index: false, follow: false } }
export default function TermsPage() {
  return <main className="section"><div className="wrap legal-content">
    <p className="eyebrow">Website terms</p>
    <h1>Product information and enquiries</h1>
    <p>This website provides company information and a way to enquire about battery pack requirements. It does not offer online ordering or payment.</p>
    <p>Battery configuration, specifications, availability, warranty and commercial terms depend on the product and customer requirements. Confirm those details in writing with Green Volt Energy Solution before placing an order.</p>
  </div></main>
}
