import { ProductType } from "@/app/seller/product/type"
import "./gallery.css"
import { fetchServerApi } from '@/service/server_api'

export default async function Gallery() {

    const response = await fetchServerApi('/product', { cache: 'no-store' })
    const payload = response.ok ? await response.json() : []
    const products = payload?.data ?? payload ?? []

    return (
        <section className="gallery-section">
            <div className="gallery-container">
                <div className="gallery-grid">
                    {products?.map((item: ProductType, index: number) => {
                        return (
                            <div key={index} >
                                <div className="gallery-item">
                                    <img src={item.product_image![0]?.img_url} alt="Galeria 1" />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>

    )
}
