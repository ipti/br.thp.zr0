export type ProductList = ProductType[]

export interface ProductType {
  uid: string
  id: number
  name: string
  description: string
  price: number
  averageRating?: number
  reviewCount?: number
  category: Category
  product_image: ProductImage[]
}

export interface Category {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: number
  img_url: string
  order: any
  product_fk: number
}
