import { ProfileContext } from '@/app/seller/context/profile.context'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import ListPage from '../list'

expect.extend(toHaveNoViolations)

const updateQuantity = jest.fn().mockResolvedValue({})

jest.mock('next/navigation', () => ({
  usePathname: () => '/seller/transformation-workshop/product',
  useSearchParams: () => new URLSearchParams(),
}))
jest.mock('@/service/cookies', () => ({ getIdTw: () => '7' }))
jest.mock('@/app/middleware/use_create', () => ({
  acessCreatePage: () => true,
}))
jest.mock('@/app/middleware/use_update', () => ({
  acessUpdatePage: () => true,
}))
jest.mock('../../service/query', () => ({
  useFetchRequestProductTransformationWorkshop: () => ({
    data: {
      inventory: [
        {
          transformation_workshop_fk: 7,
          product_fk: 3,
          quantity: 2,
          product: { name: 'Cadeira escolar', product_image: [] },
        },
      ],
    },
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: jest.fn(),
  }),
}))
jest.mock('../../service/controller', () => ({
  ProductTransfWorkshopController: () => ({
    UpdateProductTransfWorkshopAction: updateQuantity,
  }),
}))
jest.mock('../modal_add_product/modal_add_product', () => ({
  __esModule: true,
  default: () => null,
}))

function renderList() {
  return render(
    <ProfileContext.Provider value={{ profile: undefined }}>
      <ListPage />
    </ProfileContext.Provider>,
  )
}

describe('Estoque da OT', () => {
  beforeEach(() => updateQuantity.mockClear())

  it('mostra o resumo e registra a diferença ao alterar o estoque', async () => {
    const user = userEvent.setup()
    renderList()

    expect(screen.getByText('Produtos cadastrados')).toBeInTheDocument()
    expect(screen.getByText('2 unidades')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: 'Alterar quantidade de Cadeira escolar',
      }),
    )
    const input = screen.getByRole('spinbutton', { name: 'Nova quantidade' })
    await user.clear(input)
    await user.type(input, '5')
    await user.tab()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Serão adicionadas 3 unidades.',
    )
    await user.click(
      screen.getByRole('button', { name: 'Salvar quantidade' }),
    )

    await waitFor(() =>
      expect(updateQuantity).toHaveBeenCalledWith(
        { product_fk: 3, tw_fk: 7, quantity: 5 },
        3,
      ),
    )
  })

  it('não apresenta violações automáticas de acessibilidade', async () => {
    const { container } = renderList()
    expect(await axe(container)).toHaveNoViolations()
  })
})
