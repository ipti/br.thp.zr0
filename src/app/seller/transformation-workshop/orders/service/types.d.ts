
export interface OrderPagination {
  data: OrderlistType[]
  pagination: Pagination
}
export interface OrderlistType {
  id: number
  uid: string
  transformation_workshop_fk: number
  status: string
  total_amount: number
  createdAt: string
  updatedAt: string
  order_fk: number
  _count: Count
  order_item: OrderItem[]
  order: Order
  totalProducts: number
}

export interface Count {
  order_item: number
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

export interface Order {
  payment_status: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface OrderOneType {
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
  user: User
  workshop: Workshop
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

export interface RefundOrder {
  amount: number;
  idOrder: number
}