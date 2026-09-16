import Link from 'next/link'
import type { ProductType } from '@/app/seller/product/type'
import './product_card.css'

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

type ProductCardProps = {
  product: ProductType
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.product_image?.[0]?.img_url
  const outOfStock = typeof product.quantity === 'number' && product.quantity <= 0

  return (
    <Link href={`/product/${product.uid}`} className="about-product-card">
      <span className="about-product-card__media">
        {imageUrl ? (
          <img className="about-product-card__image" src={imageUrl} alt={product.name} />
        ) : (
          <span className="about-product-card__image-placeholder" aria-hidden="true" />
        )}
        {outOfStock && <span className="about-product-card__badge">Indisponível</span>}
      </span>

      <span className="about-product-card__row">
        <span className="about-product-card__name">{product.name}</span>
        <span className="about-product-card__price">{priceFormatter.format(product.price)}</span>
      </span>
    </Link>
  )
}
