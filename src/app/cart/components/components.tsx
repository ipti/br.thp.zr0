'use client'
import { GetMyCartRequest } from '@/app/auth/login/service/request'
import ZSteps from '@/components/steps/steps'
import { isAuthenticated } from '@/service/localstorage'
import { useCartStore } from '@/service/store/cart_store'
import { MenuItem } from 'primereact/menuitem'
import { useEffect, useState } from 'react'
import CartList from './cart_list/cart_list'
import { useRouter, useSearchParams } from 'next/navigation'
import Address from './address/address'
import Finish from './finish/finish'
import Delivery from './delivery/delivery'
import Payment from './payment/payment'

export default function CartComponent() {
  const history = useRouter()

  const searchParams = useSearchParams()
  const index = searchParams.get('index')

  const [activeIndex, setActiveIndex] = useState(0)
  const [orders, setOrders] = useState<{ id: number; uid: string }[]>([])
  const setCart = useCartStore(state => state.setCart)

  const handleActiveIndex = (i: number) => {
    setActiveIndex(i)
  }

  const handleSetOrders = (newOrders: { id: number; uid: string }[]) => {
    setOrders(newOrders)
  }

  useEffect(() => {
    handleActiveIndex(parseInt(index ?? '0'))
  }, [index])

  useEffect(() => {
    if (!isAuthenticated()) return

    GetMyCartRequest()
      .then((response) => {
        const items = (response.data?.items ?? []).map((item: any) => ({
          id: item.product.uid,
          cartItemId: item.id,
          name: item.product.name,
          price: item.product.price ?? 0,
          quantity: item.quantity,
          image: item.product.product_image?.[0]?.img_url ?? '',
          variantId: item.variant_fk ?? undefined,
        }))
        setCart(items)
      })
      .catch(() => {})
  }, [setCart])

  const items: MenuItem[] | undefined = [
    {
      label: 'Carrinho'
    },

    {
      label: 'Endereço',
      disabled: false
    },
    {
      label: 'Entrega',
      disabled: false
    },
    {
      label: 'Confirmação',
      disabled: true
    },
    {
      label: 'Pagamento',
      disabled: true
    }
  ]

  return (
    <div>
      <ZSteps
        model={items}
        activeIndex={activeIndex}
        onSelect={e => {
          setActiveIndex(e.index)
          history.push('/cart?index=' + e.index)
        }}
        readOnly={false}
      />
      <div className="p-3" />
      {activeIndex === 0 && (
        <CartList key={0} handleActiveIndex={handleActiveIndex} />
      )}
      {/* {activeIndex === 1 && <Identify handleActiveIndex={handleActiveIndex} />} */}
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

      {/* <div className="flex flex-row gap-2">
                <ZButton label="Voltar" disabled={activeIndex === 0} onClick={() => { setActiveIndex(activeIndex - 1) }} text raised />
                <ZButton label="Continuar" disabled={activeIndex === 3} onClick={() => { setActiveIndex(activeIndex + 1) }} />
            </div> */}
    </div>
  )
}
