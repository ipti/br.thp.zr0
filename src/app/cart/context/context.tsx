"use client"
import { OrderItems } from "@/app/product/service/type";
import { useCartStore } from "@/service/store/cart_store";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export interface CardContextType {
    initialValue: {
        cep: string;
        address_selected: number | undefined;
        product_selected: string[] | undefined;
    }
    setInitialValue: Dispatch<SetStateAction<{
        cep: string;
        address_selected: number | undefined;
        product_selected: string[] | undefined;
    }>>
    productSelected: () => OrderItems[]
}

export const CartContext = createContext<CardContextType | null>(null)



export default function CartProvider({ children }: { children: React.ReactNode }) {


    const [initialValue, setInitialValue] = useState({
        cep: "",
        address_selected: undefined,
        product_selected: [],
    });

    const cart = useCartStore((state) => state.cart);


    const productSelected = () => {
        const array: OrderItems[] = []
        for (const i of cart) {
            if (initialValue.product_selected?.find(props => props === i.id)) {
                array.push({ productId: parseInt(i.id), quantity: i.quantity })
            }
        }
        return array
    }

    return (
        <CartContext.Provider value={{ initialValue, setInitialValue, productSelected }}>
            {children}
        </CartContext.Provider>)
}