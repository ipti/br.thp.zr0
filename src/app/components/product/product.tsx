'use client'
import { ProductList, ProductType } from '@/app/seller/product/type'
import './product.css'
import '../home.css'
import { DetailsProduct } from './details_product/details_product'
import { useRouter } from 'next/navigation'

type ProductProps = {
  item: ProductType
  listProduct: ProductList
}
const Product: React.FC<ProductProps> = ({ item, listProduct }) => {
  const router = useRouter()
  const allProducts = listProduct.map(product => {
    if (product.uid !== item.uid) {
      return product
    }
  })

  const handleSelectProduct = (id: string) => {
    router.push(`/product/${id}`)
  }

  console.log({ allProducts })
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
              src={item.product_image[0]?.img_url}
              alt={item.name}
              onClick={() => handleSelectProduct(item.uid)}
            />
            <DetailsProduct item={item} home />
          </div>

          {/* Galeria lateral */}
          <div className="product-gallery">
            {allProducts.map(product => {
              if (product) {
                return (
                  <img
                    key={product.name}
                    src={product.product_image[0].img_url}
                    alt={`Produto ${product.name}`}
                    onClick={() => handleSelectProduct(product.uid)}
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

          {/* Detalhes */}
        </div>
      </div>
    </section>
  )
}

export default Product
