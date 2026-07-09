export interface VerifyEmailTypes {
    email?: string
}

export interface LoginTypes {
    email?: string,
    password?: string
}

export interface CartItem {
  productId: string;
  variantId?: number;
  quantity: number;
  delivery_estimate: Json
  workshopId: number
}

export interface StockReservationItem {
  productId: string
  workshopId: number
  quantity: number
}

export interface CreateStockReservation {
  userId: number
  items: StockReservationItem[]
}

export interface CreateOrder {
  userId: number
  items: CartItem[]
  observation: string
  address: Address
  payment_method?: 'PIX' | 'CREDIT_CARD' | 'BANK_SLIP'
  coupon_code?: string
}

export interface Address {
  name: string
  phone: string
  cep: string
  address: string
  number: string
  complement: string
  neighborhood: string
  stateId: number
  cityId: number
}


export interface SignUpTypes {
    name?: string,
    email?: string,
    password?: string
}

export interface VerifyEmailReturn {
    email: string, exists: boolean
}

export interface CreateAdressCustomer {
  name: string
  phone: string
  cep: string
  address: string
  number: string
  complement: string
  neighborhood: string
  stateId: number
  cityId: number
  customerId: number
}

export interface CouponValidation {
  id: number
  code: string
  discount_type: 'PERCENT' | 'FIXED'
  discount_value: number
  min_order_value?: number
  discount: number
}
