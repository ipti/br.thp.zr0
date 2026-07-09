
export interface CartItem {
  id: string;
  cartItemId?: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantId?: number;
}
