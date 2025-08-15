export interface VerifyEmailTypes {
    email?: string
}

export interface LoginTypes {
    email?: string,
    password?: string
}

export interface CartItem {
  productId: number;
  quantity: number;
  delivery_estimate: Json
  workshopId: number
}

export interface CreateOrder {
  userId: number
  items: CartItem[]
  observation: string
  address: Address
}

export interface Address {
  name: string
  phone: string
  cep: string
  address: string
  number: string
  complement: string
  neighborhood: string
  stateId: number
  cityId: number
}


export interface SignUpTypes {
    name?: string,
    email?: string,
    password?: string
}

export interface VerifyEmailReturn {
    email: string, exists: boolean
}

export interface CreateAdressCustomer {
  name: string
  phone: string
  cep: string
  address: string
  number: string
  complement: string
  neighborhood: string
  stateId: number
  cityId: number
  customerId: number
}
