export interface UserGlobal {
  customer: Customer
  id: number
  email: string
  name: string
  username: any
}

export interface Customer {
  id: number
  cpf: any
  cnpj: any
  birthday: any
  phone: any
  corporate_name: any
  trade_name: any
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
}
