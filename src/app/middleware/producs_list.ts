import { apiUrl } from '@/service/url_api'
import { ProductList } from '../seller/product/type'

export async function getProducts(): Promise<ProductList> {
  const res = await fetch(`${apiUrl}/product`, {
    cache: 'no-store' // força a rodar em runtime, não no build
  })
  return res.json()
}
