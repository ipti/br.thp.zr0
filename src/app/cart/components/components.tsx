'use client'
import { GetMyCartRequest } from '@/app/auth/login/service/request'
import ZSteps from '@/components/steps/steps'
import { isAuthenticated } from '@/service/localstorage'
import { mergeCartItems, useCartStore } from '@/service/store/cart_store'
import { MenuItem } from 'primereact/menuitem'
import { useEffect, useRef, useState } from 'react'
import CartList from './cart_list/cart_list'
import { useRouter, useSearchParams } from 'next/navigation'
import Address from './address/address'
import Finish from './finish/finish'
import Delivery from './delivery/delivery'
import Payment from './payment/payment'
import { clampCheckoutStep, getLastAllowedStep } from '../utils'
import { useCartStepsStore } from '../zustand/zustand'
import './components.css'

type ApiCartItem = {
  id: number
  quantity: number
  variant_fk?: number | null
  product: {
    uid: string
    name: string
    price?: number
    product_image?: { img_url?: string }[]
  }
}

export default function CartComponent() {
  const history = useRouter()

  const searchParams = useSearchParams()
  const index = searchParams.get('index')

  const [activeIndex, setActiveIndex] = useState(0)
  const [orders, setOrders] = useState<{ id: number; uid: string }[]>([])
  const contentRef = useRef<HTMLElement>(null)
  const setCart = useCartStore(state => state.setCart)
  const cart = useCartStore(state => state.cart)
  const cartSteps = useCartStepsStore(state => state.cartSteps)
  const authenticated = isAuthenticated()

  const lastAllowedStep = getLastAllowedStep({
    authenticated,
    cart,
    progress: cartSteps,
    hasOrders: orders.length > 0
  })

  const handleActiveIndex = (i: number) => {
    const nextStep = clampCheckoutStep(i, getLastAllowedStep({
      authenticated: isAuthenticated(),
      cart: useCartStore.getState().cart,
      progress: useCartStepsStore.getState().cartSteps,
      hasOrders: orders.length > 0
    }))
    setActiveIndex(nextStep)
    history.push('/cart?index=' + nextStep)
  }

  const handleSetOrders = (newOrders: { id: number; uid: string }[]) => {
    setOrders(newOrders)
  }

  useEffect(() => {
    const requestedStep = Number.parseInt(index ?? '0', 10)
    const safeStep = clampCheckoutStep(requestedStep, lastAllowedStep)
    setActiveIndex(safeStep)
    if (requestedStep !== safeStep) history.replace('/cart?index=' + safeStep)
  }, [history, index, lastAllowedStep])

  useEffect(() => {
    contentRef.current?.focus()
  }, [activeIndex])

  useEffect(() => {
    if (!isAuthenticated()) return

    GetMyCartRequest()
      .then((response) => {
        const items = (response.data?.items ?? []).map((item: ApiCartItem) => ({
          id: item.product.uid,
          cartItemId: item.id,
          name: item.product.name,
          price: item.product.price ?? 0,
          quantity: item.quantity,
          image: item.product.product_image?.[0]?.img_url ?? '',
          variantId: item.variant_fk ?? undefined,
        }))
        const localItems = useCartStore.getState().cart
        setCart(mergeCartItems(localItems, items))
      })
      .catch(() => {})
  }, [setCart])

  const labels = ['Carrinho', 'Endereço', 'Entrega', 'Revisão', 'Pagamento']
  const items: MenuItem[] = labels.map((label, stepIndex) => ({
    label,
    disabled: stepIndex > lastAllowedStep
  }))

  return (
    <main className="checkout-shell">
      <header className="checkout-heading">
        <div>
          <span className="checkout-eyebrow">Compra segura</span>
          <h1>Checkout de pronta entrega</h1>
          <p>Itens disponíveis em estoque para envio.</p>
        </div>
        <span className="checkout-step-count" aria-live="polite">
          Etapa {activeIndex + 1} de {items.length}
        </span>
      </header>
      <div className="checkout-stepper">
        <ZSteps
          aria-label="Etapas da compra"
          model={items}
          activeIndex={activeIndex}
          onSelect={event => handleActiveIndex(event.index)}
          readOnly={false}
        />
      </div>
      <section ref={contentRef} className="checkout-content" key={activeIndex} tabIndex={-1}>
        {activeIndex === 0 && (
          <CartList key={0} handleActiveIndex={handleActiveIndex} />
        )}
        {activeIndex === 1 && <Address handleActiveIndex={handleActiveIndex} />}
        {activeIndex === 2 && <Delivery handleActiveIndex={handleActiveIndex} />}
        {activeIndex === 3 && (
          <Finish
            handleActiveIndex={handleActiveIndex}
            handleSetOrders={handleSetOrders}
          />
        )}
        {activeIndex === 4 && (
          <Payment handleActiveIndex={handleActiveIndex} orders={orders} />
        )}
      </section>
    </main>
  )
}
