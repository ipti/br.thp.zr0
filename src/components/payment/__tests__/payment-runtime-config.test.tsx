import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw/server'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutComponent from '../payment'

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({}))
}))

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="stripe-elements">{children}</div>
  )
}))

jest.mock('../checkout_form/checkout_form', () => ({
  __esModule: true,
  default: () => <div>Formulário Stripe</div>
}))

describe('Configuração runtime do Stripe', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('carrega a publishable key do servidor quando ela não veio no build', async () => {
    server.use(
      http.get('/api/runtime-config/stripe', () =>
        HttpResponse.json({ publicKey: 'pk_test_runtime_key' })
      )
    )

    render(<CheckoutComponent clientSecret="pi_secret" orderId={34} />)

    expect(screen.getByRole('status')).toHaveTextContent('Carregando pagamento seguro')
    expect(await screen.findByText('Formulário Stripe')).toBeInTheDocument()
    expect(loadStripe).toHaveBeenCalledWith('pk_test_runtime_key')
  })

  it('mostra indisponibilidade somente depois da consulta ao servidor falhar', async () => {
    server.use(
      http.get('/api/runtime-config/stripe', () =>
        HttpResponse.json({ publicKey: null }, { status: 503 })
      )
    )

    render(<CheckoutComponent clientSecret="pi_secret" orderId={34} />)

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('O pagamento está temporariamente indisponível')
    expect(loadStripe).not.toHaveBeenCalled()
  })
})
