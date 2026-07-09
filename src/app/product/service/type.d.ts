export interface ShippingCalculateType {
    orderItems: OrderItems[]
    destinationZipCode: string
  }

export interface ProductReviewUser {
  id: number
  name: string
}

export interface ProductReview {
  id: number
  rating: number
  comment?: string
  createdAt: string
  user: ProductReviewUser
}

export interface ProductReviewResponse {
  data: ProductReview[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface WishlistStatus {
  wished: boolean
}
  
export interface OrderItems {
  productId: string
  variantId?: number
  quantity: number
}
  
export interface ShippingGetType {
  result: Result
  workshopId: number
  quantity: number
  workshopName: string
  productId: string
  productName: string
}

export interface Result {
  bestOption: BestOption
  validOptions: ValidOption[]
}

export interface BestOption {
  service: string
  carrier: string
  cost: number
  deliveryTime: number
  tracking: boolean
  error: any
  serviceCode: string
}

export interface ValidOption {
  service: string
  carrier: string
  cost: number
  deliveryTime: number
  tracking: boolean
  error: any
  serviceCode: string
}
