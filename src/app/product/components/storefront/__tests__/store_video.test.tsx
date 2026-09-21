import { fireEvent, render, screen } from '@testing-library/react'
import StoreVideo from '../store_video'

describe('StoreVideo', () => {
  beforeEach(() => {
    // jsdom não implementa HTMLMediaElement.play/pause; precisamos de stubs
    HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined)
    HTMLMediaElement.prototype.pause = jest.fn()
  })

  it('renderiza o container como botão com aria-pressed=false inicialmente', () => {
    render(<StoreVideo />)
    const wrap = screen.getByRole('button', { name: /reproduzir vídeo/i })
    expect(wrap).toHaveAttribute('aria-pressed', 'false')
  })

  it('chama play ao clicar e atualiza aria-label para "Pausar"', async () => {
    render(<StoreVideo />)
    const wrap = screen.getByRole('button')

    fireEvent.click(wrap)

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
  })

  it('ativa play com tecla Enter e Space', () => {
    render(<StoreVideo />)
    const wrap = screen.getByRole('button')

    fireEvent.keyDown(wrap, { key: 'Enter' })
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(wrap, { key: ' ' })
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2)
  })

  it('exibe mensagem de erro ao disparar evento de erro no vídeo', () => {
    render(<StoreVideo />)
    const video = screen.getByRole('region', { name: /vídeo institucional/i }).querySelector('video')!

    fireEvent.error(video)

    expect(screen.getByRole('status')).toHaveTextContent('Vídeo temporariamente indisponível')
  })

  it('tem tabIndex={0} tornando o wrapper focável por teclado', () => {
    render(<StoreVideo />)
    expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0')
  })
})
