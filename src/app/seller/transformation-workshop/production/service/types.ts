export type ProductionStatus = 'QUEUED' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'

export interface ProductionCapacity {
  transformation_workshop_fk: number
  product_fk: number
  monthly_capacity: number
  active: boolean
  product: { id: number; name: string; description?: string }
}

export interface ProductionItem {
  id: number
  quantity: number
  produced_quantity: number
  production_status: ProductionStatus | null
  date_start: string | null
  date_end: string | null
  createdAt: string
  updatedAt: string
  product: { id: number; name: string; description?: string }
  order_item: {
    order_service: {
      id: number
      uid: string
      status: string
      estimated_ready_at: string | null
      order: {
        id: number
        uid: string
        sale_type: string
        createdAt: string
        user: { id: number; name: string }
      } | null
    } | null
  } | null
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}
