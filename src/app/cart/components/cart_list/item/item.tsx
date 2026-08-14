import { useFetchProductOneQuantity } from '@/app/cart/service/query'
import { useCartStepsStore } from '@/app/cart/zustand/zustand'
import { formatCurrency } from '@/app/cart/utils'
import { ZButton } from '@/components/button/button'
import ZCheckbox from '@/components/checkbox/checkbox'
import { useCartStore } from '@/service/store/cart_store'
import { CartItem } from '@/service/store/type'
import Link from 'next/link'
import './item.css'

export default function Item({
  item,
  onRemove
}: {
  item: CartItem
  onRemove: (item: CartItem) => void
}) {
  const cartSteps = useCartStepsStore(state => state)
  const isSelected = !!cartSteps.cartSteps.product_selected?.includes(item.id)
  const removeItem = useCartStore(state => state.removeItem)
  const updateItem = useCartStore(state => state.updateQuantity)
  const { data: quantityFetch, isLoading } = useFetchProductOneQuantity(item.id)
  const availability: { quantity: number } | undefined = quantityFetch

  const updateDependentState = (productSelected?: string[]) => {
    cartSteps.updateCartSteps({
      ...cartSteps.cartSteps,
      ...(productSelected ? { product_selected: productSelected } : {}),
      deliverySelected: undefined
    })
  }

  const handleQuantityChange = (change: number) => {
    updateItem(item.id, Math.max(1, item.quantity + change))
    updateDependentState()
  }

  const handleSelection = () => {
    const selected = cartSteps.cartSteps.product_selected ?? []
    updateDependentState(
      isSelected
        ? selected.filter(id => id !== item.id)
        : [...selected, item.id]
    )
  }

  return (
    <article className={`card_list_item${isSelected ? ' is-selected' : ''}`}>
      <div className="cart-item-checkbox">
        <ZCheckbox
          inputId={`cart-item-${item.id}`}
          value={item.id}
          checked={isSelected}
          aria-label={`Selecionar ${item.name}`}
          onChange={handleSelection}
        />
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image}
        alt={item.name}
        width={112}
        height={112}
        className="cart-item-image"
      />

      <div className="cart-item-content">
        <div className="cart-item-header">
          <div>
            <h3>{item.name}</h3>
            <p>{formatCurrency(item.price)} por unidade</p>
          </div>
          <ZButton
            icon="pi pi-trash"
            aria-label={`Remover ${item.name} do carrinho`}
            tooltip="Remover"
            className="p-button-text p-button-sm p-button-danger"
            onClick={() => {
              removeItem(item.id)
              onRemove(item)
            }}
          />
        </div>

        <div className="cart-item-controls">
          <div>
            <span className="cart-item-control-label">Quantidade</span>
            <div className="quantity" role="group" aria-label={`Quantidade de ${item.name}`}>
              <button
                type="button"
                aria-label={`Diminuir quantidade de ${item.name}`}
                onClick={() => handleQuantityChange(-1)}
                disabled={item.quantity <= 1}
              >−</button>
              <span aria-live="polite">{item.quantity}</span>
              <button
                type="button"
                aria-label={`Aumentar quantidade de ${item.name}`}
                disabled={isLoading || !((availability?.quantity ?? 0) > item.quantity)}
                onClick={() => handleQuantityChange(1)}
              >+</button>
            </div>
            {availability && (
              <span className="cart-item-stock">Máximo disponível: {availability.quantity}</span>
            )}
          </div>

          <div className="cart-item-price">
            <span>Total do item</span>
            <strong>{formatCurrency(item.price * item.quantity)}</strong>
          </div>
        </div>

        <Link
          href={`/production-order?productId=${encodeURIComponent(item.id)}`}
          className="cart-item-production-order-link"
        >
          Encomendar este produto separadamente
          <i className="pi pi-external-link" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
