'use client'

import { useEffect, useState } from 'react'
import http from '@/service/axios'
import { ProductCard } from '@/app/product/components/product_list/components/product_card/product_card'
import { ProductType } from '@/app/seller/product/type'

export default function WishlistComponent() {
  const [items, setItems] = useState<ProductType[]>([])

  useEffect(() => {
    void http.get('/wishlist').then(response => {
      const products = response.data.map((item: any) => item.product)
      setItems(products)
    })
  }, [])

  return (
    <div className="p-4">
      <h1>Minha wishlist</h1>
      <div className="grid mt-3">
        {items.map(product => (
          <div key={product.id} className="col-12 md:col-4 lg:col-3">
            <ProductCard product={product} />
          </div>
        ))}
        {!items.length ? <p>Nenhum produto salvo ainda.</p> : null}
      </div>
    </div>
  )
}
