import { ZButton } from '@/components/button/button'
import ZSkeleton from '@/components/skeleton/skeleton'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Payment({
  handleActiveIndex,
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
      <div className="checkout-stage">
        <div className="checkout-stage-heading">
          <div>
            <h2 data-checkout-heading tabIndex={-1}>Pedido não identificado</h2>
            <p>Não encontramos um pedido criado nesta sessão.</p>
          </div>
        </div>
        <div className="checkout-inline-error" role="alert">
          <span>Volte à revisão e tente finalizar novamente.</span>
          <ZButton type="button" label="Voltar à revisão" outlined onClick={() => handleActiveIndex(3)} />
        </div>
      </div>
    )
  }

  if (orders.length === 1) {
    return (
      <div className="checkout-stage">
        <div className="checkout-stage-heading">
          <div>
            <h2 data-checkout-heading tabIndex={-1}>Preparando pagamento</h2>
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
          <h2 data-checkout-heading tabIndex={-1}>Escolha um pedido para pagar</h2>
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
