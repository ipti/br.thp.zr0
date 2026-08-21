import Link from 'next/link'
import { formatCurrency } from '@/app/cart/utils'
import { ZSaleTypeBadge } from '@/components/badge/sale_type_badge'
import { formatDateToBR } from '@/utils/hook/format_data'
import { Order, OrderItem, OrderService } from '../../service/types'
import './card_order.css'

const PAYMENT_STATUS: Record<string, { label: string; icon: string; tone: string }> = {
  PENDING: { label: 'Pagamento pendente', icon: 'pi pi-clock', tone: 'warning' },
  PAID: { label: 'Pagamento aprovado', icon: 'pi pi-check-circle', tone: 'success' },
  FAILED: { label: 'Falha no pagamento', icon: 'pi pi-exclamation-circle', tone: 'danger' },
  REFUNDED: { label: 'Pagamento estornado', icon: 'pi pi-replay', tone: 'neutral' },
}

const ORDER_STATUS: Record<string, string> = {
  PENDING: 'Aguardando confirmação',
  CONFIRMED: 'Pedido confirmado',
  IN_PRODUCTION: 'Em produção',
  SHIPPED: 'Em transporte',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
  SOLITED_CANCELLATION: 'Cancelamento solicitado',
}

function getCurrentOrderStatus(services: OrderService[]) {
  const statuses = services.map(service => service.status)
  if (statuses.includes('SOLITED_CANCELLATION')) return 'SOLITED_CANCELLATION'
  if (statuses.includes('CANCELLED')) return 'CANCELLED'
  if (statuses.length > 0 && statuses.every(status => status === 'COMPLETED')) return 'COMPLETED'
  if (statuses.includes('IN_PRODUCTION')) return 'IN_PRODUCTION'
  if (statuses.includes('SHIPPED')) return 'SHIPPED'
  if (statuses.includes('CONFIRMED')) return 'CONFIRMED'
  return 'PENDING'
}

function latestDate(services: OrderService[], field: 'estimated_ready_at' | 'estimated_delivery_at') {
  const dates = services
    .map(service => service[field])
    .filter((date): date is string => Boolean(date))
    .map(date => new Date(date))
    .filter(date => !Number.isNaN(date.getTime()))
  if (dates.length === 0) return null
  return new Date(Math.max(...dates.map(date => date.getTime()))).toISOString()
}

function uniqueItems(items: OrderItem[]) {
  return Array.from(new Map(items.map(orderItem => [orderItem.product.id, orderItem])).values())
}

export default function CardOrder({ item }: { item: Order }) {
  const services = item.order_services ?? []
  const allItems = services.flatMap(service => service.order_item ?? [])
  const products = uniqueItems(allItems)
  const quantity = allItems.reduce((sum, orderItem) => sum + orderItem.quantity, 0)
  const servicesTotal = services.reduce((sum, service) => sum + service.total_amount, 0)
  const total = item.total_amount > 0 ? item.total_amount : servicesTotal
  const status = getCurrentOrderStatus(services)
  const payment = PAYMENT_STATUS[item.payment_status] ?? PAYMENT_STATUS.PENDING
  const deliveryDate = latestDate(services, 'estimated_delivery_at')
  const readyDate = latestDate(services, 'estimated_ready_at')
  const deadline = deliveryDate ?? readyDate
  const workshopCount = new Set(
    services.map(service => service.transformation_workshop_fk).filter(Boolean),
  ).size
  const firstProduct = products[0]?.product.name
  const remainingProducts = Math.max(products.length - 1, 0)

  return (
    <Link href={`/profile/order/${item.id}`} className="order-card" aria-label={`Ver detalhes do pedido ${item.uid}`}>
      <header className="order-card__header">
        <div>
          <span className="order-card__eyebrow">Pedido</span>
          <h2 className="order-card__id">#{item.uid}</h2>
        </div>
        {item.sale_type && <ZSaleTypeBadge saleType={item.sale_type} />}
      </header>

      <div className="order-card__status-row">
        <span className={`order-card__status order-card__status--${payment.tone}`}>
          <i className={payment.icon} aria-hidden="true" />
          {payment.label}
        </span>
        <span className={`order-card__progress order-card__progress--${status.toLowerCase()}`}>
          {ORDER_STATUS[status]}
        </span>
      </div>

      <section className="order-card__products" aria-label="Produtos do pedido">
        <div className="order-card__images" aria-hidden="true">
          {products.slice(0, 3).map(orderItem => {
            const image = orderItem.product.product_image?.[0]?.img_url
            return image ? (
              <img key={orderItem.product.id} src={image} alt="" className="order-card__image" />
            ) : (
              <span className="order-card__image order-card__image--fallback" key={orderItem.product.id}>
                <i className="pi pi-image" />
              </span>
            )
          })}
          {products.length === 0 && (
            <span className="order-card__image order-card__image--fallback"><i className="pi pi-shopping-bag" /></span>
          )}
        </div>
        <div className="order-card__product-copy">
          <strong>{firstProduct ?? 'Itens do pedido'}</strong>
          <span>
            {quantity || 0} {quantity === 1 ? 'unidade' : 'unidades'}
            {remainingProducts > 0 && ` · +${remainingProducts} ${remainingProducts === 1 ? 'produto' : 'produtos'}`}
          </span>
        </div>
      </section>

      <dl className="order-card__details">
        <div>
          <dt><i className="pi pi-calendar" aria-hidden="true" /> Realizado em</dt>
          <dd>{formatDateToBR(item.createdAt)}</dd>
        </div>
        <div>
          <dt><i className="pi pi-truck" aria-hidden="true" /> {deadline ? 'Previsão' : 'Produção'}</dt>
          <dd>{deadline ? formatDateToBR(deadline) : workshopCount > 0 ? `${workshopCount} ${workshopCount === 1 ? 'oficina' : 'oficinas'}` : 'A definir'}</dd>
        </div>
      </dl>

      <footer className="order-card__footer">
        <div>
          <span>Total do pedido</span>
          <strong>{formatCurrency(total || 0)}</strong>
        </div>
        <span className="order-card__action">Ver detalhes <i className="pi pi-arrow-right" aria-hidden="true" /></span>
      </footer>
    </Link>
  )
}
