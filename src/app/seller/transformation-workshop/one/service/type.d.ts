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

export interface TransformationWorkshopUser {
  users: Users
}

export interface Users {
  id: number
  email: string
  username: string
  role: string
  name: string
  password: string
  active: boolean
  verify_email: boolean
  createdAt: string
  updatedAt: string
}
