export const companyDefaults = {
  name: 'Green Volt Energy Solution',
  overview: 'Green Volt Energy Solution designs and manufactures LiFePO4 battery packs for electric mobility, energy storage and industrial applications.',
  address: 'L-Block, MIDC, Ahilyanagar, Maharashtra, India',
  phone: '9075599119',
  email: 'siddhantbodke310@gmail.com',
  instagram: 'https://www.instagram.com/greenvoltenergysolutions_/',
  whatsapp: 'https://wa.me/919075591199',
}

export function publicCompanyName(value?: string | null) {
  const trimmed = value?.trim()
  return !trimmed || trimmed === 'GreenVolt Energy Solutions' ? companyDefaults.name : trimmed
}

export function safeHttpsUrl(value: unknown, fallback: string) {
  if (typeof value !== 'string') return fallback
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.toString() : fallback
  } catch { return fallback }
}
