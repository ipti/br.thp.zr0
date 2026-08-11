// Regressão do carrinho de Pronta Entrega, isolado da jornada de Encomenda:
// comportamento observável idêntico ao pré-feature (carrinho vazio, item
// exibido/removido, total calculado), sem nenhuma referência a
// useProductionOrderStore.
import { screen } from '@testing-library/react'
import { renderWithProviders, resetAllStores } from '@/test/test-utils'
import { useCartStore } from '@/service/store/cart_store'
import { useCartStepsStore } from '@/app/cart/zustand/zustand'
import CartComponent from '../components'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('Carrinho de Pronta Entrega — regressão', () => {
  beforeEach(() => {
    resetAllStores()
  })

  it('exibe "Seu carrinho está vazio." quando não há itens selecionados', async () => {
    renderWithProviders(<CartComponent />)

    expect(await screen.findByText('Seu carrinho está vazio.')).toBeInTheDocument()
  })

  it('exibe os itens do carrinho e calcula o total dos itens selecionados', async () => {
    useCartStore.getState().setCart([
      {
        id: 'chair-uid-escola',
        name: 'Cadeira Escolar',
        price: 15,
        quantity: 30,
        image: 'https://example.com/cadeira.png',
      },
    ])
    useCartStepsStore.getState().updateCartSteps({
      product_selected: ['chair-uid-escola'],
    } as never)

    renderWithProviders(<CartComponent />)

    expect(await screen.findByText('Cadeira Escolar')).toBeInTheDocument()
    expect(screen.queryByText('Seu carrinho está vazio.')).not.toBeInTheDocument()
  })

  it('a jornada de Encomenda não é acionada nem referenciada pelo carrinho', () => {
    renderWithProviders(<CartComponent />)

    expect(screen.queryByText('Comprar sob encomenda')).not.toBeInTheDocument()
    expect(screen.queryByText('Sob encomenda')).not.toBeInTheDocument()
  })
})
