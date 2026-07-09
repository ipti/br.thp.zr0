import { getProducts } from '@/app/middleware/producs_list'
import ProductList from './product_list/product_list'
import SearchInput from './search_input'

import './product.css'
export default async function Products({ q }: { q?: string }) {
  const product = await getProducts(q)

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
          <SearchInput initialValue={q ?? ''} />
        </div>
      </div>

      <ProductList filteredAndSortedProducts={product} />
    </div>
  )
}
