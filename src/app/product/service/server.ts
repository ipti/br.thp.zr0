import 'server-only'

import { fetchServerApi } from '@/service/server_api'
import { cache } from 'react'
import { ProductOne } from '@/app/seller/product/one/service/type'

export const getProductByUid = cache(
  async (uid: string): Promise<ProductOne | null> => {
    const response = await fetchServerApi(
      `/product-bff/uid/${encodeURIComponent(uid)}`,
      {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      }
    )

    if (response.status === 400 || response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(`Nest API returned ${response.status} for product ${uid}`)
    }

    return response.json()
  }
)
