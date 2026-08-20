import { render, screen } from '@testing-library/react'
import PaymentComponent from '../payment'

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('id=34'),
}))

jest.mock('@/components/payment/payment', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('../../service/query', () => ({
  useFetchRequestOrderOne: () => ({
    data: {
      id: 34,
      uid: 'ZR-202608-TESTE',
      total_amount: 1000,
      payment_status: 'PENDING',
      payment_method: 'PIX',
      sale_type: 'ENCOMENDA',
      order_services: [
        {
          id: 1,
          uid: 'OS-202608-TESTE',
          total_amount: 1000,
          estimated_ready_at: '2026-08-28T12:00:00.000Z',
          estimated_delivery_at: '2026-08-31T12:00:00.000Z',
          order_item: [
            {
              id: 1,
              quantity: 5,
              unit_price: 200,
              total_price: 1000,
              delivery_estimate: null,
              product: { name: 'Cadeira' },
            },
          ],
        },
      ],
    },
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  }),
  useFetchRequestPaymentIntentOne: () => ({
    data: undefined,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  }),
}))

describe('Pagamento de pedido sob encomenda', () => {
  it('exibe os prazos do serviço quando o item não possui delivery_estimate', () => {
    render(<PaymentComponent />)

    expect(screen.getByText('Produção sob encomenda', { exact: false })).toHaveTextContent(
      'Produção sob encomenda · pronta em 28/08/2026 · entrega estimada em 31/08/2026',
    )
    expect(screen.getByText('Cadeira')).toBeInTheDocument()
  })
})
