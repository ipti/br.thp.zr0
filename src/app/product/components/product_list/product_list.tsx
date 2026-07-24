import { ProductType } from "@/app/seller/product/type";
import { ProductCard } from "./components/product_card/product_card";

export default function ProductList({ filteredAndSortedProducts }: { filteredAndSortedProducts: ProductType[] | undefined }) {
    return (
        <div className="grid mb-20">
            {filteredAndSortedProducts?.map((product, index) => {
                const delay = (index % 4) * 100;
                return (
                    <div
                        className="col-12 sm:col-6 lg:col-4 xl:col-3"
                        key={product.id}
                    >
                        <div
                            className="col-4 w-full animate-fade-in-slide "
                            style={{ animationDelay: `${delay}ms` }}
                        >
                            <ProductCard
                            product={product}
                            // onProductClick={onProductClick}
                            // onNavigateToCart={onNavigateToCart}
                            />
                        </div>
                    </div>
                )
            })}
        </div>

    )
}
