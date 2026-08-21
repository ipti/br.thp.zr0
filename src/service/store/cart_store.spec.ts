import { mergeCartItems } from './cart_store'
import { CartItem } from './type'

const localItem: CartItem = {
  id: 'produto-1',
  name: 'Produto local',
  price: 10,
  quantity: 2,
  image: '',
}

describe('mergeCartItems', () => {
  it('preserva itens locais quando a API retorna o carrinho vazio', () => {
    expect(mergeCartItems([localItem], [])).toEqual([localItem])
  })

  it('usa a versão sincronizada da API sem duplicar o item local', () => {
    const apiItem: CartItem = {
      ...localItem,
      cartItemId: 42,
      quantity: 3,
    }

    expect(mergeCartItems([localItem], [apiItem])).toEqual([apiItem])
  })

  it('mantém variantes diferentes como itens separados', () => {
    const firstVariant = { ...localItem, variantId: 1 }
    const secondVariant = { ...localItem, variantId: 2, cartItemId: 43 }

    expect(mergeCartItems([firstVariant], [secondVariant])).toEqual([
      firstVariant,
      secondVariant,
    ])
  })
})
