export interface ShippingCalculateType {
    orderItems: OrderItems[]
    destinationZipCode: string
  }
  
  export interface OrderItems {
    productId: string
    quantity: number
  }
  
  export interface ShippingGetType {
  result: Result
  workshopId: number
  quantity: number
  workshopName: string
  productId: number
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
