import { getProductByUid } from '@/app/product/service/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductOneComponent from './components/product_one'

export const dynamic = 'force-dynamic'

type ProductPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductByUid(id)

  if (!product) {
    return {
      title: 'Produto não encontrado | ZR0',
      robots: { index: false, follow: false },
    }
  }

  const image = product.product_image[0]?.img_url

  return {
    title: `${product.name} | ZR0`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      images: image ? [{ url: image, alt: product.name }] : [],
    },
  }
}

export default async function ProductOnePage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductByUid(id)

  if (!product) notFound()

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.product_image.map(image => image.img_url),
    sku: product.uid,
    aggregateRating:
      product.reviewCount && product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.averageRating,
            reviewCount: product.reviewCount,
          }
        : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: product.price,
      availability:
        product.quantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <ProductOneComponent product={product} />
    </div>
  )
}
