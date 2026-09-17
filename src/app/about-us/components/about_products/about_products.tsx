import Link from 'next/link'
import type { ProductList } from '@/app/seller/product/type'
import ProductCard from '../product_card/product_card'
import './about_products.css'

type AboutProductsProps = {
  products: ProductList
}

export default function AboutProducts({ products }: AboutProductsProps) {
  return (
    <section className="about-products" aria-labelledby="about-products-title">
      <div className="about-us__content about-products__inner">
        <div className="about-products__header">
          <h2 id="about-products-title" className="about-products__title">
            Nossos produtos
          </h2>
        </div>

        {products.length > 0 ? (
          <ul className="about-products__grid">
            {products.map(product => (
              <li key={product.uid} className="about-products__item">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="about-products__empty">Novos produtos estarão disponíveis em breve.</p>
        )}

        <Link href="/product/all" className="about-products__view-all">
          Ver todos <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
