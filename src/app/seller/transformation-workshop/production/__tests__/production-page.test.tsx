import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import ProductionPage from '../page'

expect.extend(toHaveNoViolations)

jest.mock('@/service/cookies', () => ({ getIdTw: () => '7' }))
jest.mock('@tanstack/react-query', () => ({
  useQuery: (key: string[]) => {
    if (key[0] === 'seller-production') {
      return {
        data: {
          data: [
            {
              id: 10,
              quantity: 50,
              produced_quantity: 18,
              production_status: 'IN_PROGRESS',
              date_start: '2026-08-10T12:00:00.000Z',
              date_end: '2026-09-10T12:00:00.000Z',
              createdAt: '2026-08-10T12:00:00.000Z',
              updatedAt: '2026-08-18T12:00:00.000Z',
              product: { id: 2, name: 'Cadeira escolar' },
              order_item: {
                order_service: {
                  id: 3,
                  uid: 'OS-202608-ABC',
                  status: 'IN_PRODUCTION',
                  estimated_ready_at: '2026-09-10T12:00:00.000Z',
                  order: {
                    id: 4,
                    uid: 'ZR-202608-XYZ',
                    sale_type: 'ENCOMENDA',
                    createdAt: '2026-08-10T12:00:00.000Z',
                    user: { id: 5, name: 'Escola Municipal' },
                  },
                },
              },
            },
          ],
          pagination: { page: 1, limit: 100, total: 1, totalPages: 1 },
        },
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
      }
    }

    return {
      data: {
        data: [
          {
            transformation_workshop_fk: 7,
            product_fk: 2,
            monthly_capacity: 100,
            active: true,
            product: { id: 2, name: 'Cadeira escolar' },
          },
        ],
        pagination: { page: 1, limit: 100, total: 1, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    }
  },
}))

describe('Painel de produção da OT', () => {
  it('mostra o pedido, o produzido, o faltante e a capacidade mensal', () => {
    render(<ProductionPage />)

    expect(screen.getByRole('heading', { name: 'Produção da OT' })).toBeInTheDocument()
    expect(screen.getByText('Pedido ZR-202608-XYZ · Escola Municipal')).toBeInTheDocument()
    expect(screen.getAllByText('32')).toHaveLength(2)
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('unidades/mês ativas')).toBeInTheDocument()
  })

  it('não apresenta violações automáticas de acessibilidade', async () => {
    const { container } = render(<ProductionPage />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('bloqueia uma quantidade produzida maior que a planejada', async () => {
    const user = userEvent.setup()
    render(<ProductionPage />)

    await user.click(screen.getByRole('button', { name: 'Atualizar' }))
    const input = screen.getByRole('spinbutton', { name: 'Quantidade já produzida' })
    await user.clear(input)
    await user.type(input, '51')
    await user.tab()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'O produzido não pode ultrapassar o total planejado.',
    )
    expect(screen.getByRole('button', { name: 'Salvar progresso' })).toBeDisabled()
  })
})
