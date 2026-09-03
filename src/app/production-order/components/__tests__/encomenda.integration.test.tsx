// Fluxo completo da jornada de Encomenda (quantidade -> simulação ->
// confirmação), cenário motivador da escola, nos dois modos de simulação.
// Isolado do carrinho: nunca usa useCartStore/useCartStepsStore.
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders, resetAllStores } from '@/test/test-utils'
import { ProductOne } from '@/app/seller/product/one/service/type'
import ProductionOrderSteps from '../components'
import { SCHOOL_PRODUCT_UID } from '@/test/fixtures/compra-por-encomenda'
import { CREATED_ORDER_SESSION_KEY } from '@/app/profile/order/constants'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const PRODUCT: ProductOne = {
  id: 1,
  uid: SCHOOL_PRODUCT_UID,
  name: 'Cadeira Escolar',
  description: 'Cadeira infantil de madeira',
  price: 250,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  category_fk: 1,
  weight: 5,
  height: 60,
  width: 40,
  length: 40,
  product_image: [{ id: 1, img_url: 'https://example.com/cadeira.png', order: 0, product_fk: 1 }],
  quantity: 20,
}

async function fillQuantityAndSubmit(quantity: number) {
  const input = screen.getByRole('spinbutton')
  await userEvent.clear(input)
  await userEvent.type(input, String(quantity))
  const zipCode = screen.getByPlaceholderText('Digite o CEP')
  await userEvent.clear(zipCode)
  await userEvent.type(zipCode, '01000-000')
  await userEvent.click(
    screen.getByRole('button', { name: 'Simular produção e entrega' })
  )
}

describe('Jornada de Encomenda — cenário motivador da escola', () => {
  beforeEach(() => {
    resetAllStores()
    document.cookie = 'access_token=test-token; path=/'
    mockPush.mockClear()
  })

  it.each([30, 50])(
    'completa quantidade -> simulação (modo custo) -> confirmação para %d unidades',
    async quantity => {
      renderWithProviders(<ProductionOrderSteps product={PRODUCT} />)

      await fillQuantityAndSubmit(quantity)

      expect(await screen.findByText('Menor custo')).toBeInTheDocument()
      expect(screen.getByText('Menor prazo')).toBeInTheDocument()

      await userEvent.click(screen.getByText('Menor custo'))

      expect(await screen.findByText('OT A')).toBeInTheDocument()
      expect(screen.getByText(/\d+ unidades nesta remessa/)).toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

      expect(
        await screen.findByText('Revise e confirme sua encomenda')
      ).toBeInTheDocument()
      expect(screen.getByText('Menor custo')).toBeInTheDocument()
    }
  )

  it('completa quantidade -> simulação (modo prazo, particionado entre OT A e OT B) -> confirmação', async () => {
    renderWithProviders(<ProductionOrderSteps product={PRODUCT} />)

    await fillQuantityAndSubmit(30)

    await userEvent.click(await screen.findByText('Menor prazo'))

    expect(await screen.findByText('OT A')).toBeInTheDocument()
    expect(screen.getByText('OT B')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(
      await screen.findByText('Revise e confirme sua encomenda')
    ).toBeInTheDocument()
    expect(screen.getByText('Menor prazo')).toBeInTheDocument()
  })

  it('confirma o pedido de ponta a ponta (reserve + create) e redireciona para /profile/order/[id]', async () => {
    renderWithProviders(<ProductionOrderSteps product={PRODUCT} />)

    await fillQuantityAndSubmit(30)
    await userEvent.click(await screen.findByText('Menor custo'))
    await screen.findByText('OT A')
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Continuar' })).toBeEnabled()
    )
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    const addressCard = await screen.findByText(/Rua das Flores/)
    await userEvent.click(addressCard)

    await userEvent.click(
      screen.getByRole('button', { name: 'Confirmar encomenda' })
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile/order/101')
    })
    expect(sessionStorage.getItem(CREATED_ORDER_SESSION_KEY)).toBe('101')
  })
})
