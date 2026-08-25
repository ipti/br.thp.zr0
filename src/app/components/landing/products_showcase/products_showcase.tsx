import type { ProductList } from '@/app/seller/product/type'
import Link from 'next/link'
import './products_showcase.css'

type ProductsShowcaseProps = {
  products: ProductList
}

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export default function ProductsShowcase({
  products,
}: ProductsShowcaseProps) {
  const featuredProducts = products.slice(0, 4)

  return (
    <section
      className="landing-products-showcase landing-section"
      aria-labelledby="landing-products-title"
    >
      <span
        className="landing-products-showcase__shape landing-products-showcase__shape--top"
        aria-hidden="true"
      />
      <span
        className="landing-products-showcase__shape landing-products-showcase__shape--middle"
        aria-hidden="true"
      />
      <span
        className="landing-products-showcase__shape landing-products-showcase__shape--bottom"
        aria-hidden="true"
      />

      <div className="landing-products-showcase__inner landing-content">
        <div className="landing-products-showcase__intro">
          <h2
            id="landing-products-title"
            className="landing-products-showcase__title"
          >
            Cada produto carrega uma história que continua depois da compra.
          </h2>

          <div className="landing-products-showcase__copy">
            <p>
              Os móveis e objetos da ZR0 são o resultado de uma cadeia construída
              por pessoas, conhecimento e propósito.
            </p>
            <p>
              Feitos para durar e atravessar novas histórias, eles valorizam os
              materiais, o trabalho das comunidades e o impacto positivo em cada
              etapa do processo.
            </p>
          </div>
        </div>

        <div className="landing-products-showcase__catalog">
          <h3 className="landing-products-showcase__catalog-title">
            Nossos produtos
          </h3>

          {featuredProducts.length > 0 ? (
            <ul className="landing-products-showcase__grid">
              {featuredProducts.map((product) => {
                const imageUrl = product.product_image?.[0]?.img_url

                return (
                  <li key={product.uid} className="landing-products-showcase__item">
                    <Link
                      href={`/product/${product.uid}`}
                      className="landing-products-showcase__card"
                    >
                      <span className="landing-products-showcase__media">
                        {imageUrl ? (
                          <img
                            className="landing-products-showcase__image"
                            src={imageUrl}
                            alt={product.name}
                          />
                        ) : (
                          <span
                            className="landing-products-showcase__image-placeholder"
                            aria-hidden="true"
                          />
                        )}
                      </span>

                      <span className="landing-products-showcase__details">
                        <span className="landing-products-showcase__name">
                          {product.name}
                        </span>
                        <span className="landing-products-showcase__price">
                          {priceFormatter.format(product.price)}
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="landing-products-showcase__empty">
              Novos produtos estarão disponíveis em breve.
            </p>
          )}

          <Link href="/product" className="landing-products-showcase__view-all">
            Ver todos <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
