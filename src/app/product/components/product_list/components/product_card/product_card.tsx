"use client";
import { useRouter } from "next/navigation";
import "./product_card.css";
import { ProductType } from "@/app/seller/product/type";

interface ProductCardProps {
    product: ProductType
    //   onProductClick: (id: number) => void;
    //   onNavigateToCart: () => void;
}

export const ProductCard = ({
    product
}: ProductCardProps) => {
    const useNavigate = useRouter();

    return (
        <div
            className="card"
            onClick={() => useNavigate.push('/product/'+product.id)}
        >
            <div className={"imageWrapper"}>
                <img src={product.product_image[0].img_url} alt={product.name} className={"image"} />
            </div>
            <div className={"info"}>
                <h3 className={"title"}>{product.name}</h3>
                <p className={"price"}>R$ {product.price.toFixed(2)}</p>
            </div>
            {/* <div className={"imageWrapper"}>
        <img src={product.product_image[0].img_url} alt={product.name} className={"image"} />
      </div>
      <div className={"info"}>
        <h3 className={"title"}>{product.name}</h3>
        <p className={"price"}>R$ {product.price.toFixed(2)}</p>
      </div>
      <button
        className="button"
        onClick={(e) => {
            console.log(e)
        //   e.stopPropagation();
        //   onNavigateToCart();
        }}
      >
        Comprar
      </button> */}
        </div>
    );
};
