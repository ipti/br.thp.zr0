'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { ZButton } from '@/components/button/button'
import ZConfirmDialog from '@/components/confirm_dialog/confirm_dialog'
import { Order } from '@/components/order/order'
import type { OrderOneType } from '../../../service/types'
import { OrderController } from '../../../service/controller'
import { OrderReviews } from './order_reviews'
import './card.css'

interface OrderProps {
  order: OrderOneType & { status?: string }
}

const OrderCard: React.FC<OrderProps> = ({ order }) => {
  const [canceled, setCanceled] = useState(false)
  const router = useRouter()
  const controllerOrder = OrderController()

  const handleSave = () => {
    controllerOrder.OrderUpdateAction(String(order.id), {
      status: 'SOLITED_CANCELLATION',
      payment_status: order.payment_status
    })
  }

  if (!order) return <>Carregando...</>

  const canPay =
    (order.payment_status === 'PENDING' || order.payment_status === 'FAILED') &&
    order.status !== 'SOLITED_CANCELLATION' &&
    order.status !== 'CANCELLED'

  return (
    <>
      <div className="flex flex-row justify-content-end mb-5 gap-2">
        {canPay ? (
          <ZButton
            icon="pi pi-credit-card"
            label="Realizar pagamento"
            onClick={() => router.push(`/payment?id=${order.id}`)}
            severity="success"
          />
        ) : null}
        <ZButton
          icon="pi pi-undo"
          label="Solicitar cancelamento"
          onClick={() => setCanceled(!canceled)}
          outlined
          severity="danger"
        />
      </div>

      <Order order={order} />

      {!!order.order_services?.[0]?.tracking_code && (
        <div className="mt-4 p-3 border-round surface-100">
          <strong>Rastreio:</strong> {order.order_services[0].tracking_code}
          {order.order_services[0].tracking_carrier ? (
            <p className="m-0 mt-2">
              Transportadora: {order.order_services[0].tracking_carrier}
            </p>
          ) : null}
        </div>
      )}

      <OrderReviews order={order} />

      <ZConfirmDialog
        accept={handleSave}
        acceptLabel="Sim"
        header="Confirmação"
        message="Deseja mesmo solicitar o cancelamento?"
        onHide={() => setCanceled(false)}
        rejectLabel="Não"
        visible={canceled}
      />
    </>
  )
}

export default OrderCard
