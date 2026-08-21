import { Address } from '@/app/profile/address/service/type'
import { UserGlobal } from '@/service/global_request/type'
import { renderWithProviders, resetAllStores } from '@/test/test-utils'
import { useCartStore } from '@/service/store/cart_store'
import { useCartStepsStore } from '@/app/cart/zustand/zustand'
import { axe, toHaveNoViolations } from 'jest-axe'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Finish from '../finish/finish'
import CardAddress from '../card_address/card_address'
import { CardDelivery } from '../delivery/card_delivery'
import CartComponent from '../components'

expect.extend(toHaveNoViolations)

const address = {
  id: 10,
  name: 'Cliente Teste',
  phone: '(11) 99999-9999',
  cep: '01234-567',
  address: 'Rua Teste',
  number: '100',
  complement: '',
  neighborhood: 'Centro',
  city: { id: 20, name: 'São Paulo' },
  state: { id: 30, acronym: 'SP' }
} as Address

const user = {
  id: 7,
  name: 'Cliente Teste',
  email: 'cliente@example.com',
  customer: {
    id: 8,
    phone: '(11) 99999-9999',
    cpf: '529.982.247-25',
    cnpj: ''
  }
} as UserGlobal

const mockCreateOrder = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams()
}))

jest.mock('@/service/global_request/query', () => ({
  useFetchUserToken: () => ({ data: user, isLoading: false })
}))

jest.mock('@/app/cart/service/query', () => ({
  useFetchAddressOneRequest: () => ({ data: address, isLoading: false })
}))

jest.mock('@/app/cart/service/controller', () => ({
  CartController: () => ({ CreateOrder: mockCreateOrder })
}))

describe('acessibilidade do checkout', () => {
  beforeEach(() => {
    mockCreateOrder.mockClear()
    resetAllStores()
    useCartStore.getState().setCart([{
      id: 'chair',
      name: 'Cadeira',
      price: 200,
      quantity: 2,
      image: ''
    }])
    useCartStepsStore.getState().updateCartSteps({
      cep: address.cep,
      address_selected: address.id,
      product_selected: ['chair'],
      deliverySelected: [{
        productId: 'chair',
        productName: 'Cadeira',
        workshopName: 'Oficina',
        workshopId: 5,
        quantity: 2,
        validOptions: {
          carrier: 'Transportadora',
          service: 'Normal',
          serviceCode: 'normal',
          cost: 30,
          deliveryTime: 5,
          tracking: true,
          error: null
        }
      }]
    })
  })

  it('usa apenas um rádio acessível em cada card de endereço', async () => {
    const selection = jest.fn()
    const { container } = renderWithProviders(
      <div role="radiogroup" aria-label="Endereços">
        <CardAddress item={address} setFieldValue={selection} />
      </div>
    )

    const radio = screen.getByRole('radio', { name: /rua teste/i })
    expect(screen.getAllByRole('radio')).toHaveLength(1)
    await userEvent.click(radio)
    expect(selection).toHaveBeenCalledWith('address_selected', address.id)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('mantém um único landmark principal externo e anuncia a etapa atual', async () => {
    useCartStore.getState().setCart([])
    const { container } = renderWithProviders(<CartComponent />)

    const stageHeading = await screen.findByRole('heading', { name: 'Seu carrinho' })
    expect(container.querySelectorAll('main')).toHaveLength(0)
    await waitFor(() => {
      expect(container.querySelector('[aria-current="step"]')).toHaveTextContent('1')
    })
    expect(screen.getByRole('link', { name: /2\s*Endereço/i })).toHaveAttribute('aria-disabled', 'true')
    expect(stageHeading).toHaveFocus()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('expõe pagamento como opções visíveis, campos nomeados e ações de edição', async () => {
    const { container } = renderWithProviders(
      <Finish handleActiveIndex={jest.fn()} handleSetOrders={jest.fn()} />
    )

    expect(screen.getByRole('heading', { name: 'Revise e confirme' })).toBeInTheDocument()
    expect(screen.getByLabelText('Cupom de desconto')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /PIX/i })).toBeChecked()
    expect(screen.getByRole('radio', { name: /Cartão de crédito/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Boleto/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar endereço' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar produtos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar entregas' })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('bloqueia envio duplicado do pedido na interface', async () => {
    renderWithProviders(
      <Finish handleActiveIndex={jest.fn()} handleSetOrders={jest.fn()} />
    )

    const finishButton = screen.getByRole('button', { name: 'Finalizar pedido' })
    await userEvent.dblClick(finishButton)
    expect(mockCreateOrder).toHaveBeenCalledTimes(1)
  })

  it('expõe cada opção de entrega como um único rádio nomeado', async () => {
    const setShippingSelect = jest.fn()
    const handleSelectOptions = jest.fn(value => [value])
    const { container } = renderWithProviders(
      <CardDelivery
        shippingItem={{
          productId: 'chair',
          productName: 'Cadeira',
          workshopId: 5,
          workshopName: 'Oficina',
          quantity: 2,
          result: {
            bestOption: {} as never,
            validOptions: [
              {
                carrier: 'Transportadora A',
                service: 'Normal',
                serviceCode: 'normal',
                cost: 30,
                deliveryTime: 5,
                tracking: true,
                error: null
              },
              {
                carrier: 'Transportadora B',
                service: 'Expresso',
                serviceCode: 'express',
                cost: 50,
                deliveryTime: 2,
                tracking: true,
                error: null
              }
            ]
          }
        }}
        shippingSelect={[]}
        setShippingSelect={setShippingSelect}
        handleSelectOptions={handleSelectOptions}
      />
    )

    expect(screen.getAllByRole('radio')).toHaveLength(2)
    await userEvent.click(screen.getByRole('radio', { name: /Transportadora B/i }))
    expect(setShippingSelect).toHaveBeenCalled()
    expect(await axe(container)).toHaveNoViolations()
  })
})
