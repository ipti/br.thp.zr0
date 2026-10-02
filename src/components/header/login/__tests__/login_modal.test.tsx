import { fireEvent, render, screen } from '@testing-library/react'
import LoginModal from '../login_modal'

jest.mock('@/app/auth/login/service/controller', () => ({
  LoginController: () => ({ LoginModalAction: jest.fn() }),
}))

describe('LoginModal', () => {
  it('renderiza o formulário quando visible=true', () => {
    render(<LoginModal visible onHide={jest.fn()} />)

    expect(screen.getByRole('heading', { name: 'Fazer Login' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite o seu email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument()
  })

  it('não renderiza o formulário quando visible=false', () => {
    render(<LoginModal visible={false} onHide={jest.fn()} />)
    expect(screen.queryByRole('heading', { name: 'Fazer Login' })).toBeNull()
  })

  // Regressão: o prop `content` do PrimeReact Dialog passa um objeto de
  // opções ({ hide, contentRef, ... }) para a função, não a função `hide`
  // diretamente. Tratar o parâmetro inteiro como `hide` (sem desestruturar)
  // fazia o botão fechar quebrar com "Expected onClick listener to be a
  // function, instead got a value of object type".
  it('o botão fechar aciona onHide sem lançar erro', () => {
    const onHide = jest.fn()
    render(<LoginModal visible onHide={onHide} />)

    const closeButton = screen.getByRole('button', { name: 'Fechar' })
    expect(() => fireEvent.click(closeButton)).not.toThrow()
    expect(onHide).toHaveBeenCalledTimes(1)
  })
})
