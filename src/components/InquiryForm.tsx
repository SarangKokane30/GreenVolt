'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, type FormEvent } from 'react'

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void }
  }
}

const inquiryTypes = ['product-inquiry', 'quote', 'custom-solution', 'technical-support', 'general']

export function InquiryForm() {
  const params = useSearchParams()
  const requestedType = params.get('type') || 'quote'
  const initialType = inquiryTypes.includes(requestedType) ? requestedType : 'quote'
  const [state, setState] = useState('')
  const [busy, setBusy] = useState(false)
  const [token, setToken] = useState('')
  const captchaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    if (!siteKey || !captchaRef.current) return
    let widgetId: string | undefined
    const render = () => {
      if (window.turnstile && captchaRef.current && !widgetId) {
        widgetId = window.turnstile.render(captchaRef.current, {
          sitekey: siteKey,
          callback: (value: string) => setToken(value),
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        })
      }
    }
    if (window.turnstile) render()
    else {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.onload = render
      document.head.append(script)
    }
    return () => { if (widgetId) window.turnstile?.remove(widgetId) }
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setBusy(true)
    setState('')
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken: token }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'The inquiry could not be sent.')
      form.reset()
      setToken('')
      setState('Your inquiry has been received. Thank you.')
    } catch (error) {
      setState(error instanceof Error ? error.message : 'The inquiry could not be sent. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <form className="contact-form" onSubmit={submit}>
    <h2>Request a quote</h2>
    <p className="form-intro">Share the requirements you know. Product configuration and specifications are confirmed for each enquiry.</p>
    <div className="form-grid">
      <label>Customer type *<select name="customerType" defaultValue="individual"><option value="individual">Individual</option><option value="business">Business or industry</option><option value="oem">EV manufacturer or OEM</option><option value="dealer-distributor">Dealer or distributor</option></select></label>
      <label>Enquiry type *<select name="type" defaultValue={initialType}><option value="product-inquiry">Product enquiry</option><option value="quote">Request a quote</option><option value="custom-solution">Custom battery solution</option><option value="technical-support">Technical support</option><option value="general">General enquiry</option></select></label>
      <label>Full name *<input name="name" required minLength={2} maxLength={120} autoComplete="name"/></label>
      <label>Company name<input name="company" maxLength={160} autoComplete="organization"/></label>
      <label>Email *<input name="email" type="email" required maxLength={254} autoComplete="email"/></label>
      <label>Phone *<input name="phone" type="tel" required pattern="\+?[\d\s().-]{7,24}" autoComplete="tel"/></label>
      <label>Application<input name="application" maxLength={240} defaultValue={params.get('application') || ''}/></label>
      <label>Vehicle or equipment<input name="vehicleOrEquipment" maxLength={240}/></label>
      <label>Required voltage<input name="voltage" maxLength={80}/></label>
      <label>Required capacity<input name="capacity" maxLength={80}/></label>
      <label>Dimensions or available space<input name="dimensions" maxLength={160}/></label>
      <label>Expected quantity<input name="quantity" type="number" min="1" step="1" max="1000000"/></label>
      <label className="full">BMS, connectors, wiring or other requirements<textarea name="additionalRequirements" maxLength={5000} rows={3}/></label>
      <label className="full">Message *<textarea name="message" required minLength={10} maxLength={5000} rows={4}/></label>
      <label className="honeypot" aria-hidden="true">Leave this field blank<input name="website" tabIndex={-1} autoComplete="off"/></label>
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && <div className="full" ref={captchaRef} />}
      <div className="full"><button className="button primary" disabled={busy}>{busy ? 'Sending enquiry…' : 'Send enquiry ↗'}</button>{state && <p role="status" aria-live="polite">{state}</p>}<p className="quiet">A confirmation is shown only after the enquiry has been stored. File attachments are unavailable until private storage is configured.</p></div>
    </div>
  </form>
}
