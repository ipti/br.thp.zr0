export interface OrderlistType {
  order: Order[]
}

export interface Order {
  id: number
  uid: string
  user_fk: number
  workshop_fk: number
  status: string
  total_amount: number
  createdAt: string
  updatedAt: string
  payment_status: string
  payment_method: any
  notes: string
}
