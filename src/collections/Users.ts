import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users', auth: true,
  admin: { useAsTitle: 'email' },
  access: { create: async ({ req }) => Boolean(req.user) || (await req.payload.count({ collection: 'users' })).totalDocs === 0, read: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  fields: [{ name: 'role', type: 'select', defaultValue: 'admin', options: [{ label: 'Administrator', value: 'admin' }] }],
}
