// Handlers do MSW cobrindo o carrinho de Pronta Entrega existente e os três
// endpoints novos da jornada de Encomenda. Nenhum teste depende de rede real.
import { http, HttpResponse } from 'msw'
import {
  SCHOOL_PRODUCT_UID,
  buildSchoolSimulation,
  SCHOOL_RESERVE_RESULT,
  SCHOOL_CREATE_RESULT,
} from '../fixtures/compra-por-encomenda'

const USER = { id: 1, name: 'Cliente Escola', email: 'escola@zr0.com' }

const ADDRESS = {
  id: 1,
  name: 'Escola Municipal',
  phone: '11999999999',
  cep: '01000000',
  address: 'Rua das Flores',
  number: '100',
  complement: '',
  neighborhood: 'Centro',
  is_default: true,
  state_fk: 1,
  city_fk: 1,
  customer_fk: 1,
  city: { id: 1, state_fk: 1, name: 'São Paulo', cep_initial: '', cep_final: '', ddd1: 11, ddd2: 11 },
  state: { id: 1, acronym: 'SP', name: 'São Paulo' },
}

export const handlers = [
  // Carrinho de Pronta Entrega (existente)
  http.get('/api/cart/me/items', () => HttpResponse.json({ items: [] })),
  http.get('/api/user-bff/token', () => HttpResponse.json(USER)),
  http.get('/api/user-bff/address-custumer', () =>
    HttpResponse.json({ customer: { address_customer: [ADDRESS] } })
  ),
  http.get('/api/address-customer/:id', () => HttpResponse.json(ADDRESS)),
  http.post('/api/shipping/calculate', () => HttpResponse.json([])),
  http.get('/api/product-bff/quantity/:id', () => HttpResponse.json({ quantity: 50 })),
  http.post('/api/checkout/reserve', () =>
    HttpResponse.json({ expiresAt: new Date().toISOString() })
  ),
  http.post('/api/orders', () =>
    HttpResponse.json({
      message: 'Pedidos criados com sucesso!',
      orders: [{ id: 1, uid: 'ZR-202609-0001' }],
    })
  ),

  // Jornada de Encomenda (nova)
  http.post('/api/production-order/simulate', async ({ request }) => {
    const body = (await request.json()) as {
      productId: string
      quantity: number
      destinationZipCode: string
    }
    if (body.productId !== SCHOOL_PRODUCT_UID) {
      return HttpResponse.json({ unavailable: true })
    }
    return HttpResponse.json(buildSchoolSimulation(body.quantity))
  }),
  http.post('/api/production-order/reserve', () =>
    HttpResponse.json(SCHOOL_RESERVE_RESULT)
  ),
  http.post('/api/production-order', () => HttpResponse.json(SCHOOL_CREATE_RESULT)),
]
