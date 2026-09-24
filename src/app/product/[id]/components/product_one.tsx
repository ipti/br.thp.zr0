'use client'

import { DetailsProduct } from '@/app/components/product/details_product/details_product'
import { ProductReviews } from '@/app/product/components/product_reviews'
import { ProductOne } from '@/app/seller/product/one/service/type'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import './product_one.css'

export default function ProductOneComponent({
  product,
}: {
  product: ProductOne
}) {
  const [imageIndex, setImageIndex] = useState(0)
  const selectedImage =
    product.product_image[imageIndex] ?? product.product_image[0]

  // O layout de /product é compartilhado entre a listagem e o detalhe, então
  // o App Router às vezes não reseta o scroll ao navegar entre eles (fica na
  // posição da página anterior). Força o topo sempre que o produto muda.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [product.uid])

  return (
    <div className={'container'}>
      <div className={'wrapper'}>
        {/* Breadcrumb */}
        <div className={'breadcrumb'}>
          <Link href="/product">Produtos</Link>
          <i className="pi pi-angle-right" />
          <span>{product.name}</span>
        </div>

        {/* Product Detail */}
        <div className={'detailGrid'}>
          <div className="flex flex-column">
            <div className={'imageBox'}>
              {selectedImage?.img_url ? (
                <img
                  src={selectedImage.img_url}
                  alt={product.name}
                  className="imageProduct"
                />
              ) : null}
            </div>
            <div className="p-2" />
            <div className="product-detail-gallery">
              {product.product_image.slice(0, 3).map((image, index) => (
                <button
                  type="button"
                  key={image.id}
                  onClick={() => setImageIndex(index)}
                  aria-label={`Ver imagem ${index + 1} de ${product.name}`}
                >
                  <img
                    src={image.img_url}
                    alt={`${product.name} - imagem ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <DetailsProduct item={product} />
        </div>
        <ProductReviews productUid={product.uid} />

        {/* Divider */}
        <div className={'divider'}></div>
      </div>
    </div>
  )
}
