import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { DetailsProduct } from './details_product'

const push = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

jest.mock('@/app/product/components/wishlist_button', () => ({
  WishlistButton: () => null,
}))

jest.mock('@/components/shipping/shipping', () => () => null)

jest.mock('@/components/toast/hook/useToast', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}))

const PRODUCT = {
  uid: 'cadeira-uid',
  name: 'Cadeira',
  description: 'Cadeira reciclável',
  price: 200,
  quantity: 1,
  availableForOrder: false,
  product_image: [],
}

describe('DetailsProduct', () => {
  beforeEach(() => push.mockClear())

  it('exibe o botão de encomenda mesmo sem capacidade ativa', () => {
    renderWithProviders(<DetailsProduct item={PRODUCT} />)

    const button = screen.getByRole('button', {
      name: 'Comprar sob encomenda',
    })
    expect(button).toBeInTheDocument()

    fireEvent.click(button)
    expect(push).toHaveBeenCalledWith(
      '/production-order?productId=cadeira-uid'
    )
  })

  it('não exibe o botão de encomenda nos cards da home', () => {
    renderWithProviders(<DetailsProduct item={PRODUCT} home />)

    expect(
      screen.queryByRole('button', { name: 'Comprar sob encomenda' })
    ).not.toBeInTheDocument()
  })
})
