'use client'

import { ZButton } from '@/components/button/button'
import LoginModal from '@/components/header/login/login_modal'
import ZSkeleton from '@/components/skeleton/skeleton'
import { useCartStore } from '@/service/store/cart_store'
import { CartItem } from '@/service/store/type'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatCurrency, getCartSubtotal, sanitizeSelectedIds } from '../../utils'
import { useCartStepsStore } from '../../zustand/zustand'
import './cart_list.css'
import Item from './item/item'

export default function CartList({
  handleActiveIndex
}: {
  handleActiveIndex: (i: number) => void
}) {
  const [modalLogin, setModalLogin] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [token, setToken] = useState<string | undefined>()
  const [removedItem, setRemovedItem] = useState<CartItem | null>(null)

  const cart = useCartStore(state => state.cart)
  const addItem = useCartStore(state => state.addItem)
  const cartSteps = useCartStepsStore(state => state)

  useEffect(() => {
    setHydrated(true)
    setToken(Cookies.get('access_token'))
  }, [])

  useEffect(() => {
    const currentSelection = cartSteps.cartSteps.product_selected
    if (cart.length === 0 && currentSelection === undefined) return

    const nextSelection = currentSelection === undefined
      ? cart.map(item => item.id)
      : sanitizeSelectedIds(cart, currentSelection)

    if (JSON.stringify(currentSelection) !== JSON.stringify(nextSelection)) {
      cartSteps.updateCartSteps({
        ...cartSteps.cartSteps,
        product_selected: nextSelection,
        deliverySelected: undefined
      })
    }
  }, [cart, cartSteps])

  const selectedIds = cartSteps.cartSteps.product_selected ?? []
  const selectedCount = selectedIds.length
  const total = getCartSubtotal(cart, selectedIds)
  const allSelected = cart.length > 0 && selectedCount === cart.length

  const handleSelectAll = () => {
    cartSteps.updateCartSteps({
      ...cartSteps.cartSteps,
      product_selected: allSelected ? [] : cart.map(item => item.id),
      deliverySelected: undefined
    })
  }

  const handleUndoRemove = () => {
    if (!removedItem) return
    addItem(removedItem)
    cartSteps.updateCartSteps({
      ...cartSteps.cartSteps,
      product_selected: [
        ...(cartSteps.cartSteps.product_selected ?? []),
        removedItem.id
      ],
      deliverySelected: undefined
    })
    setRemovedItem(null)
  }

  if (!hydrated) {
    return <div className="p-4"><ZSkeleton width="100%" height="12rem" /></div>
  }

  return (
    <div className="cart-page">
      <div className="cart-title-row">
        <div>
          <h2>Seu carrinho</h2>
          <p>Selecione os itens de pronta entrega que deseja comprar.</p>
        </div>
        {cart.length > 0 && (
          <label className="cart-select-all">
            <input
              type="checkbox"
              checked={allSelected}
              ref={input => {
                if (input) input.indeterminate = selectedCount > 0 && !allSelected
              }}
              onChange={handleSelectAll}
            />
            Selecionar todos ({cart.length})
          </label>
        )}
      </div>

      {removedItem && (
        <div className="cart-feedback" role="status">
          <span>{removedItem.name} foi removido.</span>
          <button type="button" onClick={handleUndoRemove}>Desfazer</button>
        </div>
      )}

      <div className="cart-layout">
        <div className="cart-items-column">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <i className="pi pi-shopping-cart" aria-hidden="true" />
              <h3>Seu carrinho está vazio.</h3>
              <p>Explore nossos produtos disponíveis para pronta entrega.</p>
              <Link href="/product" className="cart-secondary-action">Ver produtos</Link>
            </div>
          ) : (
            <div className="flex flex-column gap-3">
              {cart.map(item => (
                <Item
                  item={item}
                  key={`${item.id}-${item.variantId ?? 'default'}`}
                  onRemove={setRemovedItem}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="cart-summary" aria-label="Resumo do pedido">
          <div className="card_total">
            <h2>Resumo do pedido</h2>
            <p className="cart-summary-count">
              {selectedCount} {selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}
            </p>
            <dl className="cart-totals">
              <div><dt>Subtotal</dt><dd>{formatCurrency(total)}</dd></div>
              <div><dt>Frete</dt><dd className="cart-muted">Calculado na entrega</dd></div>
            </dl>
            <div className="cart-summary-total" aria-live="polite">
              <span>Total parcial</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <ZButton
              label="Continuar para endereço"
              style={{ width: '100%' }}
              disabled={cart.length === 0 || selectedCount === 0}
              onClick={() => token ? handleActiveIndex(1) : setModalLogin(true)}
            />
            {selectedCount === 0 && cart.length > 0 && (
              <p className="cart-summary-hint" role="status">
                Selecione ao menos um item para continuar.
              </p>
            )}
          </div>
        </aside>
      </div>

      <LoginModal visible={modalLogin} onHide={() => setModalLogin(false)} />
    </div>
  )
}
