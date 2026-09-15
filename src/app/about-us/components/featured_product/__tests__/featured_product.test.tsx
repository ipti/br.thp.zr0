import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders, resetAllStores } from '@/test/test-utils'
import { useCartStore } from '@/service/store/cart_store'
import FeaturedProduct from '../featured_product'
import type { ProductList } from '@/app/seller/product/type'

const showToast = jest.fn()

jest.mock('@/components/toast/hook/useToast', () => ({
  useToast: () => ({ showToast }),
}))

const buildProduct = (overrides: Partial<ProductList[number]> = {}): ProductList[number] => ({
  uid: 'uid-1',
  id: 1,
  name: 'Cadeira',
  description: 'Cadeira feita de plástico reciclado',
  price: 199.9,
  quantity: 5,
  category: { id: 1, name: 'Móveis', createdAt: '', updatedAt: '' },
  product_image: [{ id: 1, img_url: 'https://example.com/cadeira.png', order: 1, product_fk: 1 }],
  ...overrides,
})

const PRODUCTS: ProductList = [
  buildProduct({ uid: 'uid-1', name: 'Cadeira', price: 199.9, quantity: 5 }),
  buildProduct({ uid: 'uid-2', name: 'Mesa', price: 399.9, quantity: 0 }),
]

describe('FeaturedProduct', () => {
  beforeEach(() => {
    resetAllStores()
    showToast.mockClear()
  })

  it('ativa o primeiro produto e troca todos os dados ao selecionar outra miniatura', () => {
    renderWithProviders(<FeaturedProduct products={PRODUCTS} />)

    expect(screen.getByRole('heading', { name: 'Cadeira' })).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*199,90/)).toBeInTheDocument()

    const secondThumb = screen.getByRole('button', { name: 'Mesa' })
    expect(secondThumb).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(secondThumb)

    expect(screen.getByRole('heading', { name: 'Mesa' })).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*399,90/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Mais detalhes' })).toHaveAttribute(
      'href',
      '/product/uid-2'
    )
    expect(secondThumb).toHaveAttribute('aria-pressed', 'true')
  })

  it('adiciona uma unidade do produto ativo ao carrinho', () => {
    renderWithProviders(<FeaturedProduct products={PRODUCTS} />)

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar ao carrinho' }))

    expect(useCartStore.getState().cart).toEqual([
      { id: 'uid-1', name: 'Cadeira', price: 199.9, quantity: 1, image: 'https://example.com/cadeira.png' },
    ])
    expect(showToast).toHaveBeenCalledWith('Adicionado ao carrinho!', 'success', 1000)
  })

  it('envia o produto ativo, não o anteriormente selecionado', () => {
    renderWithProviders(<FeaturedProduct products={PRODUCTS} />)

    fireEvent.click(screen.getByRole('button', { name: 'Mesa' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cadeira' }))
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar ao carrinho' }))

    expect(useCartStore.getState().cart).toEqual([
      { id: 'uid-1', name: 'Cadeira', price: 199.9, quantity: 1, image: 'https://example.com/cadeira.png' },
    ])
  })

  it('impede adicionar produto sem estoque, mas mantém os detalhes acessíveis', () => {
    renderWithProviders(<FeaturedProduct products={PRODUCTS} />)

    fireEvent.click(screen.getByRole('button', { name: 'Mesa' }))

    const addButton = screen.getByRole('button', { name: 'Adicionar ao carrinho' })
    expect(addButton).toBeDisabled()

    fireEvent.click(addButton)
    expect(useCartStore.getState().cart).toEqual([])
    expect(screen.getByRole('link', { name: 'Mais detalhes' })).toBeEnabled()
  })

  it('impede nova adição quando o estoque já foi atingido pelo carrinho', () => {
    useCartStore.getState().addItem({
      id: 'uid-1',
      name: 'Cadeira',
      price: 199.9,
      quantity: 5,
      image: 'https://example.com/cadeira.png',
    })

    renderWithProviders(<FeaturedProduct products={PRODUCTS} />)

    const addButton = screen.getByRole('button', { name: 'Adicionar ao carrinho' })
    expect(addButton).toBeDisabled()

    fireEvent.click(addButton)
    expect(useCartStore.getState().cart).toEqual([
      { id: 'uid-1', name: 'Cadeira', price: 199.9, quantity: 5, image: 'https://example.com/cadeira.png' },
    ])
  })

  it('não renderiza painel quando a lista está vazia', () => {
    const { container } = renderWithProviders(<FeaturedProduct products={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('reseta a seleção quando o produto ativo deixa de existir na nova seleção de props', () => {
    const { rerender } = renderWithProviders(<FeaturedProduct products={PRODUCTS} />)

    fireEvent.click(screen.getByRole('button', { name: 'Mesa' }))
    expect(screen.getByRole('heading', { name: 'Mesa' })).toBeInTheDocument()

    rerender(<FeaturedProduct products={[PRODUCTS[0]]} />)

    expect(screen.getByRole('heading', { name: 'Cadeira' })).toBeInTheDocument()
  })
})
