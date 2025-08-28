import { CartContext } from "@/app/cart/context/context";
import { ZButton } from "@/components/button/button";
import ZCheckbox from "@/components/checkbox/checkbox";
import ZDropdown from "@/components/dropdown/dropdown";
import { useCartStore } from "@/service/store/cart_store";
import { CartItem } from "@/service/store/type";
import { useContext, useState } from "react";
import './item.css'
import { useFetchProductOneQuantity } from "@/app/cart/service/query";

export default function Item({ item }: { item: CartItem }) {
    const cartContext = useContext(CartContext)
    const [quantity, setQuantity] = useState(item.quantity)
    const isSelect = !!cartContext?.initialValue.product_selected?.find(prop => prop === item.id)
    const removeItem = useCartStore((state) => state.removeItem);
    const updateItem = useCartStore((state) => state.updateQuantity)

    const handleQuantityChange = (change: number) => {
        setQuantity(prev => Math.max(1, prev + change))
        updateItem(item.id, Math.max(1, quantity + change))
    }


    const { data: quantityFetch } = useFetchProductOneQuantity(item.id)

    var quantityProduct: { quantity: number } | undefined = quantityFetch
    return (
        <div
            className="card_list_item"
        >
            <div className="flex flex-column justify-content-center">
                <ZCheckbox value={item.id} className="mr-4" onChange={() => {
                    if (isSelect) {
                        cartContext?.setInitialValue(prev => ({ ...prev, product_selected: prev.product_selected?.filter(props => props !== item.id) }))
                    } else {
                        // cartContext?.initialValue.product_selected?.push(item.id)
                        cartContext?.setInitialValue(prev => ({ ...prev, product_selected: prev.product_selected?.concat(item.id) }))
                        // cartContext?.setInitialValue(prev => ({...prev, product_selected: prev.product_selected?.push(props => props !== item.id)}))
                    }
                }} checked={isSelect} />
            </div>
            <div className="flex flex-row align-items-center w-full gap-4 flex-wrap md:flex-nowrap">
                <div style={{ position: "relative", }}>
                    <img
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="border-round object-contain"
                    />
                </div>
                <div className="flex-1 min-w-min">
                    <div className="flex justify-content-between align-items-start flex-wrap">
                        <div>
                            <h3 className="m-0">{item.name}</h3>
                            <div className="p-1" />
                            <div className="flex flex-row">
                                <p className="text-sm m-0 text-600">
                                    R${item.price.toFixed(2)} x {item.quantity}
                                </p>
                                <p className="text-sm text-pink-600 font-bold ml-1">
                                    {" "} R${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <ZButton
                            icon="pi pi-times"
                            className="p-button-text p-button-sm p-button-danger"
                            onClick={() => removeItem(item.id)}
                        />
                    </div>
                    <div className={"quantity"}>
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                        >
                            <i className="pi pi-minus" />
                        </button>
                        <span>{quantity}</span>
                        <button disabled={!((quantityProduct?.quantity ?? 0) > quantity)} onClick={() => handleQuantityChange(1)}>
                            <i className="pi pi-plus" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}