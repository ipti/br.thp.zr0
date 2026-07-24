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
  searchParams?: Promise<{ q?: string; page?: string; category?: string; categoryId?: string; sort?: string }>
}){
    const params = await searchParams
    const q = params?.q
    const parsedPage = Number(params?.page ?? 1)
    const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
    const sort = params?.sort
    const categoryQuery = params?.category

    let products, categories
    try {
      categories = await getCategories()
    } catch (e) {
      console.error('Failed to fetch categories:', e)
      categories = []
    }

    const resolvedCategoryId = (() => {
      if (params?.categoryId) {
        return params.categoryId
      }

      if (!categoryQuery) {
        return undefined
      }

      const normalizedQuery = categoryQuery
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      const matchedCategory = categories.find((category) => {
        const normalizedName = category.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')

        return normalizedName === normalizedQuery
      })

      return matchedCategory ? String(matchedCategory.id) : undefined
    })()

    try {
      products = await getProductsPage({ q, page, categoryId: resolvedCategoryId, sort })
    } catch (e) {
      console.error('Failed to fetch products:', e)
      products = { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
    }

    return(
        <div className="p-4">
            <Products
              q={q}
              page={page}
              categoryId={resolvedCategoryId}
              sort={sort}
              products={products}
              categories={categories}
            />
        </div>
    )
}
