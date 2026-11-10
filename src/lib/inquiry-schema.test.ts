import { describe, expect, it } from 'vitest'
import { inquirySchema } from './inquiry-schema'

const valid = {
  name: 'Asha Rao', email: 'asha@example.com', phone: '+91 98765 43210',
  type: 'quote', message: 'Please share information about a battery pack for our application.',
}

describe('inquirySchema', () => {
  it('accepts a valid quote inquiry and trims text', () => {
    const result = inquirySchema.parse({ ...valid, name: ' Asha Rao ' })
    expect(result.name).toBe('Asha Rao')
    expect(result.type).toBe('quote')
  })

  it('rejects malformed email, phone, and short message', () => {
    expect(inquirySchema.safeParse({ ...valid, email: 'wrong', phone: '123', message: 'Help' }).success).toBe(false)
  })

  it('rejects unknown inquiry types', () => {
    expect(inquirySchema.safeParse({ ...valid, type: 'sales' }).success).toBe(false)
  })
})
