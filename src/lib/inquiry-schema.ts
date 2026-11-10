import { z } from 'zod'

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  phone: z.string().trim().regex(/^\+?[\d\s().-]{7,24}$/),
  company: z.string().trim().max(160).optional().default(''),
  city: z.string().trim().max(120).optional().default(''),
  country: z.string().trim().max(120).optional().default(''),
  type: z.enum(['product-inquiry', 'quote', 'custom-solution', 'technical-support', 'general']),
  category: z.string().trim().max(120).optional().default(''),
  application: z.string().trim().max(240).optional().default(''),
  voltage: z.string().trim().max(80).optional().default(''),
  capacity: z.string().trim().max(80).optional().default(''),
  quantity: z.coerce.number().int().positive().max(1000000).optional(),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(),
})
