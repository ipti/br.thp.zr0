"use client";

import { useFetchrequestProductOne } from "@/app/seller/product/one/service/query";
import {
    ProductImage,
    ProductOne,
} from "@/app/seller/product/one/service/type";
import useCreateArrayUpToNumber from "@/utils/hook/useCreateArrayUpToNumber";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import './product_one.css'
import { useCartStore } from "@/service/store/cart_store";

export default function ProductOneComponent() {
    const [quantity, setQuantity] = useState(1)

    const params = useParams(); // retorna { id: "123" }
    const id = params.id;
    const handleQuantityChange = (change: number) => {
        setQuantity(prev => Math.max(1, prev + change))
    }
    const [image, setImage] = useState<ProductImage | undefined>();
    const [loading, setLoading] = useState(true);
    const { data: productOneRequest } = useFetchrequestProductOne(
        id
    );

    const productOne: ProductOne | undefined = productOneRequest;

    useEffect(() => {
        if (productOneRequest && loading) {
            setImage(productOneRequest.product_image[0]);
            setLoading(false);
        }
    }, [productOneRequest, loading]);

    const arrayQuantity = useCreateArrayUpToNumber(productOne?.quantity ?? 1)

    return (

        <div className={"container"}>
            <div className={"wrapper"}>
                {/* Breadcrumb */}
                <div className={"breadcrumb"}>
                    <button onClick={() => { }}>Produtos</button>
                    {/* <ChevronRight size={16} /> */}
                    <span>{productOne?.name}</span>
                </div>

                {/* Product Detail */}
                <div className={'detailGrid'}>
                    {/* Image */}
                    <div className={"imageBox"}>
                        <img
                            src={productOne?.product_image[0].img_url}
                            alt={productOne?.name}
                            className={'image'}
                        />
                    </div>

                    {/* Info */}
                    <div className={"info"}>
                        <h1>{productOne?.name}</h1>
                        <p className={'price'}>{productOne?.price}</p>

                        <div className={'description'}>
                            <p>Descrição do produto</p>
                            <p>Local de produção: Santa Luiza do Itanhy</p>
                        </div>

                        {/* Purchase */}
                        <div className={"actions"}>
                            <button
                                onClick={() =>
                                    useCartStore.getState().addItem({
                                        id: productOne?.id.toString() ?? "2",
                                        name: productOne?.name ?? "",
                                        price: productOne?.price ?? 1,
                                        quantity: quantity,
                                        image: productOne?.product_image![0]?.img_url ?? "",
                                    })
                                }
                            // disabled={isAdding}
                            // className={`${'cartButton'} ${
                            //   isAdding ? 'cartButtonAdded' : ""
                            // }`}
                            >
                                {false ? (
                                    <>

                                        Adicionado ao carrinho
                                    </>
                                ) : (
                                    <>
                                        <i className="pi pi-shopping-cart" />
                                        Adicionar ao carrinho
                                    </>
                                )}
                            </button>

                            <div className={"quantity"}>
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    <i className="pi pi-minus" />
                                </button>
                                <span>{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)}>
                                    <i className="pi pi-plus" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className={"divider"}></div>

                {/* Related */}
                {/* <div>
          <h2 className={"relatedTitle"}>Outros produtos</h2>
          <div className={'relatedGrid'}>
            {relatedProducts.map((p) => (
              <div key={p.id} className={"relatedCard"}>
                <ImageWithFallback
                  src={p.imageUrl}
                  alt={p.name}
                  className={relatedImage}
                />
              </div>
            ))}

            <div
              className={"seeAll"}
              onClick={onNavigateToProducts}
            >
              <p>Ver todos os produtos</p>
              <ChevronRight size={20} />
            </div>
          </div>
        </div> */}
            </div>
        </div>
    );
}
