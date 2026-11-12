export function canonicalFor(path: string): string | undefined {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!configuredUrl) return undefined
  try {
    const base = new URL(configuredUrl)
    if (base.protocol !== 'https:' && process.env.NODE_ENV === 'production') return undefined
    return new URL(path, base).toString()
  } catch { return undefined }
}
