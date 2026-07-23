/**
 * Browser requests always use the Next.js same-origin proxy.
 *
 * The proxy resolves API_INTERNAL_URL at runtime and forwards the request to
 * NestJS. This avoids exposing Docker hostnames and removes CORS differences
 * between local, staging and production environments.
 */
export const apiUrl = '/api'
