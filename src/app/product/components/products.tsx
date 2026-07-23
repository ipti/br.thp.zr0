import { getProductsPage } from '@/app/middleware/producs_list'
import ProductList from './product_list/product_list'
import SearchInput from './search_input'
import Link from 'next/link'
import { Suspense } from 'react'

import './product.css'
export default async function Products({ q, page }: { q?: string; page: number }) {
  const products = await getProductsPage({ q, page })
  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams({ page: String(targetPage) })
    if (q) params.set('q', q)
    return `/product?${params.toString()}`
  }

  return (
    <div>
      <div className="text-center mb-4 fade-up">
        <h1 className="mb-6">Nossos Produtos</h1>
        <p className="text-gray-600 w-full lg:w-6 mx-auto leading-relaxed">
          Explore as últimas tendências em design de interiores com nossa
          coleção cuidadosamente selecionada. Cada peça é design para
          transformar sua casa em um espaço único. Incorporamos peças
          emocionantes que não devem ser apenas pela sua excepcional artesania,
          mas também pelo seu compromisso com o meio ambiente.
        </p>
        <div className="mt-4">
          <Suspense
            fallback={
              <input
                type="search"
                defaultValue={q ?? ''}
                disabled
                aria-label="Carregando busca de produtos"
                className="w-full md:w-30rem p-3 border-round border-1 surface-border"
              />
            }
          >
            <SearchInput initialValue={q ?? ''} />
          </Suspense>
        </div>
      </div>

      <ProductList filteredAndSortedProducts={products.data} />

      {products.data.length === 0 ? (
        <p className="text-center mb-6">
          Nenhum produto encontrado{q ? ` para “${q}”` : ''}.
        </p>
      ) : null}

      {products.pagination.totalPages > 1 ? (
        <nav
          className="flex justify-content-center align-items-center gap-3 mb-6"
          aria-label="Paginação de produtos"
        >
          {page > 1 ? <Link href={pageHref(page - 1)}>← Anterior</Link> : null}
          <span>
            Página {page} de {products.pagination.totalPages}
          </span>
          {page < products.pagination.totalPages ? (
            <Link href={pageHref(page + 1)}>Próxima →</Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  )
}
