"use client";

import { useFetchrequestProductOne } from "@/app/seller/product/one/service/query";
import {
    ProductImage,
    ProductOne,
} from "@/app/seller/product/one/service/type";
import { useCartStore } from "@/service/store/cart_store";
import useCreateArrayUpToNumber from "@/utils/hook/useCreateArrayUpToNumber";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import './product_one.css';
import { useFetchrequestProductOneUid } from "../../service/query";

export default function ProductOneComponent() {
    const [quantity, setQuantity] = useState(1)
    const useNavigate = useRouter();

    const params = useParams(); // retorna { id: "123" }
    const id = params.id;
    const handleQuantityChange = (change: number) => {
        setQuantity(prev => Math.max(1, prev + change))
    }
    const [image, setImage] = useState<ProductImage | undefined>();
    const [loading, setLoading] = useState(true);
    const { data: productOneRequest } = useFetchrequestProductOneUid(
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
                    <button onClick={() => useNavigate.push('/product')}>Produtos</button>
                    <i className="pi pi-angle-right" />
                    {/* <ChevronRight size={16} /> */}
                    <span>{productOne?.name}</span>
                </div>

                {/* Product Detail */}
                <div className={'detailGrid'}>
                    {/* Image */}
                    <div className={"imageBox"}>
                        {productOne?.product_image[0].img_url && <img
                            src={productOne?.product_image[0].img_url}
                            alt={productOne?.name}
                            className="imageProduct"
                        />}
                    </div>
                    {/* Info */}
                    <div className={"info"}>
                        <h1>{productOne?.name}</h1>
                        <p className={'price'}>R$ {productOne?.price.toFixed(2)}</p>

                        <div className={'description'}>
                            <p className="mb-2">Descrição do produto</p>
                            <p>{productOne?.description}</p>
                            {/* <p>Local de produção: Santa Luiza do Itanhy</p> */}
                        </div>

                        {/* Purchase */}
                        {productOne?.quantity === 0 ? <div className={"actions"}>
                            <button
                                onClick={() =>
                                    console.log('Sem estoque')
                                }
                                disabled={productOne?.quantity === 0}
                                className={`${'cartButton'} ${false ? 'cartButtonAdded' : ""
                                    }`}
                            >
                                {false ? (
                                    <>

                                        Adicionado ao carrinho
                                    </>
                                ) : (
                                    <>
                                        <i className="pi pi-ban" />
                                        Sem estoque
                                    </>
                                )}
                            </button>
                        </div> : <div className={"actions"}>
                            <button
                                onClick={() =>
                                    useCartStore.getState().addItem({
                                        id: productOne?.uid.toString() ?? "2",
                                        name: productOne?.name ?? "",
                                        price: productOne?.price ?? 1,
                                        quantity: quantity,
                                        image: productOne?.product_image![0]?.img_url ?? "",
                                    })
                                }
                                disabled={productOne?.quantity === 0}
                                className={`${'cartButton'} ${false ? 'cartButtonAdded' : ""
                                    }`}
                            >
                                {false ? (
                                    <>

                                        Adicionado ao carrinho
                                    </>
                                ) : (
                                    <>
                                        <i className="pi pi-shopping-cart" />
                                        Adicionado ao carrinho
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
                                <button disabled={!((productOne?.quantity ?? 0) > quantity)} onClick={() => handleQuantityChange(1)}>
                                    <i className="pi pi-plus" />
                                </button>
                            </div>
                        </div>}
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
