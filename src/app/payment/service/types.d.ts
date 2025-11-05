export interface OrderlistType {
  id: number
  uid: string
  user_fk: number
  workshop_fk: number
  status: string
  total_amount: number
  createdAt: string
  updatedAt: string
  payment_status: string
  payment_method: any
  notes: string
  order_items: OrderItem[]
  totalProducts: number
}

export interface OrderItem {
  id: number
  order_fk: number
  product_fk: number
  variant_fk: any
  quantity: number
  unit_price: number
  total_price: number
  delivery_estimate: DeliveryEstimate
  createdAt: string
  updatedAt: string
}

export interface DeliveryEstimate {
  cost: number
  error: any
  carrier: string
  service: string
  tracking: boolean
  serviceCode: string
  deliveryTime: number
}


export interface OrderOneType {
  id: number
  uid: string
  user_fk: number
  workshop_fk: number
  payment_intent_id: string
  status: string
  total_amount: number
  createdAt: string
  updatedAt: string
  payment_status: string
  payment_method: any
  notes: string
  user: User
  workshop: Workshop
  order_delivery_address: OrderDeliveryAddress
  order_items: OrderItem[]
}

export interface User {
  id: number
  email: string
  username: any
  role: string
  name: string
  password: string
  active: boolean
  verify_email: boolean
  createdAt: string
  updatedAt: string
}

export interface Workshop {
  id: number
  name: string
  cnpj: string
  cep: string
  address: string
  number: string
  complement: string
  neighborhood: string
  createdAt: string
  updatedAt: string
  state_fk: number
  city_fk: number
  state: State
  city: City
}

export interface State {
  id: number
  acronym: string
  name: string
}

export interface City {
  id: number
  state_fk: number
  name: string
  cep_initial: string
  cep_final: string
  ddd1: number
  ddd2: number
}

export interface OrderDeliveryAddress {
  id: number
  name: any
  phone: any
  cep: string
  address: string
  number: string
  complement: string
  neighborhood: string
  state_fk: number
  city_fk: number
  order_fk: number
  state: State2
  city: City2
}

export interface State2 {
  id: number
  acronym: string
  name: string
}

export interface City2 {
  id: number
  state_fk: number
  name: string
  cep_initial: string
  cep_final: string
  ddd1: number
  ddd2: number
}

export interface OrderItem {
  id: number
  order_fk: number
  product_fk: number
  variant_fk: any
  quantity: number
  unit_price: number
  total_price: number
  delivery_estimate: DeliveryEstimate
  createdAt: string
  updatedAt: string
  product: Product
  variant: any
}

export interface DeliveryEstimate {
  service: string
  carrier: string
  cost: number
  deliveryTime: number
  tracking: boolean
  error: any
  serviceCode: string
}

export interface Product {
  id: number
  uid: string
  name: string
  description: string
  price: number
  createdAt: string
  updatedAt: string
  category_fk: number
  weight: number
  height: number
  width: number
  length: number
}
