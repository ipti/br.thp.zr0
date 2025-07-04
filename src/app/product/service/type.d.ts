export interface ShippingCalculateType {
    orderItems: OrderItems[]
    destinationZipCode: string
  }
  
  export interface OrderItems {
    productId: number
    quantity: number
  }
  
  export interface ShippingGetType {
  totalCost: number
  shipments: Shipment[]
}

export interface Shipment {
  workshopId: number
  result: Result
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
