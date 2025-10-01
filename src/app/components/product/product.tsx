import { ProductType } from '@/app/seller/product/type'
import './product.css'
import "../home.css"
import { DetailsProduct } from './details_product/details_product'


export default function Product({ item }: { item: ProductType }) {
  return (
    <section className='product-section'>
      <div className="product-container">

        {/* Cabeçalho */}
        <div className="product-header">
          <h2>Cada peça carrega uma história</h2>
          <p>
            Produzido artesanalmente com plástico reciclado, cada móvel é único e feito com propósito.
          </p>
        </div>

        <div className="product-content ">
          {/* Imagem principal */}
          <div className="product-main-image">
            <img
              src={item.product_image[0]?.img_url}
              alt={item.name}
            />
            <DetailsProduct item={item} home />
          </div>

          {/* Galeria lateral */}
          <div className="product-gallery">
            {item.product_image.slice(1, 4).map((img, idx) => (
              <img key={idx} src={img.img_url} alt={`Produto ${idx}`} />
            ))}
            <button className="view-all">Ver todos os produtos →</button>
          </div>

          {/* Detalhes */}


        </div>
      </div>
    </section>
  )
}
