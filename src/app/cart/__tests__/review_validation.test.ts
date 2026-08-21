import { Address } from '@/app/profile/address/service/type'
import { UserGlobal } from '@/service/global_request/type'
import { CartItem } from '@/service/store/type'
import { validateCheckoutReview } from '../review_validation'
import { DeliverySelectedType } from '../zustand/zustand'

const user = {
  id: 7,
  name: 'Cliente Teste',
  email: 'cliente@example.com',
  customer: {
    phone: '(11) 99999-9999',
    cpf: '529.982.247-25',
    cnpj: ''
  }
} as UserGlobal

const address = {
  id: 10,
  name: 'Cliente Teste',
  phone: '(11) 99999-9999',
  cep: '01234-567',
  address: 'Rua Teste',
  number: '100',
  complement: '',
  neighborhood: 'Centro',
  city: { id: 20 },
  state: { id: 30 }
} as Address

const items: CartItem[] = [
  { id: 'chair', name: 'Cadeira', price: 200, quantity: 2, image: '' }
]

const deliveries = [{
  productId: 'chair',
  productName: 'Cadeira',
  workshopName: 'Oficina',
  workshopId: 5,
  quantity: 2,
  validOptions: {
    carrier: 'Transportadora',
    service: 'Normal',
    serviceCode: '1',
    cost: 30,
    deliveryTime: 5,
    tracking: true,
    error: null
  }
}] as DeliverySelectedType[]

const validInput = {
  user,
  address,
  selectedAddressId: address.id,
  items,
  deliveries,
  paymentMethod: 'PIX',
  couponDiscount: 10,
  orderTotal: 430
}

describe('validação da revisão do checkout', () => {
  it('aceita um pedido com todos os dados obrigatórios', () => {
    expect(validateCheckoutReview(validInput)).toEqual([])
  })

  it('bloqueia dados pessoais e endereço incompletos', () => {
    const errors = validateCheckoutReview({
      ...validInput,
      user: { ...user, email: 'invalido', customer: { ...user.customer, phone: '', cpf: '', cnpj: '' } },
      address: { ...address, cep: '', number: '' }
    })

    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('nome e e-mail'),
      expect.stringContaining('telefone'),
      expect.stringContaining('CPF ou CNPJ'),
      expect.stringContaining('endereço')
    ]))
  })

  it('bloqueia entrega ausente, divergente ou duplicada', () => {
    const missing = validateCheckoutReview({ ...validInput, deliveries: [] })
    const wrongQuantity = validateCheckoutReview({
      ...validInput,
      deliveries: [{ ...deliveries[0], quantity: 1 }]
    })
    const duplicated = validateCheckoutReview({
      ...validInput,
      deliveries: [deliveries[0], deliveries[0]]
    })

    expect(missing).toContain('Escolha uma entrega válida para todos os produtos selecionados.')
    expect(wrongQuantity).toContain('Escolha uma entrega válida para todos os produtos selecionados.')
    expect(duplicated).toContain('Escolha uma entrega válida para todos os produtos selecionados.')
  })

  it('bloqueia carrinho, pagamento, total e desconto inválidos', () => {
    expect(validateCheckoutReview({
      ...validInput,
      items: [],
      deliveries: [],
      paymentMethod: 'DINHEIRO',
      couponDiscount: 500,
      orderTotal: 430
    })).toEqual(expect.arrayContaining([
      expect.stringContaining('produto'),
      expect.stringContaining('entrega'),
      expect.stringContaining('método de pagamento'),
      expect.stringContaining('desconto')
    ]))
  })
})
