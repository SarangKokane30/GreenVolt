import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Privacy Information', robots: { index: false, follow: false } }
export default function PrivacyPage() {
  return <main className="section"><div className="wrap legal-content">
    <p className="eyebrow">Privacy information</p>
    <h1>Information submitted through this website</h1>
    <p>When you send an enquiry, Green Volt Energy Solution receives the contact and application details you provide so the team can respond. Enquiry records are stored in the website database. If the email service is configured, the company is notified and a receipt may be sent to the email address you provide.</p>
    <p>The enquiry form does not process payments or create a user account. Do not include sensitive personal information in the message. For questions about an enquiry you have submitted, contact <a href="mailto:siddhantbodke310@gmail.com">siddhantbodke310@gmail.com</a>.</p>
  </div></main>
}
