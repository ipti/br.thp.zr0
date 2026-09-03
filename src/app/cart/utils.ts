import { CartItem } from '@/service/store/type'

export type CheckoutStep = 0 | 1 | 2 | 3

export interface CheckoutProgress {
  address_selected?: number
  product_selected?: string[]
  deliverySelected?: unknown[]
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)

export const getSelectedCartItems = (
  cart: CartItem[],
  selectedIds: string[] | undefined
) => cart.filter(item => selectedIds?.includes(item.id))

export const getCartSubtotal = (
  cart: CartItem[],
  selectedIds: string[] | undefined
) =>
  getSelectedCartItems(cart, selectedIds).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

export const sanitizeSelectedIds = (
  cart: CartItem[],
  selectedIds: string[] | undefined
) => {
  const cartIds = new Set(cart.map(item => item.id))
  return selectedIds?.filter(id => cartIds.has(id)) ?? []
}

export const getLastAllowedStep = ({
  authenticated,
  cart,
  progress
}: {
  authenticated: boolean
  cart: CartItem[]
  progress: CheckoutProgress
}): CheckoutStep => {
  const selectedItems = getSelectedCartItems(cart, progress.product_selected)

  if (!authenticated || selectedItems.length === 0) return 0
  if (!progress.address_selected) return 1
  if (
    !progress.deliverySelected ||
    progress.deliverySelected.length < selectedItems.length
  ) {
    return 2
  }
  return 3
}

export const clampCheckoutStep = (
  requestedStep: number,
  lastAllowedStep: CheckoutStep
): CheckoutStep =>
  Math.min(Math.max(Number.isFinite(requestedStep) ? requestedStep : 0, 0), lastAllowedStep) as CheckoutStep
