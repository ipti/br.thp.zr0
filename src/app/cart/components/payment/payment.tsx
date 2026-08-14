import { ZButton } from '@/components/button/button'
import ZSkeleton from '@/components/skeleton/skeleton'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Payment({
  orders
}: {
  handleActiveIndex: (i: number) => void
  orders: { id: number; uid: string }[]
}) {
  const router = useRouter()

  useEffect(() => {
    if (orders.length === 1) {
      router.replace(`/payment?id=${orders[0].id}`)
    }
  }, [orders, router])

  if (orders.length === 0) {
    return (
      <div className="checkout-inline-error" role="alert">
        Não foi possível identificar o pedido para pagamento.
      </div>
    )
  }

  if (orders.length === 1) {
    return (
      <div className="checkout-stage">
        <div className="checkout-stage-heading">
          <div>
            <h2>Preparando pagamento</h2>
            <p>Você será direcionado para o ambiente seguro de pagamento.</p>
          </div>
        </div>
        <ZSkeleton width="100%" height="10rem" />
      </div>
    )
  }

  return (
    <div className="checkout-stage">
      <div className="checkout-stage-heading">
        <div>
          <h2>Escolha um pedido para pagar</h2>
          <p>Cada pedido possui uma transação independente.</p>
        </div>
      </div>
      <div className="flex flex-column gap-2">
        {orders.map(order => (
          <ZButton
            key={order.id}
            label={`Pagar pedido ${order.uid}`}
            onClick={() => router.push(`/payment?id=${order.id}`)}
          />
        ))}
      </div>
    </div>
  )
}
