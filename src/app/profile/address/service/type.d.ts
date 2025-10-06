export interface CreateAddressCustomerType {
  name: string
  phone: string
  cep: string
  address: string
  number: string
  complement: string
  neighborhood: string
  stateId?: number
  cityId?: number
  customerId: number
}


export type AddressList = {customer: {address_customer: Address[]}}

export interface Address {
  id: number
  cep: string
  address: string
  number: string
  complement: string
  neighborhood: string
  customer: Customer
  state: State
  city: City
  name: string
  phone: string
}

export interface AddressCart extends Address {
  selected: boolean
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
