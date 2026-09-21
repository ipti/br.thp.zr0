import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import StoreHero from './components/storefront/store_hero'
import StoreManifesto from './components/storefront/store_manifesto'
import FeaturedProduct from './components/storefront/featured_product'
import RelatedProducts from './components/storefront/related_products'
import StoreVideo from './components/storefront/store_video'
import ClosingSection from '@/components/closing_section/closing_section'
import { getProductByUid } from '@/app/product/service/server'
import { getProductsPage } from '@/app/middleware/producs_list'
import './components/storefront/storefront.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Vitrine | ZR0',
  description:
    'Design que transforma muito mais que resíduos. Conheça móveis e peças produzidos artesanalmente com plástico reciclado.',
}

const CATALOG_PARAMS = ['q', 'page', 'category', 'categoryId', 'sort'] as const
const STOREFRONT_ORDER = ['cadeira', 'mesa de centro', 'mesa rostarte', 'mesa alta']

function normalizeProductName(name: string) {
  return name.trim().toLocaleLowerCase('pt-BR')
}

async function resolveFeaturedProduct(
  products: Awaited<ReturnType<typeof getProductsPage>>['data']
) {
  const configuredUid = process.env.STORE_FEATURED_PRODUCT_UID

  if (configuredUid) {
    const product = await getProductByUid(configuredUid).catch(() => null)
    if (product) return product
    console.warn(`[storefront] STORE_FEATURED_PRODUCT_UID "${configuredUid}" não encontrou produto. Usando fallback.`)
  }

  const preferredProduct =
    products.find(
      (product) => normalizeProductName(product.name) === 'cadeira'
    ) ?? products[0]

  if (!preferredProduct) return null

  return getProductByUid(preferredProduct.uid).catch(() => null)
}

export default async function ProductPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>
}) {
  // Compatibilidade: links antigos /product?q=...&page=... → /product/all?q=...&page=...
  const params = await searchParams
  if (params) {
    const forward = new URLSearchParams()
    for (const key of CATALOG_PARAMS) {
      const val = params[key]
      if (val !== undefined && val !== '') forward.set(key, val)
    }
    if (forward.size > 0) {
      redirect(`/product/all?${forward.toString()}`)
    }
  }

  const catalogPage = await getProductsPage({ limit: 20 }).catch(() => null)
  const featured = await resolveFeaturedProduct(catalogPage?.data ?? [])

  const related = [...(catalogPage?.data ?? [])]
    .sort((left, right) => {
      const leftIndex = STOREFRONT_ORDER.indexOf(normalizeProductName(left.name))
      const rightIndex = STOREFRONT_ORDER.indexOf(normalizeProductName(right.name))
      const leftOrder = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex
      const rightOrder = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex
      return leftOrder - rightOrder
    })
    .slice(0, 4)

  return (
    <main>
      <StoreHero />
      <StoreManifesto />
      {featured && <FeaturedProduct product={featured} />}
      <RelatedProducts products={related} />
      <StoreVideo />
      <ClosingSection />
    </main>
  )
}
