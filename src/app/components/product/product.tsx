'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductList } from '@/app/seller/product/type'
import './product.css'
import '../home.css'
import { DetailsProduct } from './details_product/details_product'

type ProductProps = {
  listProduct: ProductList
}
const Product: React.FC<ProductProps> = ({ listProduct }) => {
  const router = useRouter()

  const [focusProduct, setFocusProduct] = useState(listProduct[0])

  return (
    <section className="product-section">
      <div className="product-container">
        {/* Cabeçalho */}
        <div className="product-header">
          <h2>Cada peça carrega uma história</h2>
          <p>
            Produzido artesanalmente com plástico reciclado, cada móvel é único
            e feito com propósito.
          </p>
        </div>

        <div className="product-content ">
          {/* Imagem principal */}
          <div className="product-main-image">
            <img
              src={focusProduct.product_image[0].img_url}
              alt={focusProduct.description}
            />
            <DetailsProduct item={focusProduct} home />
          </div>

          {/* Galeria lateral */}
          <div className="product-gallery">
            {listProduct.map((product, index) => {
              if (product.uid !== focusProduct.uid) {
                return (
                  <img
                    key={product.name}
                    src={product.product_image[0].img_url}
                    alt={`Produto ${product.name}`}
                    onClick={() => setFocusProduct(listProduct[index])}
                  />
                )
              }
            })}
            <button
              className="view-all"
              onClick={() => router.push(`/product`)}
            >
              Ver todos os produtos →
            </button>
          </div>
          <button
            className="view-all-mobile"
            onClick={() => router.push(`/product`)}
          >
            Ver todos os produtos →
          </button>
          {/* Detalhes */}
        </div>
      </div>
    </section>
  )
}

export default Product
