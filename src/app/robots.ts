import { getSiteUrl } from '@/service/server_api'
import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth/',
        '/cart',
        '/order/',
        '/payment',
        '/profile/',
        '/seller/',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
