import { Address } from '@/app/profile/address/service/type'
import { UserGlobal } from '@/service/global_request/type'
import { renderWithProviders, resetAllStores } from '@/test/test-utils'
import { useCartStore } from '@/service/store/cart_store'
import { useCartStepsStore } from '@/app/cart/zustand/zustand'
import { axe, toHaveNoViolations } from 'jest-axe'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Finish from '../finish/finish'
import CardAddress from '../card_address/card_address'
import { CardDelivery } from '../delivery/card_delivery'
import CartComponent from '../components'
import { CREATED_ORDER_SESSION_KEY } from '@/app/profile/order/constants'

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
const mockPush = jest.fn()
const mockReplace = jest.fn()
let mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useSearchParams: () => mockSearchParams
}))

jest.mock('@/app/auth/login/service/request', () => ({
  GetMyCartRequest: () => Promise.resolve({ data: { items: [] } })
}))

jest.mock('@/service/global_request/query', () => ({
  useFetchUserToken: () => ({ data: user, isLoading: false })
}))

jest.mock('@/app/cart/service/query', () => ({
  useFetchAddressOneRequest: () => ({ data: address, isLoading: false }),
  useFetchProductOneQuantity: () => ({
    data: { quantity: 10 },
    isLoading: false,
    isError: false,
    refetch: jest.fn()
  })
}))

jest.mock('@/app/cart/service/controller', () => ({
  CartController: () => ({ CreateOrder: mockCreateOrder })
}))

