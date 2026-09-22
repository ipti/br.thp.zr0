// Funções puras de montagem de mensagem/link do WhatsApp. Sem dependência de
// React — usadas tanto pelo checkout do carrinho quanto pelo da encomenda.

export type WhatsAppOrderItem = {
  name: string
  quantity: number
  price: number
}

export type WhatsAppCartOrder = {
  orderReference: string
  items: WhatsAppOrderItem[]
  subtotal: number
  shippingTotal: number
  total: number
  addressSummary?: string
  paymentMethodLabel?: string
}

export type WhatsAppEncomendaOrder = {
  orderReference: string
  productName: string
  quantity: number
  planLabel: string
  maxDeliveryAt: string | Date
  productSubtotal: number
  freightTotal: number
  estimatedTotal: number
  addressSummary?: string
  paymentMethodLabel?: string
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function buildCartWhatsAppMessage(order: WhatsAppCartOrder): string {
  const lines = [
    'Olá! Acabei de finalizar um pedido no site:',
    '',
    `Pedido #${order.orderReference}`,
    '',
    ...order.items.map(
      item => `• ${item.name} (x${item.quantity}) — ${formatCurrency(item.price)} cada`
    ),
    '',
    `Subtotal: ${formatCurrency(order.subtotal)}`,
    `Frete: ${formatCurrency(order.shippingTotal)}`,
    `Total: ${formatCurrency(order.total)}`,
  ]

  if (order.addressSummary) {
    lines.push('', `Entrega: ${order.addressSummary}`)
  }

  if (order.paymentMethodLabel) {
    lines.push(`Pagamento preferido: ${order.paymentMethodLabel}`)
  }

  lines.push('', 'Aguardo contato para combinar entrega e pagamento!')

  return lines.join('\n')
}

export function buildEncomendaWhatsAppMessage(order: WhatsAppEncomendaOrder): string {
  const deliveryDate = new Date(order.maxDeliveryAt).toLocaleDateString('pt-BR')
  const unitLabel = order.quantity === 1 ? 'unidade' : 'unidades'

  const lines = [
    'Olá! Acabei de finalizar uma encomenda no site:',
    '',
    `Pedido #${order.orderReference}`,
    '',
    `• ${order.productName} — ${order.quantity} ${unitLabel}`,
    `  Plano: ${order.planLabel}`,
    `  Entrega prevista: ${deliveryDate}`,
    '',
    `Produto: ${formatCurrency(order.productSubtotal)}`,
    `Frete estimado: ${formatCurrency(order.freightTotal)}`,
    `Total estimado: ${formatCurrency(order.estimatedTotal)}`,
  ]

  if (order.addressSummary) {
    lines.push('', `Entrega: ${order.addressSummary}`)
  }

  if (order.paymentMethodLabel) {
    lines.push(`Pagamento preferido: ${order.paymentMethodLabel}`)
  }

  lines.push('', 'Aguardo contato para combinar entrega e pagamento!')

  return lines.join('\n')
}

// Usada na tela de acompanhamento do pedido (/profile/order/[id]) quando o
// cliente ainda não entrou em contato — link "Falar no WhatsApp".
export function buildOrderFollowUpWhatsAppMessage(orderReference: string): string {
  return `Olá! Meu pedido #${orderReference} está aguardando contato. Podem me ajudar a continuar?`
}

export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const digits = phoneNumber.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function openWhatsApp(phoneNumber: string, message: string): void {
  const url = buildWhatsAppLink(phoneNumber, message)
  window.open(url, '_blank', 'noopener,noreferrer')
}
