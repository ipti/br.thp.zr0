import { getProductByUid } from '@/app/product/service/server'
import type { Metadata } from 'next'
import ProductionOrderSteps from './components/components'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Comprar sob encomenda | ZR0',
}

type ProductionOrderPageProps = {
  searchParams: Promise<{ productId?: string }>
}

export default async function ProductionOrderPage({
  searchParams,
}: ProductionOrderPageProps) {
  const { productId } = await searchParams
  const product = productId ? await getProductByUid(productId) : null

  return <ProductionOrderSteps product={product} />
}
