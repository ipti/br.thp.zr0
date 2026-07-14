import { apiUrl } from '@/service/url_api'
import { ProductList } from '../seller/product/type'

export async function getProducts(q?: string): Promise<ProductList> {
  const search = q ? `?q=${encodeURIComponent(q)}` : ''
  try {
    const res = await fetch(`${apiUrl}/product${search}`, {
      cache: 'no-store', // força a rodar em runtime, não no build
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return []
    const payload = await res.json()
    return payload.data ?? []
  } catch {
    return []
  }
}
