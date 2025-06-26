export interface ShippingCalculateType {
    orderItems: OrderItems[]
    destinationZipCode: string
  }
  
  export interface OrderItems {
    productId: number
    quantity: number
  }
  