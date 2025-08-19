export interface AddUserTransfWorkType {
  user_fk: number
  tw_fk: number
}


export interface TransfWorkOneType {
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
  transformation_workshop_product: TransformationWorkshopProduct[]
  transformation_workshop_user: TransformationWorkshopUser[]
  order: TransformationWorkshopOrder[]
}

export interface TransformationWorkshopOrder {
  id: number
  user_fk: number
  workshop_fk: number
  status: string
  total_amount: number
  createdAt: string
  updatedAt: string
  payment_status: string
  payment_method: any
  notes: string
  uid: string
  _count: {
    order_items: number
  }
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

export interface TransformationWorkshopProduct {
  id: number
  quantity: number
  product: Product
}

export interface Product {
  id: number
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

export interface TransformationWorkshopUser {
  users: Users
}

export interface Users {
  id: number
  email: string
  username: any
  role: "SELLER" | "SELLER_MANAGER" | "CUSTOMER" | "ADMIN"
  name: string
  password: string
  active: boolean
  verify_email: boolean
  createdAt: string
  updatedAt: string
}
