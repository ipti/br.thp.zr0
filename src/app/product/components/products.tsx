import { getProducts } from '@/app/middleware/producs_list'
import ProductList from './product_list/product_list'

import './product.css'
export default async function Products() {
  const product = await getProducts()

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
      </div>

      <ProductList filteredAndSortedProducts={product} />
    </div>
  )
}
