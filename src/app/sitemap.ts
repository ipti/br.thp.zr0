import { getProductsPage } from '@/app/middleware/producs_list'
import { getSiteUrl } from '@/service/server_api'
import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const firstPage = await getProductsPage({ page: 1, limit: 100 })
  const remainingPages = await Promise.all(
    Array.from(
      { length: Math.max(0, firstPage.pagination.totalPages - 1) },
      (_, index) => getProductsPage({ page: index + 2, limit: 100 })
    )
  )
  const products = [
    ...firstPage.data,
    ...remainingPages.flatMap(page => page.data),
  ]

  return [
    {
      url: siteUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/product`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...products.map(product => ({
      url: `${siteUrl}/product/${encodeURIComponent(product.uid)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
