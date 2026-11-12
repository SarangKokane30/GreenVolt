import { ValidationError, type CollectionConfig, type Field, type Where } from 'payload'

const authenticatedAccess: NonNullable<CollectionConfig['access']> = {
  create: ({ req }) => Boolean(req.user),
  read: ({ req }) => Boolean(req.user),
  update: ({ req }) => Boolean(req.user),
  delete: ({ req }) => Boolean(req.user),
}

const publishStatus: Field[] = [{
  name: 'status', type: 'select', defaultValue: 'draft', index: true,
  options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }],
}]

const seoFields: Field[] = [{
  name: 'seo', type: 'group', fields: [
    { name: 'title', type: 'text', maxLength: 70 },
    { name: 'description', type: 'textarea', maxLength: 160 },
  ],
}]

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  admin: { useAsTitle: 'name' },
  access: { ...authenticatedAccess, read: ({ req }) => req.user ? true : { active: { equals: true } } },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'active', type: 'checkbox', defaultValue: false },
    ...seoFields,
  ],
}

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: { useAsTitle: 'name' },
  access: { ...authenticatedAccess, read: ({ req }) => req.user ? true : { status: { equals: 'published' } } },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'relatedCategories', type: 'relationship', relationTo: 'product-categories', hasMany: true },
    { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'order', type: 'number', defaultValue: 0 },
    ...seoFields,
    ...publishStatus,
  ],
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'category', 'productType', 'status', 'featured'] },
  access: { ...authenticatedAccess, read: ({ req }) => req.user ? true : ({ and: [{ status: { equals: 'published' } }, { productType: { equals: 'standard' } }] } as Where) },
  versions: { drafts: true },
  fields: [
    { name: 'productType', type: 'select', defaultValue: 'standard', options: [{ label: 'Standard product', value: 'standard' }, { label: 'Custom solution record', value: 'custom' }] },
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'code', type: 'text' },
    { name: 'category', type: 'relationship', relationTo: 'product-categories', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'application', type: 'textarea' },
    { name: 'chemistry', type: 'text' },
    { name: 'cellFormat', type: 'select', options: [{ label: 'Cylindrical', value: 'cylindrical' }, { label: 'Prismatic', value: 'prismatic' }] },
    { name: 'nominalVoltage', type: 'text' },
    { name: 'capacityAh', type: 'text' },
    { name: 'energyWh', type: 'text' },
    { name: 'dimensions', type: 'text' },
    { name: 'weight', type: 'text' },
    { name: 'bmsDetails', type: 'textarea' },
    { name: 'connectors', type: 'text' },
    { name: 'chargingDetails', type: 'textarea' },
    { name: 'operatingTemperature', type: 'text' },
    { name: 'warrantyTerms', type: 'textarea' },
    { name: 'availability', type: 'select', defaultValue: 'enquire', options: [{ label: 'Enquire for configuration', value: 'enquire' }, { label: 'Available', value: 'available' }, { label: 'Unavailable', value: 'unavailable' }] },
    { name: 'images', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }, { name: 'alt', type: 'text' }] },
    { name: 'specifications', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'value', type: 'text', required: true }] },
    { name: 'features', type: 'array', fields: [{ name: 'feature', type: 'text' }] },
    { name: 'applications', type: 'relationship', relationTo: 'applications', hasMany: true },
    { name: 'certifications', type: 'relationship', relationTo: 'certifications', hasMany: true },
    { name: 'datasheet', type: 'upload', relationTo: 'media' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    ...seoFields,
    ...publishStatus,
  ],
}

export const Services: CollectionConfig = {
  slug: 'services', admin: { useAsTitle: 'name' },
  access: { ...authenticatedAccess, read: ({ req }) => req.user ? true : { status: { equals: 'published' } } },
  fields: [{ name: 'name', type: 'text', required: true }, { name: 'slug', type: 'text', required: true, unique: true }, { name: 'description', type: 'textarea' }, { name: 'image', type: 'upload', relationTo: 'media' }, { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true }, ...seoFields, ...publishStatus],
}

export const Capabilities: CollectionConfig = {
  slug: 'capabilities', admin: { useAsTitle: 'name' },
  access: { ...authenticatedAccess, read: ({ req }) => req.user ? true : { status: { equals: 'published' } } },
  fields: [{ name: 'name', type: 'text', required: true }, { name: 'description', type: 'textarea' }, { name: 'evidence', type: 'upload', relationTo: 'media' }, { name: 'order', type: 'number', defaultValue: 0 }, ...seoFields, ...publishStatus],
}

