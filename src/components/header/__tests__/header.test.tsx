import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Cookies from 'js-cookie'
import Header from '../header'
import HeaderNavigation from '../header_navigation/header_navigation'

const mockUsePathname = jest.fn(() => '/')

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}))

jest.mock('@/service/global_request/query', () => ({
  useFetchUserToken: () => ({ data: undefined }),
}))

jest.mock('@/service/store/cart_store', () => ({
  useCartStore: (selector: (state: { cart: Array<{ id: string }> }) => unknown) =>
    selector({ cart: [{ id: 'chair' }] }),
}))

jest.mock('react-tiny-popover', () => ({
  Popover: ({ children, content, isOpen }: React.PropsWithChildren<{ content: React.ReactNode; isOpen: boolean }>) => (
    <>
      {children}
      {isOpen ? content : null}
    </>
  ),
}))

jest.mock('../menu_user/menu_user', () => function MockMenuUser() {
  return <div>Menu da conta</div>
})
jest.mock('../login/login_modal', () => function MockLoginModal({ visible }: { visible: boolean }) {
  return visible ? <div>Modal de login</div> : null
})

describe('Header', () => {
  beforeEach(() => {
    jest.mocked(Cookies.get).mockReturnValue(undefined)
  })

  it('mantém logo, carrinho e conta acessíveis após a hidratação', async () => {
    render(<Header />)

    expect(screen.getByRole('link', { name: 'Ir para a página inicial' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Abrir carrinho com 1 item' })).toHaveAttribute(
      'href',
      '/cart'
    )

    fireEvent.click(screen.getByRole('button', { name: 'Entrar na conta' }))
    expect(screen.getByText('Modal de login')).toBeInTheDocument()
  })
})

describe('HeaderNavigation', () => {
  it('abre os menus, navega por links e fecha com Escape retornando o foco', async () => {
    render(<HeaderNavigation />)

    const projectTrigger = screen.getByRole('button', { name: /conheça o projeto/i })
    fireEvent.click(projectTrigger)

    expect(projectTrigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Sobre nós' })).toHaveAttribute('href', '/about-us')
    expect(screen.getByRole('link', { name: 'Nosso compromisso' })).toHaveAttribute(
      'href',
      '/about-us#sustentability'
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(projectTrigger).toHaveAttribute('aria-expanded', 'false')
      expect(projectTrigger).toHaveFocus()
    })
  })
})
