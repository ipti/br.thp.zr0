export interface UpdateCustomerType {
  cpf?: string
  cnpj?: string
  birthday?: string | Date
  phone?: string
  corporate_name?: string
  trade_name?: string
}


export interface UpdateUserType {
  name?: string,
  email?: string
}

export interface CreateAddressBilling {
  cep: string
  address: string
  number: string
  complement: string
  neighborhood: string
  stateId?: number
  cityId?: number
  customerId: number
}
