import { postgresAdapter } from '@payloadcms/db-postgres'
import { cloudinaryStorage } from 'payload-storage-cloudinary'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { Users } from './src/collections/Users'
import { Products, ProductCategories, Services, Applications, Certifications, Inquiries, Media, Capabilities, Testimonials, Projects, InquiryAttachments } from './src/collections/Content'
import { CompanyProfile, Homepage, SiteSettings, Navigation } from './src/globals/Site'

const cloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
const payloadSecret = process.env.PAYLOAD_SECRET
const databaseURL = process.env.DATABASE_URL

if (process.env.NODE_ENV === 'production' && !payloadSecret) throw new Error('PAYLOAD_SECRET must be configured in production.')
if (process.env.NODE_ENV === 'production' && !databaseURL) throw new Error('DATABASE_URL must be configured in production.')

export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: process.cwd() } },
  editor: lexicalEditor(), secret: payloadSecret || 'development-only-replace-this-secret-before-deploying',
  db: postgresAdapter({ pool: { connectionString: databaseURL || 'postgres://localhost/greenvolt' } }),
  collections: [Users, Products, ProductCategories, Services, Applications, Certifications, Inquiries, Media, Capabilities, Testimonials, Projects, InquiryAttachments],
  globals: [CompanyProfile, Homepage, SiteSettings, Navigation],
  ...(cloudinary ? { plugins: [cloudinaryStorage({ cloudConfig: { cloud_name: process.env.CLOUDINARY_CLOUD_NAME!, api_key: process.env.CLOUDINARY_API_KEY!, api_secret: process.env.CLOUDINARY_API_SECRET! }, collections: { media: {} } })] } : {}),
  typescript: { outputFile: './src/payload-types.ts' },
})
