'use client'

import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { ZButton } from '@/components/button/button'
import ZConfirmDialog from '@/components/confirm_dialog/confirm_dialog'
import { ZSaleTypeBadge } from '@/components/badge/sale_type_badge'
import type { OrderOneType, OrderService } from '../../../service/types'
import { OrderController } from '../../../service/controller'
import { OrderReviews } from './order_reviews'
import './card.css'

interface OrderProps {
  order: OrderOneType
}

type StepState = 'completed' | 'current' | 'pending'

const ORDER_STATUS: Record<string, { label: string; icon: string }> = {
  PENDING: { label: 'Pedido recebido', icon: 'pi pi-clock' },
  CONFIRMED: { label: 'Pedido confirmado', icon: 'pi pi-check' },
  IN_PRODUCTION: { label: 'Em produção', icon: 'pi pi-cog' },
  SHIPPED: { label: 'Pedido enviado', icon: 'pi pi-truck' },
  COMPLETED: { label: 'Pedido entregue', icon: 'pi pi-check-circle' },
  SOLITED_CANCELLATION: { label: 'Cancelamento solicitado', icon: 'pi pi-exclamation-circle' },
  CANCELLED: { label: 'Pedido cancelado', icon: 'pi pi-times-circle' }
}

const PAYMENT_STATUS: Record<string, { label: string; description: string; icon: string; tone: string }> = {
  PENDING: { label: 'Pagamento pendente', description: 'Finalize o pagamento para confirmar seu pedido.', icon: 'pi pi-clock', tone: 'warning' },
  PROCESSING: { label: 'Pagamento em processamento', description: 'A confirmação pode levar alguns minutos.', icon: 'pi pi-spin pi-spinner', tone: 'info' },
  PAID: { label: 'Pagamento confirmado', description: 'O pagamento deste pedido foi aprovado.', icon: 'pi pi-check-circle', tone: 'success' },
  FAILED: { label: 'Pagamento não concluído', description: 'Faça uma nova tentativa para concluir o pedido.', icon: 'pi pi-exclamation-circle', tone: 'danger' },
  REFUNDED: { label: 'Pagamento reembolsado', description: 'O valor deste pedido foi devolvido.', icon: 'pi pi-replay', tone: 'neutral' }
}

const PAYMENT_METHOD: Record<string, string> = {
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão de crédito',
  BANK_SLIP: 'Boleto bancário'
}

const STATUS_PROGRESS: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  IN_PRODUCTION: 2,
  SHIPPED: 3,
  COMPLETED: 4
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

const formatDate = (value?: string | null) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

const formatDateTime = (value?: string | null) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function getCurrentStatus(services: OrderService[]) {
  const statuses = services.map(service => service.status)
  if (statuses.includes('SOLITED_CANCELLATION')) return 'SOLITED_CANCELLATION'
  if (statuses.length > 0 && statuses.every(status => status === 'CANCELLED')) return 'CANCELLED'

  return statuses
    .filter(status => status in STATUS_PROGRESS)
    .sort((a, b) => STATUS_PROGRESS[a] - STATUS_PROGRESS[b])[0] ?? 'PENDING'
}

function getStepState(step: number, currentStep: number): StepState {
  if (step < currentStep) return 'completed'
  if (step === currentStep) return 'current'
  return 'pending'
}

