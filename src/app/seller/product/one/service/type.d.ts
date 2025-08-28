export interface ProductOne {
   id: number
  name: string
  description: string
  price: number
  createdAt: string
  updatedAt: string
  category_fk: number
  weight: number
  height: number
  width: number
  length: number
  product_image: ProductImage[]
  quantity: number
  uid: string
}

export interface ProductImage {
  id: number
  img_url: string
  order: any
  product_fk: number
}
