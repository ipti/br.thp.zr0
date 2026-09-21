import { fireEvent, render, screen } from '@testing-library/react'
import FeaturedProduct from '../featured_product'
import type { ProductOne } from '@/app/seller/product/one/service/type'

jest.mock('next/image', () =>
  function MockImage({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...props} />
  }
)

jest.mock('next/link', () =>
  function MockLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return <a href={href} {...props}>{children}</a>
  }
)

const mockAddItem = jest.fn()
const mockShowToast = jest.fn()

jest.mock('@/service/store/cart_store', () => ({
  useCartStore: (selector: (state: { cart: Array<{ id: string; quantity: number }> }) => unknown) =>
    selector({ cart: [] }),
}))

jest.mock('@/components/toast/hook/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

jest.mock('@/components/button/button', () => ({
  ZButton: ({ children, onClick, disabled, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
  ),
}))

function makeProduct(overrides: Partial<ProductOne> = {}): ProductOne {
  return {
    uid: 'prod-1',
    name: 'Cadeira Artesanal',
    price: 850,
    description: 'Uma cadeira muito bonita.',
    quantity: 5,
    product_image: [
      { id: 'img-1', img_url: 'https://cdn.example.com/1.jpg', order: 1 },
      { id: 'img-2', img_url: 'https://cdn.example.com/2.jpg', order: 2 },
    ],
    ...overrides,
  } as ProductOne
}

describe('FeaturedProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza nome e preço do produto', () => {
    render(<FeaturedProduct product={makeProduct()} />)
    expect(screen.getByRole('heading', { name: 'Cadeira Artesanal' })).toBeInTheDocument()
    expect(screen.getByText(/850/)).toBeInTheDocument()
  })

  it('renderiza galeria de thumbnails quando há mais de uma imagem', () => {
    render(<FeaturedProduct product={makeProduct()} />)
    const thumbs = screen.getAllByRole('button', { name: /Ver imagem/i })
    expect(thumbs).toHaveLength(2)
  })

  it('não renderiza thumbnails quando há só uma imagem', () => {
    const product = makeProduct({
      product_image: [{ id: 'img-1', img_url: 'https://cdn.example.com/1.jpg', order: 1 }],
    })
    render(<FeaturedProduct product={product} />)
    expect(screen.queryByRole('button', { name: /Ver imagem/i })).toBeNull()
  })

  it('seleciona thumbnail ao clicar e atualiza aria-pressed', () => {
    render(<FeaturedProduct product={makeProduct()} />)
    const thumbs = screen.getAllByRole('button', { name: /Ver imagem/i })

    expect(thumbs[0]).toHaveAttribute('aria-pressed', 'true')
    expect(thumbs[1]).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(thumbs[1])

    expect(thumbs[0]).toHaveAttribute('aria-pressed', 'false')
    expect(thumbs[1]).toHaveAttribute('aria-pressed', 'true')
  })

  it('exibe placeholder quando produto não tem imagens', () => {
    const product = makeProduct({ product_image: [] })
    render(<FeaturedProduct product={product} />)
    expect(screen.getByRole('img', { name: /Imagem indisponível para Cadeira Artesanal/i })).toBeInTheDocument()
  })

  it('exibe aviso e desabilita botão quando produto está sem estoque', () => {
    const product = makeProduct({ quantity: 0 })
    render(<FeaturedProduct product={product} />)

    expect(screen.getByRole('status')).toHaveTextContent('Produto fora de estoque')
    const btn = screen.getByRole('button', { name: /indisponível/i })
    expect(btn).toBeDisabled()
  })

  it('link "Mais detalhes" aponta para a PDP do produto', () => {
    render(<FeaturedProduct product={makeProduct()} />)
    expect(screen.getByRole('link', { name: /mais detalhes/i })).toHaveAttribute('href', '/product/prod-1')
  })
})
