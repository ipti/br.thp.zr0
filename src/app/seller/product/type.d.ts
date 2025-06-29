export type ProductList = Product[]

export interface Product {
  id: number
  name: string
  description: string
  price: number
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
