import { ProductOne } from '@/app/seller/product/one/service/type'
import { renderWithProviders, resetAllStores } from '@/test/test-utils'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuantityForm from '../quantity_form'
import { useProductionOrderStore } from '../../zustand/zustand'

jest.mock('@/components/header/login/login_modal', () => ({
  __esModule: true,
  default: ({ visible }: { visible: boolean }) =>
    visible ? <div role="dialog">Faça login para continuar</div> : null,
}))

const PRODUCT: ProductOne = {
  id: 1,
  uid: 'mesa-alta',
  name: 'Mesa alta',
  description: 'Mesa sustentável',
  price: 700,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  category_fk: 1,
  weight: 20,
  height: 100,
  width: 80,
  length: 80,
  product_image: [],
  quantity: 0,
}

describe('Autenticação da simulação de encomenda', () => {
  beforeEach(() => {
    resetAllStores()
    document.cookie = 'access_token=; Max-Age=0; path=/'
  })

  it('solicita login e não avança para a simulação sem sessão', async () => {
    const user = userEvent.setup()
    const handleActiveIndex = jest.fn()
    renderWithProviders(
      <QuantityForm
        product={PRODUCT}
        handleActiveIndex={handleActiveIndex}
      />,
    )

    const simulateButton = await screen.findByRole('button', {
      name: 'Entrar para simular',
    })
    const quantity = screen.getByRole('spinbutton', {
      name: 'Quantidade desejada',
    })
    await user.clear(quantity)
    await user.type(quantity, '2')
    await user.type(screen.getByPlaceholderText('Digite o CEP'), '49039-022')
    await user.click(simulateButton)

    expect(
      await screen.findByRole('dialog', { name: '' }),
    ).toHaveTextContent('Faça login para continuar')
    expect(handleActiveIndex).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(useProductionOrderStore.getState().productionOrder).toMatchObject({
        productId: 'mesa-alta',
        desiredQuantity: 2,
        destinationZipCode: '49039022',
      }),
    )
  })
})
