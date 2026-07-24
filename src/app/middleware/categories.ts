import { fetchServerApi } from '@/service/server_api'
import type { Category } from '@/app/seller/product/type'

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetchServerApi('/category', {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return []
    const payload = await res.json()
    return Array.isArray(payload) ? payload : (payload.data ?? [])
  } catch {
    return []
  }
}
