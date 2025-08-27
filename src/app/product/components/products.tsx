import './product.css'
import { ProductFilters } from './product_filter/product_filter';
export default function Products() {
  return (
    <div>
      <div className="text-center py-4 px-6 mb-16 fade-up">
        <h1 className="text-3xl sm:text-4xl mb-6">Nossos Produtos</h1>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
          Explore as últimas tendências em design de interiores com nossa
          coleção cuidadosamente selecionada. Cada peça é design para
          transformar sua casa em um espaço único. Incorporamos peças
          emocionantes que não devem ser apenas pela sua excepcional artesania,
          mas também pelo seu compromisso com o meio ambiente.
        </p>
      </div>
      {/* <ProductFilters categories={[]} selectedCategory='' searchTerm='' sortBy='' onCategoryChange={()=> {}} onSearchChange={() => {}} onSortChange={() => {}} /> */}
    </div>
  );
}
