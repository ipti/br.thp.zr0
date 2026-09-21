import { render, screen } from '@testing-library/react'
import RelatedProducts from '../related_products'
import type { ProductType } from '@/app/seller/product/type'

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

function makeProduct(overrides: Partial<ProductType> = {}): ProductType {
  return {
    uid: 'prod-1',
    name: 'Produto Teste',
    price: 250,
    description: 'Descrição',
    quantity: 10,
    product_image: [{ id: 'img-1', img_url: 'https://cdn.example.com/img.jpg', order: 1 }],
    ...overrides,
  } as ProductType
}

describe('RelatedProducts', () => {
  it('retorna null quando a lista está vazia', () => {
    const { container } = render(<RelatedProducts products={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renderiza os produtos passados com links corretos', () => {
    const products = [
      makeProduct({ uid: 'a', name: 'Cadeira A' }),
      makeProduct({ uid: 'b', name: 'Mesa B' }),
    ]
    render(<RelatedProducts products={products} />)

    expect(screen.getByRole('link', { name: /Cadeira A/i })).toHaveAttribute('href', '/product/a')
    expect(screen.getByRole('link', { name: /Mesa B/i })).toHaveAttribute('href', '/product/b')
  })

  it('exibe placeholder quando produto não tem imagem', () => {
    const product = makeProduct({ uid: 'c', name: 'Sem Foto', product_image: [] })
    render(<RelatedProducts products={[product]} />)

    expect(screen.getByRole('img', { name: /Imagem indisponível para Sem Foto/i })).toBeInTheDocument()
  })

  it('link "Ver todos" aponta para /product/all', () => {
    render(<RelatedProducts products={[makeProduct()]} />)
    expect(screen.getByRole('link', { name: /ver todos/i })).toHaveAttribute('href', '/product/all')
  })

  it('formata preço em BRL', () => {
    render(<RelatedProducts products={[makeProduct({ price: 1299 })]} />)
    expect(screen.getByText(/R\$\s*1\.299/)).toBeInTheDocument()
  })
})
