"use client"
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
}

export const CartContext = createContext<CardContextType | null>(null)



export default function CartProvider({ children }: { children: React.ReactNode }) {


    const [initialValue, setInitialValue] = useState({
        cep: "",
        address_selected: undefined,
        product_selected: [],
    });

    return (
        <CartContext.Provider value={{ initialValue, setInitialValue }}>
            {children}
        </CartContext.Provider>)
}