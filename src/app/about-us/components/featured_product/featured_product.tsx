'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { ProductList } from '@/app/seller/product/type'
import { ZButton } from '@/components/button/button'
import { useToast } from '@/components/toast/hook/useToast'
import { useCartStore } from '@/service/store/cart_store'
import ProductSelector from '../product_selector/product_selector'
import './featured_product.css'

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

type FeaturedProductProps = {
  products: ProductList
}

export default function FeaturedProduct({ products }: FeaturedProductProps) {
  const [selectedUid, setSelectedUid] = useState(products[0]?.uid)
  const cart = useCartStore(state => state.cart)
  const addItem = useCartStore(state => state.addItem)
  const { showToast } = useToast()

  useEffect(() => {
    if (!products.some(product => product.uid === selectedUid)) {
      setSelectedUid(products[0]?.uid)
    }
  }, [products, selectedUid])

  if (products.length === 0) return null

  const selectedProduct = products.find(product => product.uid === selectedUid) ?? products[0]
  const imageUrl = selectedProduct.product_image?.[0]?.img_url
  const quantityInCart = cart.find(item => item.id === selectedProduct.uid)?.quantity ?? 0
  const hasStockInfo = typeof selectedProduct.quantity === 'number'
  const canAddToCart = hasStockInfo && (selectedProduct.quantity as number) - quantityInCart > 0

  const handleAddToCart = () => {
    if (!canAddToCart) return

    addItem({
      id: selectedProduct.uid,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: 1,
      image: imageUrl ?? '',
    })
    showToast('Adicionado ao carrinho!', 'success', 1000)
  }

  return (
    <section className="featured-product" aria-labelledby="featured-product-title">
      <div className="about-us__content">
        <div className="featured-product__panel">
          <div className="featured-product__media">
            {imageUrl ? (
              <img
                className="featured-product__image"
                src={imageUrl}
                alt={selectedProduct.name}
              />
            ) : (
              <span className="featured-product__image-placeholder" aria-hidden="true" />
            )}
          </div>

          <div className="featured-product__info">
            <div className="featured-product__heading">
              <h2 id="featured-product-title" className="featured-product__name">
                {selectedProduct.name}
              </h2>
              <p className="featured-product__price">
                {priceFormatter.format(selectedProduct.price)}
              </p>
            </div>

            <p className="featured-product__description">{selectedProduct.description}</p>

            <div className="featured-product__actions">
              <Link
                href={`/product/${selectedProduct.uid}`}
                className="featured-product__details"
              >
                Mais detalhes
              </Link>
              <ZButton
                type="button"
                label="Adicionar ao carrinho"
                icon="pi pi-shopping-cart"
                className="featured-product__add"
                disabled={!canAddToCart}
                onClick={handleAddToCart}
              />
            </div>

            {!canAddToCart && (
              <p className="featured-product__stock-note" role="status">
                {hasStockInfo
                  ? 'Estoque insuficiente para adicionar mais unidades deste produto.'
                  : 'Estoque não informado; consulte os detalhes do produto antes de comprar.'}
              </p>
            )}
          </div>
        </div>

        <ProductSelector
          products={products}
          selectedUid={selectedProduct.uid}
          onSelect={setSelectedUid}
        />
      </div>
    </section>
  )
}
