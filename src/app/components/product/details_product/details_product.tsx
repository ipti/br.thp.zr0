"use client"
import './details_product.css'

import { ZButton } from "@/components/button/button"
import { useCartStore } from "@/service/store/cart_store"
import { useState } from 'react'

export const DetailsProduct = ({ item, home }: { item: any, home?: boolean }) => {
    const [quantity, setQuantity] = useState(1)

    const handleQuantityChange = (change: number) => {
        setQuantity(prev => Math.max(1, prev + change))
    }

    if (!item) return <div>Carregando...</div>
    return (
        <div className="product-details">
            <div className='flex flex-row justify-content-between align-items-center'>
                <h3 className="product-title">{item.name}</h3>
                <p className="product-price">R$ {item.price?.toLocaleString('pt-BR')}</p>
            </div>
            <p className="product-description">{item.description}</p>
            <p className="product-location">Local de produção: {item.location || "Santa Luzia do Itanhy"}</p>
            {/* Ações */}
            <div className="product-actions">
                <ZButton
                    icon={window?.innerWidth < 600 ? "pi pi-cart-plus" : undefined}
                    onClick={() => {
                        if (home) {

                            window.location.href = `/product/${item?.uid.toString() ?? "2"}`
                        } else {
                            useCartStore.getState().addItem({
                                id: item?.uid.toString() ?? "2",
                                name: item?.name ?? "",
                                price: item?.price ?? 1,
                                quantity: quantity,
                                image: item?.product_image![0]?.img_url ?? "",
                            })
                        }
                    }

                    }
                    disabled={item?.quantity === 0}
                    className='btn-buy'
                >{window.innerWidth < 600 ? '' : home ? 'Ver detalhes' : "Adicionar ao carrinho"  }</ZButton>
                {(!home) && <>
                    {item?.quantity === 0 ? <div className='gap-2 flex flex-row'><i className='pi pi-ban flex flex-column justify-content-center'></i><p>Sem estoque</p></div>: <div className={"quantity"}>
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <span>{quantity}</span>
                        <button disabled={!((item?.quantity ?? 0) > quantity)} onClick={() => handleQuantityChange(1)}>
                            +
                        </button>
                    </div>}
                </>
                }
            </div>
        </div>
    )
}