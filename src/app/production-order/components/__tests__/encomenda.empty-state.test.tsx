// Cenário `unavailable: true` (nenhuma OT com production_capacity.active=true
// para o produto) — deve renderizar ZEmptyState, nunca Swal.fire nem travar.
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw/server'
import { renderWithProviders, resetAllStores } from '@/test/test-utils'
import { ProductOne } from '@/app/seller/product/one/service/type'
import ProductionOrderSteps from '../components'

const PRODUCT: ProductOne = {
  id: 2,
  uid: 'product-sem-capacidade',
  name: 'Mesa Grande',
  description: 'Mesa de madeira maciça',
  price: 900,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  category_fk: 1,
  weight: 30,
  height: 75,
  width: 160,
  length: 80,
  product_image: [],
  quantity: 0,
}

describe('Jornada de Encomenda — produto sem capacidade de produção', () => {
  beforeEach(() => {
    resetAllStores()
    document.cookie = 'access_token=test-token; path=/'
  })

  it('renderiza ZEmptyState quando a simulação retorna unavailable=true, sem travar a navegação', async () => {
    server.use(
      http.post('/api/production-order/simulate', () =>
        HttpResponse.json({
          costPlan: { mode: 'COST', shipments: [], totalCost: 0, maxDeliveryAt: '' },
          deadlinePlan: { mode: 'DEADLINE', shipments: [], totalCost: 0, maxDeliveryAt: '' },
          unavailable: true,
        })
      )
    )

    renderWithProviders(<ProductionOrderSteps product={PRODUCT} />)

    const input = screen.getByRole('spinbutton')
    await userEvent.clear(input)
    await userEvent.type(input, '5')
    await userEvent.type(screen.getByPlaceholderText('Digite o CEP'), '01000-000')
    await userEvent.click(
      screen.getByRole('button', { name: 'Simular produção e entrega' })
    )

    expect(
      await screen.findByText('Sem capacidade de produção disponível')
    ).toBeInTheDocument()
    expect(
      screen.getByText(/não há oficina com capacidade de produção cadastrada/)
    ).toBeInTheDocument()

    // nunca deve travar a navegação: o botão "Voltar" do empty state funciona
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    expect(await screen.findByRole('spinbutton')).toBeInTheDocument()
  })
})
