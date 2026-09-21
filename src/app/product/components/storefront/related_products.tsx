import Image from 'next/image'
import Link from 'next/link'
import type { ProductType } from '@/app/seller/product/type'
import relatedDecoration from '@/assets/img/product-store/related-decoration.jpg'
import './related_products.css'

interface RelatedProductsProps {
  products: ProductType[]
}

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="related-products" aria-labelledby="related-products-title">
      <Image
        src={relatedDecoration}
        alt=""
        aria-hidden="true"
        className="related-products__decoration"
        sizes="180px"
      />

      <div className="related-products__inner">
        <h2 id="related-products-title" className="related-products__heading">
          Veja também
        </h2>

        <ul className="related-products__grid" role="list">
          {products.map((product) => {
            const imageUrl = product.product_image?.[0]?.img_url

            return (
              <li key={product.uid} className="related-products__item">
                <Link href={`/product/${product.uid}`} className="related-products__card">
                  <div className="related-products__media">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 600px) 45vw, (max-width: 900px) 22vw, 15vw"
                        className="related-products__img"
                      />
                    ) : (
                      <div className="related-products__no-image" aria-label={`Imagem indisponível para ${product.name}`} role="img" />
                    )}
                  </div>

                  <div className="related-products__info">
                    <span className="related-products__name">{product.name}</span>
                    <span className="related-products__price">
                      R${priceFormatter.format(product.price)}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="related-products__footer">
          <Link href="/product/all" className="related-products__view-all">
            Ver todos
            <span className="related-products__arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
