import { ProductList } from '../seller/product/type'
import { fetchServerApi } from '@/service/server_api'

export type ProductsPage = {
  data: ProductList
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const EMPTY_PAGE: ProductsPage = {
  data: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
}

export async function getProductsPage({
  q,
  page = 1,
  limit = 20,
}: {
  q?: string
  page?: number
  limit?: number
} = {}): Promise<ProductsPage> {
  const search = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (q) search.set('q', q)

  try {
    const res = await fetchServerApi(`/product?${search.toString()}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return EMPTY_PAGE
    const payload = await res.json()

    if (Array.isArray(payload)) {
      return {
        data: payload,
        pagination: {
          page,
          limit,
          total: payload.length,
          totalPages: payload.length ? 1 : 0,
        },
      }
    }

    return {
      data: payload.data ?? [],
      pagination: payload.pagination ?? EMPTY_PAGE.pagination,
    }
  } catch {
    return EMPTY_PAGE
  }
}

export async function getProducts(q?: string): Promise<ProductList> {
  const products = await getProductsPage({ q, limit: 8 })
  return products.data
}
