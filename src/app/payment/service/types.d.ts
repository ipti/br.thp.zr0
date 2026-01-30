export interface OrderOneType {
  id: number
  uid: string
  user_fk: number
  total_amount: number
  notes: string
  payment_status: string
  payment_method: any
  payment_intent_id: string
  createdAt: string
  updatedAt: string
  user: User
  order_services: OrderService[]
  order_delivery_address: OrderDeliveryAddress
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

export interface OrderService {
  id: number
  uid: string
  transformation_workshop_fk: number
  status: string
  total_amount: number
  createdAt: string
  updatedAt: string
  order_fk: number
  order_item: OrderItem[]
  transformation_workshop: TransformationWorkshop
}

export interface OrderItem {
  id: number
  product_fk: number
  variant_fk: any
  quantity: number
  unit_price: number
  total_price: number
  delivery_estimate: DeliveryEstimate
  createdAt: string
  updatedAt: string
  order_service_fk: number
  product: Product
  variant: any
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

export interface TransformationWorkshop {
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
