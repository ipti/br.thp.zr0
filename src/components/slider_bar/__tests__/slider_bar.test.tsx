import { fireEvent, render, screen } from '@testing-library/react'
import SlideBar from '../slider_bar'
import type { Menu } from '@/app/middleware/use_permission'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const itens: Menu[] = [
  { id: 1, profileId: 1, label: 'Início', link: '/seller/home', icon: 'pi pi-home', order: 0 },
  { id: 2, profileId: 1, label: 'Produtos', link: '/seller/product', icon: 'pi pi-briefcase', order: 1 },
]

describe('SlideBar', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('no mobile com isOpen, renderiza o backdrop e fecha ao clicar nele', () => {
    const onClose = jest.fn()
    render(<SlideBar itens={itens} isOpen isMobile onClose={onClose} />)

    const backdrop = document.querySelector('.slider_backdrop')
    expect(backdrop).toBeInTheDocument()

    fireEvent.click(backdrop!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('não renderiza backdrop no desktop mesmo com isOpen', () => {
    render(<SlideBar itens={itens} isOpen onClose={jest.fn()} />)
    expect(document.querySelector('.slider_backdrop')).toBeNull()
  })

  it('fecha com Escape quando mobile e aberto', () => {
    const onClose = jest.fn()
    render(<SlideBar itens={itens} isOpen isMobile onClose={onClose} />)

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('não fecha com Escape no desktop', () => {
    const onClose = jest.fn()
    render(<SlideBar itens={itens} isOpen onClose={onClose} />)

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('navega e fecha o drawer ao clicar em um item no mobile', () => {
    const onClose = jest.fn()
    render(<SlideBar itens={itens} isOpen isMobile onClose={onClose} />)

    fireEvent.click(screen.getByRole('button', { name: 'Produtos' }))

    expect(mockPush).toHaveBeenCalledWith('/seller/product')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('navega sem fechar no desktop (sidebar fixa, não é um drawer)', () => {
    const onClose = jest.fn()
    render(<SlideBar itens={itens} isOpen onClose={onClose} />)

    fireEvent.click(screen.getByRole('button', { name: 'Produtos' }))

    expect(mockPush).toHaveBeenCalledWith('/seller/product')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('itens são operáveis por teclado (Enter)', () => {
    render(<SlideBar itens={itens} isOpen onClose={jest.fn()} />)

    const item = screen.getByRole('button', { name: 'Início' })
    item.focus()
    fireEvent.keyDown(item, { key: 'Enter' })

    expect(mockPush).toHaveBeenCalledWith('/seller/home')
  })

  it('itens são operáveis por teclado (Espaço)', () => {
    render(<SlideBar itens={itens} isOpen onClose={jest.fn()} />)

    const item = screen.getByRole('button', { name: 'Produtos' })
    item.focus()
    fireEvent.keyDown(item, { key: ' ' })

    expect(mockPush).toHaveBeenCalledWith('/seller/product')
  })

  it('marca aria-hidden no menu quando fechado no mobile', () => {
    render(<SlideBar itens={itens} isOpen={false} isMobile onClose={jest.fn()} />)
    expect(screen.getByRole('navigation', { hidden: true })).toHaveAttribute('aria-hidden', 'true')
  })

  it('não marca aria-hidden quando aberto', () => {
    render(<SlideBar itens={itens} isOpen isMobile onClose={jest.fn()} />)
    expect(screen.getByRole('navigation')).not.toHaveAttribute('aria-hidden')
  })
})