export const Certifications: CollectionConfig = {
  slug: 'certifications', admin: { useAsTitle: 'name' },
  access: {
    ...authenticatedAccess,
    read: ({ req }) => req.user ? true : ({ and: [
      { status: { equals: 'published' } },
      { verifiedForPublic: { equals: true } },
      { publicVisibility: { equals: true } },
      { or: [{ expiryDate: { greater_than_equal: new Date().toISOString().slice(0, 10) } }, { expiryDate: { exists: false } }] },
    ] } as Where),
  },
  hooks: {
    beforeChange: [({ data, originalDoc, req }) => {
      const value = <T,>(key: string) => data[key] ?? originalDoc?.[key] as T | undefined
      if (value<boolean>('verifiedForPublic') && value<boolean>('publicVisibility') && value<string>('status') === 'published') {
        const missing = !value<string>('authority') || !value<string>('number') || !value<string>('scope') || !value<string>('issueDate') || !value<number | string>('document')
        const expired = Boolean(value<string>('expiryDate') && value<string>('expiryDate')! < new Date().toISOString().slice(0, 10))
        if (missing || expired) throw new ValidationError({ req, collection: 'certifications', errors: [{ path: 'verifiedForPublic', message: 'To publish a certificate, add its document, issuer, number, scope and issue date, then verify it is current.' }] })
      }
      return data
    }],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'type', type: 'select', required: true, options: [{ label: 'Company', value: 'company' }, { label: 'Product', value: 'product' }] },
    { name: 'authority', type: 'text' },
    { name: 'number', type: 'text' },
    { name: 'scope', type: 'textarea' },
    { name: 'issueDate', type: 'date' },
    { name: 'expiryDate', type: 'date' },
    { name: 'document', type: 'upload', relationTo: 'media' },
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'verifiedForPublic', type: 'checkbox', defaultValue: false, admin: { description: 'Enable only after the certificate, scope, issuer and current validity have been checked.' } },
    { name: 'publicVisibility', type: 'checkbox', defaultValue: false },
    ...publishStatus,
  ],
}

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'type', 'application', 'status', 'createdAt'] },
  access: { ...authenticatedAccess, create: () => false },
  fields: [
    { name: 'customerType', type: 'select', defaultValue: 'individual', options: [{ label: 'Individual', value: 'individual' }, { label: 'Business or industry', value: 'business' }, { label: 'EV manufacturer or OEM', value: 'oem' }, { label: 'Dealer or distributor', value: 'dealer-distributor' }] },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'city', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'type', type: 'select', required: true, options: [{ label: 'Product enquiry', value: 'product-inquiry' }, { label: 'Quote', value: 'quote' }, { label: 'Custom solution', value: 'custom-solution' }, { label: 'Technical support', value: 'technical-support' }, { label: 'General', value: 'general' }], index: true },
    { name: 'category', type: 'text' },
    { name: 'product', type: 'relationship', relationTo: 'products' },
    { name: 'application', type: 'text' },
    { name: 'vehicleOrEquipment', type: 'text' },
    { name: 'voltage', type: 'text' },
    { name: 'capacity', type: 'text' },
    { name: 'dimensions', type: 'text' },
    { name: 'quantity', type: 'number' },
    { name: 'additionalRequirements', type: 'textarea' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'attachments', type: 'upload', relationTo: 'media', hasMany: true, admin: { description: 'Only attach files approved for public access. Private enquiry attachments are not enabled until private object storage is configured.' } },
    { name: 'privateAttachments', type: 'upload', relationTo: 'inquiry-attachments', hasMany: true, admin: { description: 'Private files are accessible only to authenticated administrators.' } },
    { name: 'status', type: 'select', defaultValue: 'new', options: [{ label: 'New', value: 'new' }, { label: 'Contacted', value: 'contacted' }, { label: 'In Progress', value: 'in-progress' }, { label: 'Quoted', value: 'quoted' }, { label: 'Won', value: 'won' }, { label: 'Lost', value: 'lost' }, { label: 'Closed', value: 'closed' }], index: true },
    { name: 'adminNotes', type: 'textarea', access: { read: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user) } },
    { name: 'followUpDate', type: 'date' },
  ],
}

export const InquiryAttachments: CollectionConfig = {
  slug: 'inquiry-attachments',
  admin: { useAsTitle: 'filename', defaultColumns: ['filename', 'mimeType', 'filesize', 'createdAt'] },
  upload: { staticDir: 'private-inquiry-attachments', mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'], filesRequiredOnCreate: true },
  access: authenticatedAccess,
  fields: [
    { name: 'sourceRights', type: 'text', admin: { description: 'Record the source or ownership of the file.' } },
  ],
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials', admin: { useAsTitle: 'attribution', defaultColumns: ['attribution', 'organization', 'status'] },
  access: { ...authenticatedAccess, read: ({ req }) => req.user ? true : { status: { equals: 'published' } } },
  fields: [{ name: 'quote', type: 'textarea', required: true }, { name: 'attribution', type: 'text', required: true }, { name: 'role', type: 'text' }, { name: 'organization', type: 'text' }, ...publishStatus],
}

export const Projects: CollectionConfig = {
  slug: 'projects', admin: { useAsTitle: 'title', defaultColumns: ['title', 'application', 'status'] },
  access: { ...authenticatedAccess, read: ({ req }) => req.user ? true : { status: { equals: 'published' } } },
  fields: [{ name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', required: true, unique: true }, { name: 'application', type: 'text' }, { name: 'summary', type: 'textarea' }, { name: 'image', type: 'upload', relationTo: 'media' }, { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true }, ...seoFields, ...publishStatus],
}

export const Media: CollectionConfig = {
  slug: 'media',
  upload: { staticDir: 'media', mimeTypes: ['image/*', 'application/pdf'] },
  access: { ...authenticatedAccess, read: ({ req }) => req.user ? true : { visibility: { equals: 'public' } } },
  fields: [
    { name: 'alt', type: 'text' },
    { name: 'sourceRights', type: 'text', required: true, admin: { description: 'Record source or usage rights before publishing this media.' } },
    { name: 'visibility', type: 'select', defaultValue: 'private', options: [{ label: 'Public', value: 'public' }, { label: 'Private', value: 'private' }] },
  ],
}
