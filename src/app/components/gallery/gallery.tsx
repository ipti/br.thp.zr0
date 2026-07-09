import { ProductType } from "@/app/seller/product/type"
import "./gallery.css"
import http from "@/service/axios";

export default async function Gallery() {

    const product = await http.get("/product");
    const products = product?.data?.data ?? product?.data ?? [];

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
