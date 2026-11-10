import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCMS } from '@/lib/cms'
import { inquirySchema } from '@/lib/inquiry-schema'

const windowMs = 10 * 60 * 1000
const attempts = new Map<string, { count: number; start: number }>()

export async function POST(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const current = attempts.get(forwarded)
  if (current && now - current.start < windowMs && current.count >= 5) return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })
  if (!current || now - current.start >= windowMs) attempts.set(forwarded, { count: 1, start: now })
  else attempts.set(forwarded, { ...current, count: current.count + 1 })

  try {
    const payloadBody = await request.json()
    const parsed = inquirySchema.parse(payloadBody)
    if (parsed.website) return NextResponse.json({ ok: true })
    if (process.env.NODE_ENV === 'production' && !process.env.TURNSTILE_SECRET_KEY) return NextResponse.json({ error: 'Inquiry service is not configured yet.' }, { status: 503 })
    if (process.env.NODE_ENV === 'production' && (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || !process.env.RESEND_API_KEY || !process.env.INQUIRY_TO_EMAIL || !process.env.EMAIL_FROM)) return NextResponse.json({ error: 'Inquiry service is not configured yet.' }, { status: 503 })
    if (process.env.TURNSTILE_SECRET_KEY) {
      const token = typeof payloadBody.turnstileToken === 'string' ? payloadBody.turnstileToken : ''
      if (!token) return NextResponse.json({ error: 'Please complete the spam check.' }, { status: 400 })
      const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token, remoteip: forwarded }) })
      if (!verification.ok || !(await verification.json()).success) return NextResponse.json({ error: 'Spam check could not be verified.' }, { status: 400 })
    }
    const cms = await getCMS()
    if (!cms) return NextResponse.json({ error: 'Inquiry service is temporarily unavailable.' }, { status: 503 })
    const inquiry = inquirySchema.omit({ website: true }).parse(parsed)
    const saved = await cms.create({ collection: 'inquiries', overrideAccess: true, data: { ...inquiry, status: 'new' } })
    if (process.env.RESEND_API_KEY && process.env.INQUIRY_TO_EMAIL && process.env.EMAIL_FROM) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      const delivered = await resend.emails.send({ from: process.env.EMAIL_FROM, to: process.env.INQUIRY_TO_EMAIL, subject: `New GreenVolt inquiry: ${inquiry.type}`, text: `Name: ${inquiry.name}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone}\nCompany: ${inquiry.company}\nCategory: ${inquiry.category}\nApplication: ${inquiry.application}\n\n${inquiry.message}` })
      if (delivered.error) return NextResponse.json({ error: 'Your inquiry was saved, but notification email failed. Please contact the company directly.' }, { status: 502 })
      await resend.emails.send({ from: process.env.EMAIL_FROM, to: inquiry.email, subject: 'We received your GreenVolt inquiry', text: `Hello ${inquiry.name},\n\nWe received your inquiry and will follow up using the contact details you provided.\n\nGreenVolt Energy Solutions` })
    } else if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Inquiry email service is not configured yet.' }, { status: 503 })
    }
    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Please check the required fields and try again.', fields: error.flatten().fieldErrors }, { status: 400 })
    return NextResponse.json({ error: 'Inquiry service is temporarily unavailable.' }, { status: 503 })
  }
}
