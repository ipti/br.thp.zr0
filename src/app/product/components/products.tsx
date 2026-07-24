import ProductList from './product_list/product_list'
import { ProductFilters } from './product_filter/product_filter'
import Link from 'next/link'
import Pagination from '@/components/pagination/pagination'
import type { ProductsPage } from '@/app/middleware/producs_list'
import type { Category } from '@/app/seller/product/type'

import './product.css'

interface ProductsProps {
  q?: string
  page: number
  categoryId?: string
  sort?: string
  products: ProductsPage
  categories: Category[]
}

export default function Products({
  q,
  page,
  categoryId,
  sort,
  products,
  categories,
}: ProductsProps) {
  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (categoryId) params.set('categoryId', categoryId)
    if (sort) params.set('sort', sort)
    params.set('page', String(targetPage))
    return `/product?${params.toString()}`
  }

  return (
    <div>
      <div className="text-center mb-4">
        <h1 className="mb-6">Nossos Produtos</h1>
        <p className="text-gray-600 w-full lg:w-6 mx-auto leading-relaxed">
          Explore as ultimas tendencias em design de interiores com nossa colecao cuidadosamente selecionada.
          Cada peca e design para transformar sua casa em um espaco unico.
          Incorporamos pecas emocionantes que nao devem ser apenas pela sua excepcional artesania,
          mas tambem pelo seu compromisso com o meio ambiente.
        </p>
      </div>

      <ProductFilters
        q={q ?? ''}
        categoryId={categoryId ?? ''}
        sort={sort ?? ''}
        categories={categories}
      />

      <ProductList filteredAndSortedProducts={products.data} />

      {products.data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-xl mb-4">
            Nenhum produto encontrado{q ? ` para "${q}"` : ''}.
          </p>
          <Link href="/product" className="text-blue-600 hover:text-blue-800 underline">
            Limpar filtros
          </Link>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={products.pagination.totalPages}
        total={products.pagination.total}
        buildHref={buildHref}
      />
    </div>
  )
}
