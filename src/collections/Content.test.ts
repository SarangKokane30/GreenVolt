import { describe, expect, it } from 'vitest'
import { Certifications, InquiryAttachments, Inquiries, Media, Products } from './Content'

async function readAccess(collection: typeof Products, user: boolean) {
  const access = collection.access?.read
  if (typeof access !== 'function') return access
  return access({ req: { user: user ? { id: 'admin' } : null } } as never)
}

describe('CMS public access rules', () => {
  it('only exposes published standard products to visitors', async () => {
    expect(await readAccess(Products, false)).toMatchObject({ and: [{ status: { equals: 'published' } }, { productType: { equals: 'standard' } }] })
    expect(await readAccess(Products, true)).toBe(true)
  })

  it('requires verification and public visibility for certificates', async () => {
    const access = await readAccess(Certifications as typeof Products, false) as { and: Array<Record<string, unknown>> }
    expect(access.and).toContainEqual({ verifiedForPublic: { equals: true } })
    expect(access.and).toContainEqual({ publicVisibility: { equals: true } })
    expect(await readAccess(Certifications as typeof Products, true)).toBe(true)
  })

  it('keeps enquiries and private files behind admin authentication', async () => {
    expect(await readAccess(Inquiries as typeof Products, false)).toBe(false)
    expect(await readAccess(InquiryAttachments as typeof Products, false)).toBe(false)
    expect(await readAccess(Inquiries as typeof Products, true)).toBe(true)
    expect(await readAccess(InquiryAttachments as typeof Products, true)).toBe(true)
    expect(Inquiries.access?.create).toBeTypeOf('function')
    expect(await (Inquiries.access?.create as (args: never) => unknown)({} as never)).toBe(false)
  })

  it('only exposes media explicitly marked public', async () => {
    expect(await readAccess(Media as typeof Products, false)).toEqual({ visibility: { equals: 'public' } })
  })
})
