import 'server-only'

const DEFAULT_API_URL = 'https://zro-api.azurewebsites.net'
const DEFAULT_SITE_URL = 'http://localhost:3000'

function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/, '')
}

/**
 * URL used only by the Next.js server.
 *
 * In Docker, API_INTERNAL_URL should point to the Nest service name
 * (for example, http://api:3000). It is intentionally not NEXT_PUBLIC so the
 * browser never receives an internal hostname.
 */
export function getServerApiUrl() {
  return trimTrailingSlashes(
    process.env.API_INTERNAL_URL ||
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      DEFAULT_API_URL
  )
}

export function getSiteUrl() {
  return trimTrailingSlashes(process.env.SITE_URL || DEFAULT_SITE_URL)
}

export function fetchServerApi(path: string, init?: RequestInit) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return fetch(`${getServerApiUrl()}${normalizedPath}`, init)
}
