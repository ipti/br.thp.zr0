// Order/order.tsx com pedido de Encomenda (badge única no cabeçalho, passo
// "Em produção" na timeline, datas estimadas) e com pedido de Pronta
// Entrega (regressão: nenhuma badge/data de produção exibida).
import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import { Order } from '../order'
import { OrderOneType } from '@/app/profile/order/service/types'

const BASE_ORDER: OrderOneType = {
  id: 1,
  uid: 'ZR-202609-0001',
  user_fk: 1,
  total_amount: 500,
  notes: '',
  payment_status: 'PAID',
  payment_method: 'PIX',
  payment_intent_id: 'pi_1',
  sale_type: 'PRONTA_ENTREGA',
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
  user: {
    id: 1,
    email: 'escola@zr0.com',
    username: null,
    role: 'CUSTOMER',
    name: 'Escola Municipal',
    password: '',
    active: true,
    verify_email: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  order_delivery_address: {
    id: 1,
    name: null,
    phone: null,
    cep: '01000000',
    address: 'Rua das Flores',
    number: '100',
    complement: '',
    neighborhood: 'Centro',
    state_fk: 1,
    city_fk: 1,
    order_fk: 1,
    state: { id: 1, acronym: 'SP', name: 'São Paulo' },
    city: { id: 1, state_fk: 1, name: 'São Paulo', cep_initial: '', cep_final: '', ddd1: 11, ddd2: 11 },
  },
  order_services: [
    {
      id: 10,
      uid: 'OS-202609-0001',
      transformation_workshop_fk: 1,
      status: 'CONFIRMED',
      total_amount: 500,
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
      order_fk: 1,
      order_item: [
        {
          id: 100,
          order_fk: 1,
          product_fk: 1,
          variant_fk: null,
          quantity: 30,
          unit_price: 15,
          total_price: 450,
          delivery_estimate: {
            cost: 50,
            error: null,
            carrier: 'Correios',
            service: 'PAC',
            tracking: true,
            serviceCode: '1',
            deliveryTime: 5,
          },
          createdAt: '2026-09-01T00:00:00.000Z',
          updatedAt: '2026-09-01T00:00:00.000Z',
          order_service_fk: 10,
          product: {
            id: 1,
            uid: 'chair-uid-escola',
            name: 'Cadeira Escolar',
            description: 'Cadeira infantil de madeira',
            price: 15,
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
            category_fk: 1,
            weight: 5,
            height: 60,
            width: 40,
            length: 40,
            product_image: [],
          },
          variant: null,
        },
      ],
      transformation_workshop: {
        id: 1,
        name: 'OT A',
        cnpj: '00.000.000/0001-00',
        cep: '01000000',
        address: 'Rua das Oficinas',
        number: '1',
        complement: '',
        neighborhood: 'Industrial',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        state_fk: 1,
        city_fk: 1,
        state: { id: 1, acronym: 'SP', name: 'São Paulo' },
        city: { id: 1, state_fk: 1, name: 'São Paulo', cep_initial: '', cep_final: '', ddd1: 11, ddd2: 11 },
      },
    },
  ],
}

describe('Order — badge e timeline por tipo de venda', () => {
  it('pedido de Pronta Entrega: sem passo "Em produção" e sem datas estimadas (regressão)', () => {
    render(<Order order={BASE_ORDER} />)

    expect(screen.getByText('Pronta entrega')).toBeInTheDocument()
    expect(screen.queryByText('Em produção')).not.toBeInTheDocument()
    expect(screen.queryByText(/Produção estimada/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Entrega estimada:/)).not.toBeInTheDocument()
  })

  it('pedido de Encomenda: badge única no cabeçalho, passo "Em produção" e datas estimadas', () => {
    const encomendaOrder: OrderOneType = {
      ...BASE_ORDER,
      sale_type: 'ENCOMENDA',
      order_services: [
        {
          ...BASE_ORDER.order_services[0],
          status: 'IN_PRODUCTION',
          estimated_ready_at: '2026-09-10T12:00:00.000Z',
          estimated_delivery_at: '2026-09-15T12:00:00.000Z',
        },
      ],
    }

    render(<Order order={encomendaOrder} />)

    expect(screen.getAllByText('Sob encomenda')).toHaveLength(1)
    expect(screen.getByText('Em produção')).toBeInTheDocument()

    const estimatedDates = document.querySelector('.order-estimated-dates')
    expect(estimatedDates?.textContent).toContain('Produção estimada: 10/09/2026')
    expect(estimatedDates?.textContent).toContain('Entrega estimada: 15/09/2026')
  })
})
