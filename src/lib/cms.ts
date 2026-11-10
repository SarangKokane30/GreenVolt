import config from '@payload-config'
import { getPayload } from 'payload'

export async function getCMS() {
  if (!process.env.DATABASE_URL) return null
  try { return await getPayload({ config }) } catch { return null }
}
