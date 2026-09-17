'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ZButton } from '@/components/button/button'
import { useCartStore } from '@/service/store/cart_store'
import { useToast } from '@/components/toast/hook/useToast'
import type { ProductOne } from '@/app/seller/product/one/service/type'
import './featured_product.css'

interface FeaturedProductProps {
  product: ProductOne
}

function sortImages(images: ProductOne['product_image']) {
  return [...images].sort((a, b) => {
    if (a.order == null && b.order == null) return 0
    if (a.order == null) return 1
    if (b.order == null) return -1
    return Number(a.order) - Number(b.order)
  })
}

export default function FeaturedProduct({ product }: FeaturedProductProps) {
  const images = sortImages(product.product_image).slice(0, 4)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex] ?? null

  const { showToast } = useToast()
  const cart = useCartStore((s) => s.cart)
  const addItem = useCartStore((s) => s.addItem)

  const cartQty = cart.find((i) => i.id === product.uid)?.quantity ?? 0
  const remaining = (product.quantity ?? 0) - cartQty
  const outOfStock = (product.quantity ?? 0) === 0
  const canAdd = !outOfStock && remaining > 0

  function handleAddToCart() {
    addItem({
      id: product.uid,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: images[0]?.img_url ?? '',
    })
    showToast('Adicionado ao carrinho!', 'success', 1000)
  }

  return (
    <section className="featured-product" aria-labelledby="featured-product-name">
      <div className="featured-product__inner">
        <div className="featured-product__gallery">
          <div className="featured-product__main-image">
            {activeImage ? (
              <Image
                src={activeImage.img_url}
                alt={product.name}
                fill
                sizes="(max-width: 900px) 100vw, 38vw"
                className="featured-product__main-img"
                priority
              />
            ) : (
              <div className="featured-product__placeholder" role="img" aria-label={`Imagem indisponível para ${product.name}`}>
                <span aria-hidden="true">📦</span>
                <span>Imagem não disponível</span>
              </div>
            )}
          </div>
        </div>

        <div className="featured-product__info">
          <div className="featured-product__header">
            <h2 id="featured-product-name" className="featured-product__name">
              {product.name}
            </h2>
            <p className="featured-product__price">
              R$&nbsp;{product.price.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </p>
          </div>

          <p className="featured-product__description">{product.description}</p>

          {outOfStock && (
            <p className="featured-product__stock-warning" role="status">
              Produto fora de estoque
            </p>
          )}

          <div className="featured-product__actions">
            <Link href={`/product/${product.uid}`} className="featured-product__btn-details">
              Mais detalhes
            </Link>

            <ZButton
              className="featured-product__btn-cart"
              icon="pi pi-shopping-cart"
              onClick={handleAddToCart}
              disabled={!canAdd}
              aria-disabled={!canAdd}
            >
              {outOfStock ? 'Indisponível' : 'Adicionar ao carrinho'}
            </ZButton>
          </div>
        </div>

        {images.length > 1 && (
          <div className="featured-product__thumbs" role="group" aria-label="Galeria de imagens do produto">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                className={`featured-product__thumb${i === activeIndex ? ' featured-product__thumb--active' : ''}`}
                onClick={() => setActiveIndex(i)}
                aria-pressed={i === activeIndex}
                aria-label={`Ver imagem ${i + 1} de ${product.name}`}
              >
                <span className="featured-product__thumb-media">
                  <Image
                    src={img.img_url}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 42vw, 19vw"
                    className="featured-product__thumb-img"
                  />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
