// stores/cartStore.ts
import { create } from "zustand";
import Cookies from "js-cookie";
import http from "../axios";
import { CartItem } from "./type";

interface CartState {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  loadCart: () => void;
  updateQuantity: (id: string, quantity: number) => void
  setCart: (items: CartItem[]) => void
}

const CART_KEY = "cart_items";

const isLoggedIn = () => !!Cookies.get("access_token");

export const useCartStore = create<CartState>((set) => ({
  cart: typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem(CART_KEY) || "[]")
    : [],

  loadCart: () => {
    const stored = localStorage.getItem(CART_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    set({ cart: parsed });
  },

  setCart: (items) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    set({ cart: items });
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
      if (item.cartItemId === undefined && isLoggedIn()) {
        void http
          .get(`/product-bff/uid/${item.id}`)
          .then((response) =>
            http.post("/cart/items", {
              productId: response.data.id,
              quantity: item.quantity,
              variantId: item.variantId,
            }),
          )
          .then((response) => {
            const apiItem = response.data;
            set((currentState) => {
              const synced = currentState.cart.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, cartItemId: apiItem.id }
                  : cartItem,
              );
              localStorage.setItem(CART_KEY, JSON.stringify(synced));
              return { cart: synced };
            });
          })
          .catch(() => {});
      }
      return { cart: updated };
    }),

    updateQuantity: (id: string, quantity: number) =>
    set((state) => {
      const updated = state.cart.map((item) => {
        if (item.id !== id) return item
        const newQuantity = Math.max(quantity, 1)
        if (item.cartItemId && isLoggedIn()) {
          void http.patch(`/cart/items/${item.cartItemId}`, {
            quantity: newQuantity,
          }).catch(() => {})
        }
        return { ...item, quantity: newQuantity }
      });
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return { cart: updated };
    }),

  removeItem: (id) =>
    set((state) => {
      const itemToRemove = state.cart.find((item) => item.id === id);
      if (itemToRemove?.cartItemId && isLoggedIn()) {
        void http.delete(`/cart/items/${itemToRemove.cartItemId}`).catch(() => {})
      }
      const updated = state.cart.filter((item) => item.id !== id);
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return { cart: updated };
    }),

  clear: () => {
    localStorage.removeItem(CART_KEY);
    return { cart: [] };
  },
}));
