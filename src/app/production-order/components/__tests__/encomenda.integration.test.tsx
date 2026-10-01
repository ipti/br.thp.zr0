// Fluxo completo da jornada de Encomenda (quantidade -> simulação ->
// confirmação), cenário motivador da escola, nos dois modos de simulação.
// Isolado do carrinho: nunca usa useCartStore/useCartStepsStore.
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders, resetAllStores } from '@/test/test-utils'
import { ProductOne } from '@/app/seller/product/one/service/type'
import ProductionOrderSteps from '../components'
import { SCHOOL_PRODUCT_UID } from '@/test/fixtures/compra-por-encomenda'
import { CREATED_ORDER_SESSION_KEY } from '@/app/profile/order/constants'
import { server } from '@/test/msw/server'
import { http, HttpResponse } from 'msw'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const PRODUCT: ProductOne = {
  id: 1,
  uid: SCHOOL_PRODUCT_UID,
  name: 'Cadeira Escolar',
  description: 'Cadeira infantil de madeira',
  price: 250,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  category_fk: 1,
  weight: 5,
  height: 60,
  width: 40,
  length: 40,
  product_image: [{ id: 1, img_url: 'https://example.com/cadeira.png', order: 0, product_fk: 1 }],
  quantity: 20,
}

async function fillQuantityAndSubmit(quantity: number) {
  const input = screen.getByRole('spinbutton')
  await userEvent.clear(input)
  await userEvent.type(input, String(quantity))
  const zipCode = screen.getByPlaceholderText('Digite o CEP')
  await userEvent.clear(zipCode)
  await userEvent.type(zipCode, '01000-000')
  await userEvent.click(
    screen.getByRole('button', { name: 'Simular produção e entrega' })
  )
}

describe('Jornada de Encomenda — cenário motivador da escola', () => {
  beforeEach(() => {
    resetAllStores()
    sessionStorage.clear()
    document.cookie = 'access_token=test-token; path=/'
    mockPush.mockClear()
  })

  it.each([30, 50])(
    'completa quantidade -> simulação (modo custo) -> confirmação para %d unidades',
    async quantity => {
      renderWithProviders(<ProductionOrderSteps product={PRODUCT} paymentEnabled whatsappNumber="" />)

      await fillQuantityAndSubmit(quantity)

      expect(await screen.findByText('Menor custo')).toBeInTheDocument()
      expect(screen.getByText('Menor prazo')).toBeInTheDocument()

      await userEvent.click(screen.getByText('Menor custo'))

      expect(await screen.findByText('OT A')).toBeInTheDocument()
      expect(screen.getByText(/\d+ unidades nesta remessa/)).toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

      expect(
        await screen.findByText('Revise e confirme sua encomenda')
      ).toBeInTheDocument()
      expect(screen.getByText('Menor custo')).toBeInTheDocument()
    }
  )

  it('completa quantidade -> simulação (modo prazo, particionado entre OT A e OT B) -> confirmação', async () => {
    renderWithProviders(<ProductionOrderSteps product={PRODUCT} paymentEnabled whatsappNumber="" />)

    await fillQuantityAndSubmit(30)

    await userEvent.click(await screen.findByText('Menor prazo'))

    expect(await screen.findByText('OT A')).toBeInTheDocument()
    expect(screen.getByText('OT B')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(
      await screen.findByText('Revise e confirme sua encomenda')
    ).toBeInTheDocument()
    expect(screen.getByText('Menor prazo')).toBeInTheDocument()
  })

  it('confirma a encomenda e só abre o WhatsApp depois de redirecionar para os detalhes', async () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
    renderWithProviders(<ProductionOrderSteps product={PRODUCT} paymentEnabled whatsappNumber="5511999999999" />)

    await fillQuantityAndSubmit(30)
    await userEvent.click(await screen.findByText('Menor custo'))
    await screen.findByText('OT A')
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Continuar' })).toBeEnabled()
    )
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    const addressCard = await screen.findByText(/Rua das Flores/)
    await userEvent.click(addressCard)

    // Não deve abrir nenhuma aba antes do endpoint responder — essa era a
    // janela em branco reportada como "parecendo quebrado".
    expect(openSpy).not.toHaveBeenCalled()

    await userEvent.click(
      screen.getByRole('button', { name: 'Confirmar encomenda' })
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile/order/101')
    })
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/5511999999999?text='),
      '_blank',
      'noopener,noreferrer'
    )
    expect(sessionStorage.getItem(CREATED_ORDER_SESSION_KEY)).toBe('101')
    openSpy.mockRestore()
  })

  it('com paymentEnabled=false, cria o pedido, abre o WhatsApp com o resumo e navega para o acompanhamento do pedido', async () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

    renderWithProviders(
      <ProductionOrderSteps
        product={PRODUCT}
        paymentEnabled={false}
        whatsappNumber="5511999999999"
      />
    )

    await fillQuantityAndSubmit(30)
    await userEvent.click(await screen.findByText('Menor custo'))
    await screen.findByText('OT A')
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Continuar' })).toBeEnabled()
    )
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    const addressCard = await screen.findByText(/Rua das Flores/)
    await userEvent.click(addressCard)

    const button = screen.getByRole('button', { name: 'Confirmar pelo WhatsApp' })
    await userEvent.click(button)

    // Como a chamada é feita via HTTP real (mockado pelo MSW, não um stub
    // manual), por essa altura a cadeia reserve -> create -> sucesso já pode
    // ter sido concluída dentro do próprio `await userEvent.click` — por
    // isso a verificação relevante é o estado final, não um "ainda não foi
    // chamado" logo após o clique.
    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledTimes(1)
    })
    const [url] = openSpy.mock.calls[0]
    expect(url).toContain('https://wa.me/5511999999999?text=')

    const message = decodeURIComponent(String(url).split('?text=')[1])
    expect(message).toContain('Pedido #ZR-202609-ENCOMENDA01')
    expect(message).toContain('Cadeira Escolar — 30 unidades')
    expect(message).toContain('Plano: Menor custo')

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile/order/101')
    })
    expect(sessionStorage.getItem(CREATED_ORDER_SESSION_KEY)).toBe('101')

    openSpy.mockRestore()
  })

  it('não abre o WhatsApp se a encomenda não for salva', async () => {
    server.use(
      http.post('/api/production-order', () =>
        HttpResponse.json({ message: 'Falha ao salvar' }, { status: 500 })
      )
    )
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

    renderWithProviders(
      <ProductionOrderSteps product={PRODUCT} paymentEnabled={false} whatsappNumber="5511999999999" />
    )
    await fillQuantityAndSubmit(30)
    await userEvent.click(await screen.findByText('Menor custo'))
    await screen.findByText('OT A')
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Continuar' })).toBeEnabled()
    )
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    await userEvent.click(await screen.findByText(/Rua das Flores/))
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pelo WhatsApp' }))

    expect(await screen.findByText('Falha ao salvar')).toBeInTheDocument()
    expect(openSpy).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
    openSpy.mockRestore()
  })
})
