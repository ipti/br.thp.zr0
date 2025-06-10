export type UserList = User[]

export interface User {
  id: number
  name: string
  email: string
  active: boolean
  role: "SELLER" | "SELLER_MANAGER" | "CUSTOMER" | "ADMIN"
}
