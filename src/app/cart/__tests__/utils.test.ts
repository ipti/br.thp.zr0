import { CartItem } from '@/service/store/type'
import {
  clampCheckoutStep,
  formatCurrency,
  getCartSubtotal,
  getLastAllowedStep,
  sanitizeSelectedIds
} from '../utils'

const cart: CartItem[] = [
  { id: 'chair', name: 'Cadeira', price: 200, quantity: 2, image: '' },
  { id: 'table', name: 'Mesa', price: 300, quantity: 1, image: '' }
]

describe('cart checkout utils', () => {
  it('calcula subtotal apenas com itens selecionados', () => {
    expect(getCartSubtotal(cart, ['chair'])).toBe(400)
    expect(formatCurrency(400)).toMatch(/R\$\s?400,00/)
  })

  it('remove IDs que não existem mais no carrinho', () => {
    expect(sanitizeSelectedIds(cart, ['chair', 'removed'])).toEqual(['chair'])
  })

  it('impede acesso a uma etapa futura sem pré-requisitos', () => {
    const lastAllowed = getLastAllowedStep({
      authenticated: true,
      cart,
      progress: { product_selected: ['chair'] },
    })

    expect(lastAllowed).toBe(1)
    expect(clampCheckoutStep(4, lastAllowed)).toBe(1)
  })

  it('libera a revisão quando endereço e entrega foram preenchidos', () => {
    const progress = {
      product_selected: ['chair'],
      address_selected: 10,
      deliverySelected: [{}]
    }

    expect(getLastAllowedStep({ authenticated: true, cart, progress })).toBe(3)
  })
})
