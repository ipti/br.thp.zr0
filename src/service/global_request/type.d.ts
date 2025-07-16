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
}