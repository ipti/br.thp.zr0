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
