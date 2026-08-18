'use client'

import { formatCurrency } from '@/app/cart/utils'
import ZCard from '@/components/card/card'
import { ZButton } from '@/components/button/button'
import CheckoutComponent from '@/components/payment/payment'
import ZSkeleton from '@/components/skeleton/skeleton'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  useFetchRequestOrderOne,
  useFetchRequestPaymentIntentOne
} from '../service/query'
import { OrderOneType, PaymentIntentLike } from '../service/types'
import './payment.css'

export default function PaymentComponent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [copyFeedback, setCopyFeedback] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const hasFocusedHeading = useRef(false)
  const {
    data: orderService,
    isLoading: isLoadingOrder,
    isError: isOrderError,
    refetch: refetchOrder
  } = useFetchRequestOrderOne(id ?? undefined)
  const order = orderService as OrderOneType | undefined
  const canPay = order?.payment_status === 'PENDING' || order?.payment_status === 'FAILED'
  const {
    data: paymentService,
    isLoading: isLoadingPayment,
    isError: isPaymentError,
    refetch: refetchPayment
  } = useFetchRequestPaymentIntentOne(order?.id, canPay)
  const paymentIntent = paymentService as PaymentIntentLike | undefined
  const pixInfo = paymentIntent?.next_action?.pix_display_qr_code
  const boletoInfo = paymentIntent?.next_action?.boleto_display_details

  useEffect(() => {
    if (order && !hasFocusedHeading.current) {
      hasFocusedHeading.current = true
      headingRef.current?.focus()
    }
  }, [order])

  const copyPixCode = async () => {
    if (!pixInfo?.data) return
    try {
      await navigator.clipboard.writeText(pixInfo.data)
      setCopyFeedback('Código PIX copiado.')
    } catch {
      setCopyFeedback('Não foi possível copiar automaticamente. Selecione o código e copie manualmente.')
    }
  }

  if (!id) {
    return <div className="payment-state error" role="alert">Pedido não informado.</div>
  }

  if (isLoadingOrder) {
    return <ZSkeleton width="100%" height="18rem" />
  }

  if (isOrderError || !order) {
    return (
      <div className="payment-state error" role="alert">
        <span>Não foi possível carregar este pedido. Verifique se ele pertence à sua conta.</span>
        <ZButton type="button" label="Tentar novamente" outlined onClick={() => void refetchOrder()} />
      </div>
    )
  }

  return (
    <main className="payment-page">
      <header className="payment-heading">
        <div>
          <span>Pedido {order.uid}</span>
          <h1 ref={headingRef} tabIndex={-1}>Pagamento</h1>
          <p>Confira o pedido e conclua o pagamento com segurança.</p>
        </div>
        <div className="payment-heading-total">
          <strong>{formatCurrency(order.total_amount)}</strong>
          <span>Valor total</span>
        </div>
      </header>

      {order.payment_status === 'PAID' && (
        <div className="payment-state success" role="status">
          <i className="pi pi-check-circle" aria-hidden="true" />
          <div><strong>Pagamento confirmado</strong><p>Seu pedido já está pago.</p></div>
          <div className="payment-state-actions">
            <Link href={`/profile/order/${order.id}`}>Ver pedido</Link>
            <Link href="/product">Continuar comprando</Link>
          </div>
        </div>
      )}

      {order.payment_status === 'PROCESSING' && (
        <div className="payment-state info" role="status">
          <i className="pi pi-clock" aria-hidden="true" />
          <div><strong>Pagamento em processamento</strong><p>A confirmação pode levar alguns minutos.</p></div>
          <Link href={`/profile/order/${order.id}`}>Acompanhar pedido</Link>
        </div>
      )}

      {order.payment_status === 'PENDING' && (
        <div className="payment-state info" role="status">
          <i className="pi pi-info-circle" aria-hidden="true" />
          <div><strong>Pagamento pendente</strong><p>Conclua o pagamento usando as instruções abaixo.</p></div>
        </div>
      )}

      {order.payment_status === 'FAILED' && (
        <div className="payment-state error" role="alert">
          <i className="pi pi-exclamation-circle" aria-hidden="true" />
          <div><strong>Pagamento não concluído</strong><p>Revise os dados e faça uma nova tentativa segura.</p></div>
        </div>
      )}

      {order.payment_status === 'REFUNDED' && (
        <div className="payment-state info" role="status">
          <span>Este pedido foi reembolsado e não aceita um novo pagamento.</span>
          <Link href={`/profile/order/${order.id}`}>Ver pedido</Link>
        </div>
      )}

      <div className="payment-layout">
        <section className="payment-order-card" aria-labelledby="payment-order-title">
          <h2 id="payment-order-title">Resumo do pedido</h2>
          {order.order_services?.map(service => (
            <div className="payment-shipment" key={service.id}>
              <h3>Remessa {service.uid}</h3>
              {service.order_item.map(item => (
                <div key={item.id} className="payment-item">
                  <div>
                    <strong>{item.product.name}</strong>
                    <span>{item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'}</span>
                  </div>
                  <div className="payment-item-values">
                    <span>{formatCurrency(item.unit_price)} cada</span>
                    <strong>{formatCurrency(item.total_price)}</strong>
                  </div>
                </div>
              ))}
              <div className="payment-shipping-details">
                {service.order_item.map(item => (
                  <p key={`delivery-${item.id}`}>
                    <i className="pi pi-truck" aria-hidden="true" />
                    {item.delivery_estimate.carrier} · {item.delivery_estimate.service} · {item.delivery_estimate.deliveryTime} dias úteis · {formatCurrency(item.delivery_estimate.cost)}
                  </p>
                ))}
              </div>
              <div className="payment-shipment-total">
                <span>Total da remessa</span>
                <strong>{formatCurrency(service.total_amount)}</strong>
              </div>
            </div>
          ))}
        </section>

        {canPay && (
          <aside className="payment-action-column" aria-label="Realizar pagamento">
            {isLoadingPayment && <ZSkeleton width="100%" height="14rem" />}
            {isPaymentError && (
              <div className="payment-state error" role="alert">
                <span>Não foi possível iniciar o pagamento.</span>
                <ZButton type="button" label="Tentar novamente" outlined onClick={() => void refetchPayment()} />
              </div>
            )}

            {order.payment_method === 'PIX' && pixInfo && (
              <ZCard className="payment-instructions">
                <h2>Pagamento via PIX</h2>
                <p>Escaneie o QR Code ou copie o código.</p>
                {pixInfo.image_url_png && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pixInfo.image_url_png} alt="QR Code PIX do pedido" className="payment-pix-qr" />
                )}
                {pixInfo.data && (
                  <>
                    <label htmlFor="pix-code">Código PIX copia e cola</label>
                    <textarea id="pix-code" readOnly value={pixInfo.data} />
                    <button type="button" className="payment-copy-button" onClick={() => void copyPixCode()}>
                      <i className="pi pi-copy" aria-hidden="true" /> Copiar código PIX
                    </button>
                    {copyFeedback && <p role="status" aria-live="polite">{copyFeedback}</p>}
                  </>
                )}
              </ZCard>
            )}

            {order.payment_method === 'BANK_SLIP' && boletoInfo?.hosted_voucher_url && (
              <ZCard className="payment-instructions">
                <h2>Boleto gerado</h2>
                <p>O pagamento pode levar até três dias úteis para ser compensado.</p>
                <a href={boletoInfo.hosted_voucher_url} target="_blank" rel="noopener noreferrer">
                  Abrir boleto <i className="pi pi-external-link" aria-hidden="true" />
                </a>
              </ZCard>
            )}

            {!isPaymentError && paymentIntent?.client_secret && (
              <CheckoutComponent
                clientSecret={paymentIntent.client_secret}
                orderId={order.id}
                onConfirmed={async () => refetchPayment()}
              />
            )}
          </aside>
        )}
      </div>
    </main>
  )
}
