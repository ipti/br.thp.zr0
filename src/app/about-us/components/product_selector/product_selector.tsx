import type { ProductList } from '@/app/seller/product/type'
import './product_selector.css'

type ProductSelectorProps = {
  products: ProductList
  selectedUid: string
  onSelect: (uid: string) => void
}

export default function ProductSelector({ products, selectedUid, onSelect }: ProductSelectorProps) {
  return (
    <ul className="product-selector" aria-label="Selecionar produto em destaque">
      {products.map(product => {
        const imageUrl = product.product_image?.[0]?.img_url
        const isActive = product.uid === selectedUid

        return (
          <li key={product.uid} className="product-selector__item">
            <button
              type="button"
              className={`product-selector__thumb${isActive ? ' product-selector__thumb--active' : ''}`}
              aria-pressed={isActive}
              aria-label={product.name}
              onClick={() => onSelect(product.uid)}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="" aria-hidden="true" className="product-selector__image" />
              ) : (
                <span className="product-selector__image-placeholder" aria-hidden="true" />
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
