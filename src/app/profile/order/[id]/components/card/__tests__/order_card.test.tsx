import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import OrderCard from '../card'
import type { OrderOneType } from '@/app/profile/order/service/types'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('@/app/profile/order/service/controller', () => ({
  OrderController: () => ({ OrderUpdateAction: jest.fn() }),
}))

function makeOrder(overrides: Partial<OrderOneType> = {}): OrderOneType {
  return {
    id: 34,
    uid: 'ZR-34',
    user_fk: 1,
    total_amount: 519.13,
    notes: '',
    payment_status: 'PENDING',
    payment_method: 'PIX',
    payment_intent_id: '',
    sale_type: 'PRONTA_ENTREGA',
    createdAt: '2026-09-22T10:26:00.000Z',
    updatedAt: '2026-09-22T10:26:00.000Z',
    user: {
      id: 1,
      email: 'cliente@example.com',
      username: null,
      role: 'CUSTOMER',
      name: 'Cliente Teste',
      password: '',
      active: true,
      verify_email: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    order_services: [
      {
        id: 1,
        uid: 'OS-202609-CHAIR',
        transformation_workshop_fk: 1,
        status: 'PENDING',
        total_amount: 519.13,
        createdAt: '2026-09-22T10:26:00.000Z',
        updatedAt: '2026-09-22T10:26:00.000Z',
        order_fk: 34,
        order_item: [],
        transformation_workshop: {
          id: 1,
          name: 'Oficina de Aracaju',
          cnpj: '',
          cep: '',
          address: '',
          number: '',
          complement: '',
          neighborhood: '',
          createdAt: '',
          updatedAt: '',
          state_fk: 1,
          city_fk: 1,
          state: { id: 1, acronym: 'SE', name: 'Sergipe' },
          city: { id: 1, name: 'Aracaju' },
        },
      },
    ],
    order_delivery_address: {
      id: 1,
      name: 'Cliente Teste',
      phone: '(11) 99999-9999',
      cep: '01234-567',
      address: 'Rua Teste',
      number: '100',
      complement: '',
      neighborhood: 'Centro',
      state_fk: 1,
      city_fk: 1,
      order_fk: 34,
      state: { id: 1, acronym: 'SP', name: 'São Paulo' },
      city: { id: 1, name: 'São Paulo' },
    },
    ...overrides,
  } as unknown as OrderOneType
}

describe('OrderCard — modo WhatsApp (paymentEnabled=false)', () => {
  it('mostra "Aguardando contato" no lugar de "Pagamento pendente"', () => {
    renderWithProviders(
      <OrderCard order={makeOrder()} paymentEnabled={false} whatsappNumber="5511999999999" />
    )

    expect(screen.getAllByText('Aguardando contato').length).toBeGreaterThan(0)
    expect(screen.queryByText('Pagamento pendente')).toBeNull()
  })

  it('exibe o callout de destaque pedindo contato via WhatsApp', () => {
    renderWithProviders(
      <OrderCard order={makeOrder()} paymentEnabled={false} whatsappNumber="5511999999999" />
    )

    expect(
      screen.getByText('Para continuar, fale com a gente no WhatsApp')
    ).toBeInTheDocument()
  })

  it('não exibe os botões de pagamento online', () => {
    renderWithProviders(
      <OrderCard order={makeOrder()} paymentEnabled={false} whatsappNumber="5511999999999" />
    )

    expect(screen.queryByRole('button', { name: 'Pagar agora' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Realizar pagamento' })).toBeNull()
  })

  it('exibe os CTAs de WhatsApp como botões (abrem via window.open, não <a>)', () => {
    renderWithProviders(
      <OrderCard order={makeOrder()} paymentEnabled={false} whatsappNumber="5511999999999" />
    )

    expect(screen.queryAllByRole('link', { name: /whatsapp/i })).toHaveLength(0)

    const ctaButtons = screen.getAllByRole('button', { name: /whatsapp/i })
    expect(ctaButtons.length).toBeGreaterThan(0)
  })

  it('não mostra o callout quando o pedido já está pago', () => {
    renderWithProviders(
      <OrderCard
        order={makeOrder({ payment_status: 'PAID' })}
        paymentEnabled={false}
        whatsappNumber="5511999999999"
      />
    )

    expect(screen.queryByText('Para continuar, fale com a gente no WhatsApp')).toBeNull()
  })
})

describe('OrderCard — modo pagamento online (paymentEnabled=true)', () => {
  it('mantém o comportamento original: "Pagamento pendente" e botão "Pagar agora"', () => {
    renderWithProviders(
      <OrderCard order={makeOrder()} paymentEnabled whatsappNumber="" />
    )

    expect(screen.getAllByText('Pagamento pendente').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: 'Pagar agora' }).length).toBeGreaterThan(0)
    expect(screen.queryByText('Para continuar, fale com a gente no WhatsApp')).toBeNull()
  })
})
