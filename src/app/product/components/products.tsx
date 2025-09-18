import { apiUrl } from '@/service/url_api';
import './product.css'
import { ProductFilters } from './product_filter/product_filter';
import ProductList from './product_list/product_list';
export default async function Products() {

    const res = await fetch(`${apiUrl}product`, {
      next: { revalidate: 60 }, // tira cache: "no-store"
    });
  
    // if (!res.ok) {
    //   throw new Error("Erro ao buscar produtos");
    // }
  

  const product = await res.json();

  return (
    <div>
      <div className="text-center py-4 px-6 mb-16 fade-up">
        <h1 className="text-3xl sm:text-4xl mb-6">Nossos Produtos</h1>
        <p className="text-gray-600 w-6 mx-auto leading-relaxed">
          Explore as últimas tendências em design de interiores com nossa
          coleção cuidadosamente selecionada. Cada peça é design para
          transformar sua casa em um espaço único. Incorporamos peças
          emocionantes que não devem ser apenas pela sua excepcional artesania,
          mas também pelo seu compromisso com o meio ambiente.
        </p>
      </div>
      <ProductFilters categories={[]} selectedCategory='' searchTerm='' sortBy='' />
      <p className='py-4'>
        {product?.length} produtos encontrados
      </p>
      <ProductList filteredAndSortedProducts={product} />
    </div>
  );
}
