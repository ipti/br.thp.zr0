export interface AddUserTransfWorkType {
  user_fk: number
  tw_fk: number
}

export interface AddProductTransfWorkType {
  product_fk: number
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
  role: string
  name: string
  password: string
  active: boolean
  verify_email: boolean
  createdAt: string
  updatedAt: string
}
