// stores/cartStore.ts
import { create } from "zustand";
import { CartItem } from "./type";

interface CartState {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  loadCart: () => void;
  updateQuantity: (id: string, quantity: number) => void
}

const CART_KEY = "cart_items";

export const useCartStore = create<CartState>((set) => ({
  cart: typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem(CART_KEY) || "[]")
    : [],

  loadCart: () => {
    const stored = localStorage.getItem(CART_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    set({ cart: parsed });
  },

  addItem: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);
      let updated: CartItem[];

      if (existing) {
        updated = state.cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        updated = [...state.cart, item];
      }

      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return { cart: updated };
    }),

    updateQuantity: (id: string, quantity: number) =>
    set((state) => {
      const updated = state.cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
      );
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return { cart: updated };
    }),

  removeItem: (id) =>
    set((state) => {
      const updated = state.cart.filter((item) => item.id !== id);
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return { cart: updated };
    }),

  clear: () => {
    localStorage.removeItem(CART_KEY);
    return { cart: [] };
  },
}));
