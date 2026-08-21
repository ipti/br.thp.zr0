import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModalAddProduct from '../modal_add_product'

const addProduct = jest.fn().mockResolvedValue({})

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))
jest.mock('@/service/cookies', () => ({ getIdTw: () => '7' }))
jest.mock('@/app/seller/product/service/query', () => ({
  useFetchRequestProduct: () => ({
    data: [{ id: 3, uid: 'cadeira', name: 'Cadeira escolar', description: 'Cadeira em plástico reciclado', price: 50, category: {}, product_image: [] }],
    isLoading: false,
  }),
}))
jest.mock('../../../service/query', () => ({
  useFetchRequestProductTransformationWorkshop: () => ({
    data: { inventory: [] },
  }),
}))
jest.mock('../../../service/controller', () => ({
  ProductTransfWorkshopController: () => ({
    AddProductTransfWorkshopAction: addProduct,
  }),
}))

describe('Adicionar produto à OT', () => {
  beforeEach(() => addProduct.mockClear())

  it('envia o estoque inicial informado e fecha somente após sucesso', async () => {
    const user = userEvent.setup()
    const onHide = jest.fn()
    render(<ModalAddProduct visible onHide={onHide} />)

    await user.click(
      screen.getByRole('button', { name: 'Busque e selecione um produto' }),
    )
    await user.click(
      await screen.findByText('Cadeira escolar', { selector: 'strong' }),
    )

    const quantity = screen.getByRole('spinbutton', { name: 'Estoque inicial' })
    await user.clear(quantity)
    await user.type(quantity, '12')
    await user.click(screen.getByRole('button', { name: 'Adicionar produto' }))

    await waitFor(() =>
      expect(addProduct).toHaveBeenCalledWith({
        product_fk: 3,
        tw_fk: 7,
        quantity: 12,
      }),
    )
    expect(onHide).toHaveBeenCalledTimes(1)
  })
})
