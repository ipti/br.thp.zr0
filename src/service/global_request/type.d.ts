export interface UserGlobal {
  customer: Customer
  id: number
  email: string
  name: string
  username: any
}

export interface Customer {
  id: number
  cpf: string
  cnpj: string
  birthday: string
  phone: string
  corporate_name: string
  trade_name: string
  user_fk: number
  billing_address: BillingAddress
}

export interface BillingAddress {
  id: number
  cep: string
  address: string
  number: string
  complement: string
  neighborhood: string
  state_fk: number
  city_fk: number
  customer_fk: number
  city: City
  state: State
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

export interface State {
  id: number
  acronym: string
  name: string
}
