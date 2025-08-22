import Image from 'next/image'
import './product.css'
import { ZButton } from '@/components/button/button'
import { ProductType } from '@/app/seller/product/type'

export default function Product({ item }: { item: ProductType }){
    return(
         <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl">Cada peça carrega uma história</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={item.product_image[0].img_url ?? ""}
                  alt="Mesa de Centro Artesanal"
                  className="w-full h-full object-cover"
                  width={400}
                  height={400}
                />
              </div>
            </div>

            <div className="space-y-8">
              {/* Color swatches */}
              <div className="flex gap-3 justify-end">
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-500 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
              </div>

              <div>
                <h3 className="text-2xl mb-2">Mesa do centro</h3>
                <p className="text-2xl mb-6">R$ 1.890</p>
                
                <p className="text-gray-600 leading-relaxed mb-8">
                  Lorem Ipsum is simply dummy text of the printing and 
                  typesetting industry. Lorem Ipsum has been the industry's 
                  standard dummy text.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Cor</span>
                  <span>Branco e cinza</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Altura</span>
                  <span>40 cm</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Material</span>
                  <span>Plástico reciclado</span>
                </div>
              </div>

              <div className="flex gap-2">
                <ZButton 
                  className="w-12 h-12 border-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </ZButton>
                <ZButton 
                  className="w-12 h-12 border-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </ZButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}