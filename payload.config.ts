import { postgresAdapter } from '@payloadcms/db-postgres'
import { cloudinaryStorage } from 'payload-storage-cloudinary'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { Users } from './src/collections/Users'
import { Products, ProductCategories, Services, Applications, Certifications, Inquiries, Media, Capabilities, Testimonials, Projects } from './src/collections/Content'
import { CompanyProfile, Homepage, SiteSettings, Navigation } from './src/globals/Site'

const cloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET

export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: process.cwd() } },
  editor: lexicalEditor(), secret: process.env.PAYLOAD_SECRET || 'development-only-replace-this-secret-before-deploying',
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || 'postgres://localhost/greenvolt' } }),
  collections: [Users, Products, ProductCategories, Services, Applications, Certifications, Inquiries, Media, Capabilities, Testimonials, Projects],
  globals: [CompanyProfile, Homepage, SiteSettings, Navigation],
  ...(cloudinary ? { plugins: [cloudinaryStorage({ cloudConfig: { cloud_name: process.env.CLOUDINARY_CLOUD_NAME!, api_key: process.env.CLOUDINARY_API_KEY!, api_secret: process.env.CLOUDINARY_API_SECRET! }, collections: { media: {} } })] } : {}),
  typescript: { outputFile: './src/payload-types.ts' },
})
