import Products from "./components/products";
import { getProductsPage } from '@/app/middleware/producs_list'
import { getCategories } from '@/app/middleware/categories'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Produtos sustentaveis | ZR0',
  description:
    'Conheca moveis e pecas de design produzidos artesanalmente com plastico reciclado.',
}

export default async function ProductPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; page?: string; categoryId?: string; sort?: string }>
}){
    const params = await searchParams
    const q = params?.q
    const parsedPage = Number(params?.page ?? 1)
    const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
    const categoryId = params?.categoryId
    const sort = params?.sort

    let products, categories
    try {
      products = await getProductsPage({ q, page, categoryId, sort })
    } catch (e) {
      console.error('Failed to fetch products:', e)
      products = { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
    }

    try {
      categories = await getCategories()
    } catch (e) {
      console.error('Failed to fetch categories:', e)
      categories = []
    }

    return(
        <div className="p-4">
            <Products
              q={q}
              page={page}
              categoryId={categoryId}
              sort={sort}
              products={products}
              categories={categories}
            />
        </div>
    )
}
