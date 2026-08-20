import { OrderOneType } from '@/app/profile/order/service/types'
import { ZButton } from '@/components/button/button'
import ZDialog from '@/components/dialog/dialog'
import ZDropdown from '@/components/dropdown/dropdown'
import ZInputText from '@/components/input/input'
import { orderStatus } from '@/utils/enum/order_status'
import { paymentStatus } from '@/utils/enum/payment_status'
import { useEffect, useState } from 'react'
import { OrderController } from '../../../service/controller'

interface ModalUpdateOrderProps {
  visible: boolean
  order: OrderOneType
  onHide(): void
}

export function ModalUpdateOrder({ visible, order, onHide }: ModalUpdateOrderProps) {
  const [status, setStatus] = useState('')
  const [payStatus, setPayStatus] = useState('')
  const [trackingCode, setTrackingCode] = useState('')
  const [trackingCarrier, setTrackingCarrier] = useState('')
  const controllerOrder = OrderController()
  const orderService = order.order_services?.[0]

  useEffect(() => {
    if (!visible) return
    setPayStatus(order.payment_status ?? 'PENDING')
    setStatus(orderService?.status ?? '')
    setTrackingCode(orderService?.tracking_code ?? '')
    setTrackingCarrier(orderService?.tracking_carrier ?? '')
  }, [visible, order.payment_status, orderService])

  const handleSave = () => {
    if (!orderService) return

    controllerOrder.OrderUpdateAction({
      status,
      payment_status: payStatus,
      id_order: order.id,
      id_order_service: orderService.id,
      tracking_code: trackingCode.trim(),
      tracking_carrier: trackingCarrier.trim(),
    })
    onHide()
  }

  return (
    <ZDialog
      visible={visible}
      onHide={onHide}
      header="Editar status"
      style={{ width: 'min(50rem, 90vw)' }}
    >
      {!orderService ? (
        <div className="flex flex-column align-items-center gap-3 p-4 text-center">
          <i className="pi pi-exclamation-circle text-3xl" aria-hidden="true" />
          <strong>Este pedido não possui uma remessa para esta oficina.</strong>
          <p>Atualize a página ou verifique se a oficina selecionada está correta.</p>
          <ZButton label="Fechar" outlined onClick={onHide} />
        </div>
      ) : (
        <div className="flex flex-column gap-4">
          <div className="flex flex-column gap-2">
            <label htmlFor="order-status">Status do pedido</label>
            <ZDropdown
              inputId="order-status"
              options={Object.keys(orderStatus).map(value => ({ label: orderStatus[value], value }))}
              value={status}
              onChange={event => setStatus(event.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="payment-status">Status do pagamento</label>
            <ZDropdown
              inputId="payment-status"
              options={Object.keys(paymentStatus).map(value => ({ label: paymentStatus[value], value }))}
              value={payStatus}
              onChange={event => setPayStatus(event.value)}
              className="w-full"
            />
          </div>

          <div className="grid">
            <div className="col-12 md:col-6 flex flex-column gap-2">
              <label htmlFor="tracking-code">Código de rastreio</label>
              <ZInputText
                id="tracking-code"
                value={trackingCode}
                onChange={event => setTrackingCode(event.target.value)}
                placeholder="Ex.: BR123456789"
              />
            </div>
            <div className="col-12 md:col-6 flex flex-column gap-2">
              <label htmlFor="tracking-carrier">Transportadora</label>
              <ZInputText
                id="tracking-carrier"
                value={trackingCarrier}
                onChange={event => setTrackingCarrier(event.target.value)}
                placeholder="Ex.: Correios"
              />
            </div>
          </div>

          <div className="flex flex-column-reverse sm:flex-row justify-content-end gap-2">
            <ZButton label="Cancelar" text onClick={onHide} />
            <ZButton label="Salvar alterações" icon="pi pi-check" onClick={handleSave} disabled={!status || !payStatus} />
          </div>
        </div>
      )}
    </ZDialog>
  )
}
