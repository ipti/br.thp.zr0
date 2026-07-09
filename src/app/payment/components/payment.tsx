'use client'
import ZCard from '@/components/card/card'
import CheckoutComponent from '@/components/payment/payment'
import { useParams, useSearchParams } from 'next/navigation'
import {
  useFetchRequestOrderOne,
  useFetchRequestPaymentIntentOne
} from '../service/query'
import { OrderOneType, PaymentIntentLike } from '../service/types'
import './payment.css'

export default function PaymentComponent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const { data: orderService } = useFetchRequestOrderOne(id?.toString())
  const order: OrderOneType | undefined = orderService
  const { data: paymentService } = useFetchRequestPaymentIntentOne(order?.id)
  const paymentIntent = paymentService as PaymentIntentLike | undefined
  const pixInfo = paymentIntent?.next_action?.pix_display_qr_code
  const boletoInfo = paymentIntent?.next_action?.boleto_display_details


  return (
    <div className="grid payment-container  ">
      {order && (
        <div className="card">
          {/* Itens */}
          <div className='flex flex-column md:flex-row justify-content-between gap-2'>
            <div>
              <h1>
                Detalhes de pagamento
              </h1>
            </div>
            <div>
              <h2>
                R${' '}
                {(
                  order.total_amount 
                ).toFixed(2)}
              </h2>
              <p>
                Valor Total
              </p>
            </div>

          </div>
          {order?.order_services?.map((item) => {

            const delivery = item?.order_item
            const totalProducts = item?.order_item.reduce(
              (acc: number, item: any) => acc + item.quantity,
              0
            )
            return (
              <>

                <section className='mt-2'>
                  <h3>Itens do Pedido ({totalProducts})</h3>

                  <div>
                    {item.order_item.map((item: any) => (
                      <div key={item.id} className="item-box grid">
                        <div>
                          <strong className="product-name">
                            {item.product.name}
                          </strong>
                          <p className="sub">Qtd: {item.quantity}</p>
                        </div>

                        <div className="right">
                          <p>
                            Preço Unitário:{' '}
                            <strong>R$ {item.unit_price.toFixed(2)}</strong>
                          </p>
                          <p>
                            Total: <strong>R$ {item.total_price.toFixed(2)}</strong>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Delivery */}
                <section className="delivery-section">
                  <h3>Entrega</h3>

                  {delivery ? (
                    <div className="delivery-box">
                      {delivery.map(item => (
                        <div key={item.id}>
                          <p>
                            <strong>Transportadora:</strong>{' '}
                            {item.delivery_estimate.carrier}
                          </p>
                          <p>
                            <strong>Serviço:</strong> {item.delivery_estimate.service}
                          </p>
                          <p>
                            <strong>Prazo:</strong>{' '}
                            {item.delivery_estimate.deliveryTime} dias
                          </p>
                          <p>
                            <strong>Custo:</strong> R${' '}
                            {item.delivery_estimate.cost.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Sem informações de entrega</p>
                  )}
                </section>

                {/* Total */}
                <footer className="total-order-box">
                  <p>
                    Total do Pedido:
                    <span className="total-value">
                      R${' '}
                      {(
                        item.total_amount
                      ).toFixed(2)}
                    </span>
                  </p>
                </footer>
              </>
            )
          })}
        </div>
      )}

      {order && (
        <div>
          {order.payment_method === 'PIX' && pixInfo ? (
            <ZCard className="mb-3 p-3">
              <h3>Pagamento via PIX</h3>
              <p>Escaneie o QR Code ou copie o código abaixo.</p>
              {pixInfo.image_url_png ? (
                <img
                  src={pixInfo.image_url_png}
                  alt="QR Code PIX"
                  style={{ maxWidth: 220, width: '100%' }}
                />
              ) : null}
              {pixInfo.data ? (
                <div className="mt-2">
                  <textarea
                    readOnly
                    value={pixInfo.data}
                    style={{ width: '100%', minHeight: 120 }}
                  />
                </div>
              ) : null}
            </ZCard>
          ) : null}
          {order.payment_method === 'BANK_SLIP' && boletoInfo?.hosted_voucher_url ? (
            <ZCard className="mb-3 p-3">
              <h3>Boleto gerado</h3>
              <a href={boletoInfo.hosted_voucher_url} target="_blank">
                Abrir boleto
              </a>
            </ZCard>
          ) : null}
          <CheckoutComponent
            clientSecret={paymentIntent?.client_secret ?? undefined}
          />
        </div>
      )}
    </div>
  )
}