describe('acessibilidade do checkout', () => {
  beforeEach(() => {
    mockCreateOrder.mockClear()
    mockPush.mockClear()
    mockReplace.mockClear()
    mockSearchParams = new URLSearchParams()
    sessionStorage.clear()
    localStorage.removeItem('token-zr0')
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
    const { container } = renderWithProviders(<CartComponent paymentEnabled whatsappNumber="" />)

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
      <Finish handleActiveIndex={jest.fn()} handleSetOrders={jest.fn()} paymentEnabled whatsappNumber="" />
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
      <Finish handleActiveIndex={jest.fn()} handleSetOrders={jest.fn()} paymentEnabled whatsappNumber="" />
    )

    const finishButton = screen.getByRole('button', { name: 'Finalizar pedido' })
    await userEvent.dblClick(finishButton)
    expect(mockCreateOrder).toHaveBeenCalledTimes(1)
  })

  it('com paymentEnabled=false, cria o pedido normalmente e também abre o WhatsApp com o resumo', async () => {
    const replace = jest.fn()
    const popup = {
      opener: window,
      closed: false,
      location: { replace },
      close: jest.fn(),
    } as unknown as Window
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => popup)
    const handleSetOrders = jest.fn()

    renderWithProviders(
      <Finish
        handleActiveIndex={jest.fn()}
        handleSetOrders={handleSetOrders}
        paymentEnabled={false}
        whatsappNumber="5511999999999"
      />
    )

    const button = screen.getByRole('button', { name: 'Finalizar pelo WhatsApp' })
    await userEvent.click(button)

    expect(mockCreateOrder).toHaveBeenCalledTimes(1)
    expect(openSpy).toHaveBeenCalledWith('about:blank', '_blank')
    expect(replace).not.toHaveBeenCalled()

    const successAction = mockCreateOrder.mock.calls[0][2] as (
      orders: { id: number; uid: string }[]
    ) => void
    act(() => successAction([{ id: 34, uid: 'ZR-34' }]))

    expect(openSpy).toHaveBeenCalledTimes(1)
    expect(popup.opener).toBeNull()
    expect(replace).toHaveBeenCalledTimes(1)
    const [url] = replace.mock.calls[0]
    expect(url).toContain('https://wa.me/5511999999999?text=')

    const message = decodeURIComponent(String(url).split('?text=')[1])
    expect(message).toContain('Pedido #ZR-34')
    expect(message).toContain('Cadeira (x2)')
    expect(message).toContain('Entrega: Rua Teste, 100 - Centro, São Paulo/SP - CEP 01234-567')

    expect(handleSetOrders).toHaveBeenCalledWith([{ id: 34, uid: 'ZR-34' }])

    openSpy.mockRestore()
  })

  it('fecha a aba reservada se o pedido de pronta entrega falhar', async () => {
    const popup = {
      opener: window,
      closed: false,
      location: { replace: jest.fn() },
      close: jest.fn(),
    } as unknown as Window
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => popup)

    renderWithProviders(
      <Finish
        handleActiveIndex={jest.fn()}
        handleSetOrders={jest.fn()}
        paymentEnabled={false}
        whatsappNumber="5511999999999"
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'Finalizar pelo WhatsApp' }))
    const errorAction = mockCreateOrder.mock.calls[0][3] as (message: string) => void
    act(() => errorAction('Falha ao salvar'))

    expect(popup.close).toHaveBeenCalledTimes(1)
    expect(popup.location.replace).not.toHaveBeenCalled()
    openSpy.mockRestore()
  })

  it('redireciona a pronta entrega para o pagamento do pedido criado', async () => {
    localStorage.setItem('token-zr0', 'test-token')
    mockSearchParams = new URLSearchParams('index=3')
    renderWithProviders(<CartComponent paymentEnabled whatsappNumber="" />)

    await screen.findByRole('heading', { name: 'Revise e confirme' })
    await userEvent.click(screen.getByRole('button', { name: 'Finalizar pedido' }))

    const successAction = mockCreateOrder.mock.calls[0][2] as (
      orders: { id: number; uid: string }[]
    ) => void
    act(() => successAction([{ id: 34, uid: 'ZR-34' }]))

    expect(sessionStorage.getItem(CREATED_ORDER_SESSION_KEY)).toBe('34')
    expect(mockPush).toHaveBeenCalledWith('/payment?id=34')
  })

  it('com paymentEnabled=false, redireciona o pedido criado para o acompanhamento em vez do pagamento', async () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
    localStorage.setItem('token-zr0', 'test-token')
    mockSearchParams = new URLSearchParams('index=3')
    renderWithProviders(<CartComponent paymentEnabled={false} whatsappNumber="5511999999999" />)

    await screen.findByRole('heading', { name: 'Revise e confirme' })
    await userEvent.click(screen.getByRole('button', { name: 'Finalizar pelo WhatsApp' }))

    const successAction = mockCreateOrder.mock.calls[0][2] as (
      orders: { id: number; uid: string }[]
    ) => void
    act(() => successAction([{ id: 34, uid: 'ZR-34' }]))

    expect(sessionStorage.getItem(CREATED_ORDER_SESSION_KEY)).toBe('34')
    expect(mockPush).toHaveBeenCalledWith('/profile/order/34')
    expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('/payment'))

    openSpy.mockRestore()
  })

  it('não volta para o carrinho quando o pedido esvazia o carrinho antes do redirecionamento', async () => {
    localStorage.setItem('token-zr0', 'test-token')
    mockSearchParams = new URLSearchParams('index=3')
    renderWithProviders(<CartComponent paymentEnabled whatsappNumber="" />)

    await screen.findByRole('heading', { name: 'Revise e confirme' })
    await userEvent.click(screen.getByRole('button', { name: 'Finalizar pedido' }))

    const successAction = mockCreateOrder.mock.calls[0][2] as (
      orders: { id: number; uid: string }[]
    ) => void

    // Reproduz a ordem real do controller: o item comprado sai do carrinho
    // antes do callback de sucesso navegar para o pagamento.
    act(() => {
      useCartStore.getState().removeItem('chair')
      successAction([{ id: 34, uid: 'ZR-34' }])
    })

    expect(mockPush).toHaveBeenCalledWith('/payment?id=34')
    expect(mockReplace).not.toHaveBeenCalledWith('/cart?index=0')
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
