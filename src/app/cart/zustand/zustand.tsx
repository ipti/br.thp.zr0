import { OrderItems, ValidOption } from "@/app/product/service/type";
import { useCartStore } from "@/service/store/cart_store";
import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";

export interface DeliverySelectedType {
    productId: string;
    productName: string;
    workshopName: string;
    workshopId: number;
    validOptions: ValidOption;
    quantity: number
}

export interface CartContextType {
    cep: string;
    address_selected: number | undefined;
    product_selected: string[] | undefined;
    deliverySelected?: DeliverySelectedType[] | undefined

}

export interface CartStore {
    cartSteps: CartContextType;
    loadCart: () => void;
    productSelected: () => OrderItems[]
    updateCartSteps: (data: CartContextType) => void
}

const CART_KEY = "cart_state";

export const useCartStepsStore = create<CartStore>((set, get) => ({

    cartSteps: typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(CART_KEY) || "[]")
        : [],

    loadCart: () => {
        const stored = localStorage.getItem(CART_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        set({ cartSteps: parsed });
    },

    productSelected: (): OrderItems[] => {
        const array: OrderItems[] = []
        const currentCart = useCartStore.getState().cart;
        const state = get();
        for (const i of currentCart) {
            if (state.cartSteps.product_selected?.find(props => props === i.id)) {
                array.push({ productId: i.id, quantity: i.quantity })
            }
        }
        return array
    },

    updateCartSteps: (data: CartContextType) => {
        const updated = { ...get().cartSteps, ...data };
        localStorage.setItem(CART_KEY, JSON.stringify(updated));
        set({ cartSteps: updated });
    },

}))