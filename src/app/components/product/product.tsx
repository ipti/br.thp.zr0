'use client'
import { ProductType } from '@/app/seller/product/type'
import './product.css'
import "../home.css"
import { DetailsProduct } from './details_product/details_product'
import { useState } from 'react'


export default function Product({ item }: { item: ProductType }) {
  const [imageIndex, setImageIndex] = useState(0);
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
              src={item.product_image[imageIndex]?.img_url}
              alt={item.name}
            />
            <DetailsProduct item={item} home />
          </div>

          {/* Galeria lateral */}
          <div className="product-gallery">
            {item.product_image.slice(0, 3).map((img, idx) => (
              <img key={idx} src={img.img_url} onClick={() => setImageIndex(idx)} alt={`Produto ${idx}`} />
            ))}
            <button className="view-all" onClick={() => window.location.href = `/product`}>Ver todos os produtos →</button>
          </div>

          {/* Detalhes */}


        </div>
      </div>
    </section>
  )
}
