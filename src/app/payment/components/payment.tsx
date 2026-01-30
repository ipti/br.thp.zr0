'use client'
import ZCard from '@/components/card/card'
import CheckoutComponent from '@/components/payment/payment'
import { useParams, useSearchParams } from 'next/navigation'
import {
  useFetchRequestOrderOne,
  useFetchRequestPaymentIntentOne
} from '../service/query'
import { OrderOneType } from '../service/types'
import './payment.css'

export default function PaymentComponent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const { data: orderService } = useFetchRequestOrderOne(id?.toString())
  const order: OrderOneType | undefined = orderService
  const { data: paymentService } = useFetchRequestPaymentIntentOne(order?.id)


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
                  order.total_amount +
                  (order.order_services?.reduce(
                    (sum, item) => sum + (item.order_item.reduce((acc, it) => acc + it.delivery_estimate.cost, 0)),
                    0
                  ) ?? 0)
                ).toFixed(2)}
              </h2>
              <p>
                Valor Total do Pedido
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
                        item.total_amount +
                        (delivery?.reduce(
                          (sum, item) => sum + item.delivery_estimate.cost,
                          0
                        ) ?? 0)
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
          <CheckoutComponent
            clientSecret={paymentService?.client_secret ?? undefined}
          />
        </div>
      )}
    </div>
  )
}
