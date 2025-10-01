import { ProductType } from '@/app/seller/product/type'
import './product.css'

export default function Product({ item }: { item: ProductType }) {
  return (
    <section className="product-page">
      <div className="product-container">

        {/* Cabeçalho */}
        <div className="product-header">
          <h2>Cada peça carrega uma história</h2>
          <p>
            Produzido artesanalmente com plástico reciclado, cada móvel é único e feito com propósito.
          </p>
        </div>

        <div className="product-content">
          {/* Imagem principal */}
          <div className="product-main-image">
            <img
              src={item.product_image[0]?.img_url}
              alt={item.name}
            />
             <div className="product-details">
            <h3 className="product-title">{item.name}</h3>
            <p className="product-price">R$ {item.price?.toLocaleString('pt-BR')}</p>
            <p className="product-description">{item.description}</p>
            <p className="product-location">Local de produção: {item.location || "Santa Luzia do Itanhy"}</p>

            {/* Ações */}
            <div className="product-actions">
              <button className="btn-buy">Comprar</button>
              <div className="quantity-control">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>
          </div>
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
