const DEFAULT_BACKEND_URL = 'https://elitespacenepal.premiumasp.net'

export const getBackendBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_BACKEND_URL

  try {
    const url = new URL(configuredUrl)
    url.pathname = url.pathname.replace(/\/swagger\/index\.html\/?$/i, '')
    url.search = ''
    url.hash = ''
    return url.toString().replace(/\/+$/, '')
  } catch {
    return configuredUrl
      .replace(/\/swagger\/index\.html\/?$/i, '')
      .replace(/\/+$/, '')
  }
}

export const buildBackendAssetUrl = (value?: string | File | null): string | null => {
  if (!value || value === '-' || value === 'string') return null
  if (value instanceof File) return null

  const raw = String(value).trim()
  if (!raw) return null

  const base = getBackendBaseUrl()

  try {
    if (/^https?:\/\//i.test(raw)) {
      const parsed = new URL(raw)
      const pathname = parsed.pathname.replace(/^\/+/, '')
      const normalized = pathname.replace(/^khaneypani\/?/i, '')
      if (!normalized) return null
      return `${base}/khaneypani/${normalized}`
    }
  } catch {
    // fall through to relative handling below
  }

  const withoutLeadingSlash = raw.replace(/^\/+/, '')
  const normalized = withoutLeadingSlash.replace(/^khaneypani\/?/i, '')

  if (!normalized) return null

  return `${base}/khaneypani/${normalized}`
}
