export interface VerifyEmailTypes {
    email?: string
}

export interface LoginTypes {
    email?: string,
    password?: string
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
