import { apiUrl } from '@/service/url_api'
import { ProductList } from '../seller/product/type'

export async function getProducts(q?: string): Promise<ProductList> {
  const search = q ? `?q=${encodeURIComponent(q)}` : ''
  const res = await fetch(`${apiUrl}/product${search}`, {
    cache: 'no-store' // força a rodar em runtime, não no build
  })
  const payload = await res.json()
  return payload.data ?? []
}
