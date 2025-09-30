import { ProductType } from '@/app/seller/product/type'
import './product.css'

export default function Product({ item }: { item: ProductType }) {
  return (
    <section className='section-home'>

      <div className="product-section">
        <div className="product-container">
          <div className="product-header">
            <h2>Cada peça carrega uma história</h2>
          </div>

          <div className="product-grid">
            <div className="product-image">
              <div className="image-wrapper">
                <img
                  src={item.product_image[0]?.img_url}
                  alt="Mesa de Centro Artesanal"
                />
              </div>
            </div>

            <div className="gap-4">
              {/* Swatches */}
              <div className="color-swatches">
                <div className="swatch swatch-light"></div>
                <div className="swatch swatch-medium"></div>
                <div className="swatch swatch-dark"></div>
              </div>

              <div>
                <h3 className="product-title">Mesa do centro</h3>
                <p className="product-price">R$ 1.890</p>
                <p className="product-description">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text.
                </p>
              </div>

              <div className="product-specs">
                <div className="spec-item">
                  <span className="label">Cor</span>
                  <span>Branco e cinza</span>
                </div>
                <div className="spec-item">
                  <span className="label">Altura</span>
                  <span>40 cm</span>
                </div>
                <div className="spec-item">
                  <span className="label">Material</span>
                  <span>Plástico reciclado</span>
                </div>
              </div>

              <div className="product-actions">
                <button className="icon-button">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="icon-button">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  )
}