import { renderWithProviders } from '@/test/test-utils'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResendVerificationEmailRequest } from '../service/request'
import FormLogin from './form'

jest.mock('../service/request', () => ({
  ResendVerificationEmailRequest: jest.fn(() => Promise.resolve({ data: {} }))
}))

jest.mock('../service/controller', () => ({
  LoginController: (setErrors: (message: string) => void) => ({
    LoginAction: (
      _body: { email: string; password: string },
      handleReturn?: () => void
    ) => {
      setErrors('Unverified email')
      handleReturn?.()
    }
  })
}))

describe('Login com e-mail não verificado', () => {
  it('permite reenviar a confirmação para o e-mail informado', async () => {
    renderWithProviders(<FormLogin />)

    await userEvent.type(screen.getByPlaceholderText('Digite o seu email'), 'cliente@example.com')
    await userEvent.type(screen.getByPlaceholderText('Digite sua senha'), '12345678')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('Seu e-mail ainda não foi verificado.')).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: /Reenviar e-mail de confirmação/i })
    )

    expect(ResendVerificationEmailRequest).toHaveBeenCalledWith('cliente@example.com')
    expect(
      await screen.findByText(/Enviamos um novo link/i)
    ).toBeInTheDocument()
  })
})
