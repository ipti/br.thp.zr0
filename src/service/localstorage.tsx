"use client"
const TOKEN_KEY = "token-zr0";

const CART = "cart-zr0";

export const isAuthenticated = () => {
  return localStorage.getItem(TOKEN_KEY) !== null;
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const login = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);


  // localStorage.clear();
};

// utils/cartStorage.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string; 
}

const CART_KEY = "cart_items";

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const addToCart = (item: CartItem) => {
  const current = getCart();
  const existing = current.find((i) => i.id === item.id);

  let updated;
  if (existing) {
    updated = current.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
    );
  } else {
    updated = [...current, item];
  }

  saveCart(updated);
};

export const removeFromCart = (id: string) => {
  const updated = getCart().filter((item) => item.id !== id);
  saveCart(updated);
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};