function OrderProgress({ order, status }: { order: OrderOneType; status: string }) {
  const isEncomenda = order.sale_type === 'ENCOMENDA'
  const paymentComplete = ['PAID', 'REFUNDED'].includes(order.payment_status)
  const orderProgress = STATUS_PROGRESS[status] ?? 0
  const currentStep = !paymentComplete ? 1 : isEncomenda ? Math.max(2, orderProgress) : Math.max(2, orderProgress - 1)
  const steps = [
    { label: 'Pedido realizado', description: formatDate(order.createdAt), icon: 'pi pi-shopping-bag', state: 'completed' as StepState },
    { label: paymentComplete ? 'Pagamento confirmado' : 'Aguardando pagamento', description: PAYMENT_METHOD[order.payment_method] ?? undefined, icon: 'pi pi-credit-card', state: getStepState(1, currentStep) },
    ...(isEncomenda
      ? [{ label: status === 'IN_PRODUCTION' ? 'Em produção' : 'Produção', description: formatDate(order.order_services[0]?.estimated_ready_at) ?? undefined, icon: 'pi pi-cog', state: getStepState(2, currentStep) }]
      : []),
    { label: status === 'SHIPPED' ? 'Em transporte' : 'Envio', description: order.order_services[0]?.tracking_code ?? undefined, icon: 'pi pi-truck', state: getStepState(isEncomenda ? 3 : 2, currentStep) },
    { label: 'Entregue', description: formatDate(order.order_services[0]?.estimated_delivery_at) ?? undefined, icon: 'pi pi-check-circle', state: getStepState(isEncomenda ? 4 : 3, currentStep) }
  ]

  if (['SOLITED_CANCELLATION', 'CANCELLED'].includes(status)) {
    return (
      <div className={`order-detail__notice order-detail__notice--${status === 'CANCELLED' ? 'danger' : 'warning'}`}>
        <i className={ORDER_STATUS[status].icon} aria-hidden="true" />
        <div>
          <strong>{ORDER_STATUS[status].label}</strong>
          <p>{status === 'CANCELLED' ? 'Este pedido foi cancelado.' : 'Recebemos sua solicitação e ela está sendo analisada.'}</p>
        </div>
      </div>
    )
  }

  return (
    <ol className="order-progress" aria-label="Acompanhamento do pedido">
      {steps.map(step => (
        <li className={`order-progress__step order-progress__step--${step.state}`} key={step.label}>
          <span className="order-progress__marker" aria-hidden="true"><i className={step.icon} /></span>
          <div>
            <strong>{step.label}</strong>
            {step.description ? <span>{step.description}</span> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

function ShipmentCard({ service, index }: { service: OrderService; index: number }) {
  const delivery = service.order_item.find(item => item.delivery_estimate)?.delivery_estimate
  const readyAt = formatDate(service.estimated_ready_at)
  const deliveryAt = formatDate(service.estimated_delivery_at)
  const serviceStatus = ORDER_STATUS[service.status] ?? ORDER_STATUS.PENDING

  return (
    <article className="order-shipment">
      <header className="order-shipment__header">
        <div>
          <span>Remessa {index + 1}</span>
          <h2>{service.transformation_workshop?.name ?? `Remessa ${service.uid}`}</h2>
          <p>{service.uid}</p>
        </div>
        <span className={`order-status-badge order-status-badge--${service.status.toLowerCase()}`}>
          <i className={serviceStatus.icon} aria-hidden="true" /> {serviceStatus.label}
        </span>
      </header>

      <div className="order-shipment__products">
        {service.order_item.map(item => {
          const productImage = item.product.product_image?.[0]?.img_url
          return (
            <div className="order-product" key={item.id}>
              <div className="order-product__image">
                {productImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={productImage} alt={item.product.name} />
                ) : (
                  <i className="pi pi-shopping-bag" aria-hidden="true" />
                )}
              </div>
              <div className="order-product__copy">
                <strong>{item.product.name}</strong>
                {item.product.description ? <p>{item.product.description}</p> : null}
                <span>{item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'} · {formatCurrency(item.unit_price)} cada</span>
              </div>
              <strong className="order-product__total">{formatCurrency(item.total_price)}</strong>
            </div>
          )
        })}
      </div>

      <dl className="order-shipment__details">
        <div><dt><i className="pi pi-shop" aria-hidden="true" /> Oficina responsável</dt><dd>{service.transformation_workshop?.name ?? 'Não informada'}</dd></div>
        {readyAt ? <div><dt>Produção estimada</dt><dd>{readyAt}</dd></div> : null}
        {deliveryAt ? <div><dt>Entrega estimada</dt><dd>{deliveryAt}</dd></div> : null}
        {delivery ? <div><dt>Entrega</dt><dd>{delivery.carrier || 'Transportadora'} · {delivery.service || 'Serviço'} · {delivery.deliveryTime} dias úteis</dd></div> : null}
        {service.tracking_code ? <div><dt>Código de rastreio</dt><dd>{service.tracking_code}{service.tracking_carrier ? ` · ${service.tracking_carrier}` : ''}</dd></div> : null}
      </dl>
    </article>
  )
}

const OrderCard: React.FC<OrderProps> = ({ order }) => {
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false)
  const router = useRouter()
  const controllerOrder = OrderController()
  const currentStatus = useMemo(() => getCurrentStatus(order.order_services ?? []), [order.order_services])
  const status = ORDER_STATUS[currentStatus] ?? ORDER_STATUS.PENDING
  const payment = PAYMENT_STATUS[order.payment_status] ?? PAYMENT_STATUS.PENDING
  const blockedStatuses = ['SOLITED_CANCELLATION', 'CANCELLED']
  const canPay = ['PENDING', 'FAILED'].includes(order.payment_status) && !order.order_services.some(service => blockedStatuses.includes(service.status))
  const canCancel = order.order_services.length > 0 && order.order_services.every(service => ['PENDING', 'CONFIRMED', 'IN_PRODUCTION'].includes(service.status))

  const handleCancel = () => {
    controllerOrder.OrderUpdateAction(String(order.id), {
      status: 'SOLITED_CANCELLATION'
    })
  }

  return (
    <div className="order-detail">
      <header className="order-detail__hero">
        <div className="order-detail__identity">
          <span className="order-detail__eyebrow">Pedido</span>
          <h1>{order.uid}</h1>
          <p>{formatDateTime(order.createdAt) ? `Realizado em ${formatDateTime(order.createdAt)}` : 'Acompanhe os detalhes do seu pedido'}</p>
          <div className="order-detail__badges">
            <ZSaleTypeBadge saleType={order.sale_type} />
            <span className={`order-status-badge order-status-badge--${currentStatus.toLowerCase()}`}><i className={status.icon} aria-hidden="true" /> {status.label}</span>
            <span className={`order-payment-badge order-payment-badge--${payment.tone}`}><i className={payment.icon} aria-hidden="true" /> {payment.label}</span>
          </div>
        </div>
        <div className="order-detail__hero-summary">
          <span>Valor total</span>
          <strong>{formatCurrency(order.total_amount)}</strong>
          <div className="order-detail__hero-actions">
            {canPay ? <ZButton icon="pi pi-credit-card" label="Pagar agora" onClick={() => router.push(`/payment?id=${order.id}`)} severity="success" /> : null}
            {canCancel ? <ZButton icon="pi pi-undo" label="Solicitar cancelamento" onClick={() => setCancelDialogVisible(true)} outlined severity="danger" /> : null}
          </div>
        </div>
      </header>

      <section className="order-detail__progress-card" aria-labelledby="order-progress-title">
        <div className="order-detail__section-heading"><span>Acompanhamento</span><h2 id="order-progress-title">Status do pedido</h2></div>
        <OrderProgress order={order} status={currentStatus} />
      </section>

      <div className="order-detail__layout">
        <section className="order-detail__shipments" aria-label="Remessas e produtos">
          {order.order_services.map((service, index) => <ShipmentCard service={service} index={index} key={service.id} />)}
        </section>

        <aside className="order-detail__sidebar" aria-label="Resumo do pedido">
          <section className={`order-summary-card order-summary-card--${payment.tone}`}>
            <div className="order-summary-card__heading">
              <span className="order-summary-card__icon"><i className={payment.icon} aria-hidden="true" /></span>
              <div><h2>{payment.label}</h2><p>{payment.description}</p></div>
            </div>
            <dl className="order-summary-card__list">
              <div><dt>Forma de pagamento</dt><dd>{PAYMENT_METHOD[order.payment_method] ?? 'Não informada'}</dd></div>
              <div><dt>Total</dt><dd>{formatCurrency(order.total_amount)}</dd></div>
            </dl>
            {canPay ? <ZButton icon="pi pi-credit-card" label="Realizar pagamento" onClick={() => router.push(`/payment?id=${order.id}`)} severity="success" className="order-summary-card__button" /> : null}
          </section>

          <section className="order-summary-card">
            <div className="order-summary-card__title"><i className="pi pi-map-marker" aria-hidden="true" /><h2>Endereço de entrega</h2></div>
            <address>
              <strong>{order.order_delivery_address.name || order.user.name}</strong>
              <span>{order.order_delivery_address.address}, {order.order_delivery_address.number}</span>
              {order.order_delivery_address.complement ? <span>{order.order_delivery_address.complement}</span> : null}
              <span>{order.order_delivery_address.neighborhood}</span>
              <span>{order.order_delivery_address.city.name} / {order.order_delivery_address.state.acronym}</span>
              <span>CEP {order.order_delivery_address.cep}</span>
            </address>
          </section>

          {canCancel ? (
            <section className="order-detail__support">
              <h2>Precisa de ajuda?</h2>
              <p>Se houver algum problema com este pedido, você pode solicitar uma análise de cancelamento.</p>
              <button type="button" onClick={() => setCancelDialogVisible(true)}>Solicitar cancelamento</button>
            </section>
          ) : null}
        </aside>
      </div>

      <OrderReviews order={order} />

      <ZConfirmDialog
        accept={handleCancel}
        acceptLabel="Solicitar cancelamento"
        header="Solicitar cancelamento"
        message="Deseja solicitar o cancelamento deste pedido? A solicitação será analisada antes da confirmação."
        onHide={() => setCancelDialogVisible(false)}
        rejectLabel="Manter pedido"
        visible={cancelDialogVisible}
      />
    </div>
  )
}

export default OrderCard
