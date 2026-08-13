// Passo 3 da jornada de Encomenda ("Confirmação"). Isolado de src/app/cart/ —
// nunca importar useCartStore/useCartStepsStore/CardAddress do carrinho aqui;
// a seleção de endereço é própria desta tela, com estado local.
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ZButton } from '@/components/button/button'
import ZCard from '@/components/card/card'
import ZRadioButton from '@/components/radio_button/radio_button'
import ZDropdown from '@/components/dropdown/dropdown'
import { ZSaleTypeBadge } from '@/components/badge/sale_type_badge'
import { useFetchUserToken } from '@/service/global_request/query'
import { UserGlobal } from '@/service/global_request/type'
import { useFetchRequestGetAddressCustomer } from '@/app/profile/address/service/query'
import { AddressList, Address as ProfileAddress } from '@/app/profile/address/service/type'
import { ProductionOrderController } from '../service/controller'
import { useProductionOrderStore } from '../zustand/zustand'
import { SIMULATION_MODE_LABEL } from '../service/constants'
import { ProductOne } from '@/app/seller/product/one/service/type'
import Link from 'next/link'
import './confirmation.css'

export default function Confirmation({
  product,
  handleActiveIndex,
}: {
  product: ProductOne | null
  handleActiveIndex: (i: number) => void
}) {
  const { ReserveProductionOrderAction, CreateProductionOrderAction } =
    ProductionOrderController()
  const history = useRouter()

  const productionOrder = useProductionOrderStore(state => state.productionOrder)
  const getSelectedPlan = useProductionOrderStore(state => state.getSelectedPlan)
  const reset = useProductionOrderStore(state => state.reset)

  const { data: userRequest } = useFetchUserToken()
  const user: UserGlobal | undefined = userRequest

  const { data: addressCustomerRequest } = useFetchRequestGetAddressCustomer()
  const addressList: AddressList | undefined = addressCustomerRequest

  const [addressSelectedId, setAddressSelectedId] = useState<number>()
  const [paymentMethod, setPaymentMethod] = useState<
    'PIX' | 'CREDIT_CARD' | 'BANK_SLIP'
  >('PIX')
  const [loading, setLoading] = useState(false)

  const plan = getSelectedPlan()

  useEffect(() => {
    const addresses = addressList?.customer?.address_customer
    if (!addressSelectedId && addresses?.length) {
      setAddressSelectedId(
        addresses.find(address => address.is_default)?.id ?? addresses[0].id
      )
    }
  }, [addressList, addressSelectedId])

  if (!plan || !productionOrder.productId || !productionOrder.simulationMode) {
    return (
      <p>
        Volte ao passo anterior e selecione um modo de simulação antes de
        confirmar o pedido.
      </p>
    )
  }

  const selectedAddress: ProfileAddress | undefined =
    addressList?.customer?.address_customer?.find(
      item => item.id === addressSelectedId
    )

  const productSubtotal =
    (product?.price ?? 0) * (productionOrder.desiredQuantity ?? 0)
  const estimatedTotal = productSubtotal + plan.totalCost

  const handleConfirm = () => {
    if (!user || !selectedAddress) return

    setLoading(true)

    const shipments = plan.shipments.map(shipment => ({
      workshopId: shipment.workshopId,
      quantity: shipment.quantity,
    }))

    ReserveProductionOrderAction(
      {
        userId: user.id,
        productId: productionOrder.productId!,
        simulationMode: productionOrder.simulationMode!,
        shipments,
      },
      () => {
        CreateProductionOrderAction(
          {
            userId: user.id,
            productId: productionOrder.productId!,
            simulationMode: productionOrder.simulationMode!,
            shipments,
            paymentMethod,
            address: {
              name: selectedAddress.name,
              phone: selectedAddress.phone,
              cep: selectedAddress.cep,
              address: selectedAddress.address,
              number: selectedAddress.number,
              complement: selectedAddress.complement,
              neighborhood: selectedAddress.neighborhood,
              stateId: selectedAddress.state.id,
              cityId: selectedAddress.city.id,
            },
          },
          result => {
            reset()
            const order = result.orders[0]
            history.push(`/profile/order/${order.id}`)
          },
          setLoading
        )
      },
      setLoading
    )
  }

  return (
    <div className="confirmation-step">
      <div className="production-order-section-heading confirmation-heading">
        <div>
          <div className="confirmation-title-line">
            <h2>Revise e confirme sua encomenda</h2>
            <ZSaleTypeBadge saleType="ENCOMENDA" />
          </div>
          <p>
            Confira o plano de produção, o endereço e os valores estimados
            antes de reservar a capacidade das oficinas.
          </p>
        </div>
        <div className="confirmation-deadline">
          <i className="pi pi-calendar" />
          <span>Entrega estimada até</span>
          <strong>
            {new Date(plan.maxDeliveryAt).toLocaleDateString('pt-BR')}
          </strong>
        </div>
      </div>

      <div className="confirmation-grid">
        <section className="confirmation-panel">
          <div className="confirmation-panel-title">
            <div>
              <span>Plano escolhido</span>
              <h3>{SIMULATION_MODE_LABEL[productionOrder.simulationMode]}</h3>
            </div>
            <i className="pi pi-check-circle" aria-hidden="true" />
          </div>

          <div className="confirmation-product-row">
            {product?.product_image?.[0]?.img_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.product_image[0].img_url} alt={product.name} />
            ) : null}
            <div>
              <strong>{product?.name ?? 'Produto'}</strong>
              <span>{productionOrder.desiredQuantity} unidades</span>
            </div>
            <strong>
              {productSubtotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </strong>
          </div>

          <h4>Produção e remessas</h4>
          <div className="confirmation-shipments">
            {plan.shipments.map((shipment, index) => (
              <div key={shipment.workshopId}>
                <span className="confirmation-shipment-number">{index + 1}</span>
                <div>
                  <strong>{shipment.workshopName}</strong>
                  <span>
                    {shipment.quantity} unidades · prontas em{' '}
                    {new Date(shipment.readyAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <strong>
                  {shipment.freightCost.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </strong>
              </div>
            ))}
          </div>

          <div className="confirmation-totals">
            <div><span>Subtotal dos produtos</span><strong>{productSubtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
            <div><span>Frete estimado total</span><strong>{plan.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
            <div className="confirmation-grand-total"><span>Total estimado</span><strong>{estimatedTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
          </div>
        </section>

        <section className="confirmation-panel confirmation-options">
          <div className="confirmation-panel-title">
            <div>
              <span>Entrega</span>
              <h3>Endereço de entrega</h3>
            </div>
            <i className="pi pi-map-marker" aria-hidden="true" />
          </div>

          <div className="confirmation-addresses">
            {addressList?.customer?.address_customer?.map(item => (
              <ZCard
                key={item.id}
                className={`confirmation-address-card ${item.id === addressSelectedId ? 'confirmation-address-card--selected' : ''}`}
                onClick={() => setAddressSelectedId(item.id)}
              >
                <div className="confirmation-address-content">
                  <ZRadioButton checked={item.id === addressSelectedId} readOnly />
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.address}, {item.number}</p>
                    <span>{item.neighborhood} · CEP {item.cep}</span>
                  </div>
                </div>
              </ZCard>
            ))}
            {!addressList?.customer?.address_customer?.length ? (
              <div className="confirmation-address-empty">
                <i className="pi pi-map-marker" />
                <p>Nenhum endereço de entrega cadastrado.</p>
                <Link href="/profile/address">Cadastrar endereço</Link>
              </div>
            ) : null}
          </div>

          <div className="confirmation-payment">
            <label>Método de pagamento</label>
            <p>Escolha como deseja pagar após confirmar a reserva.</p>
            <ZDropdown
              value={paymentMethod}
              options={[
                { label: 'PIX', value: 'PIX' },
                { label: 'Cartão de crédito', value: 'CREDIT_CARD' },
                { label: 'Boleto', value: 'BANK_SLIP' },
              ]}
              onChange={e => setPaymentMethod(e.value)}
              className="w-full"
            />
          </div>
        </section>
      </div>

      <div className="production-order-actions">
        <ZButton
          label="Voltar"
          severity="secondary"
          text
          onClick={() => handleActiveIndex(1)}
        />
        <ZButton
          label="Confirmar encomenda"
          icon="pi pi-check"
          disabled={!selectedAddress}
          loading={loading}
          onClick={handleConfirm}
        />
      </div>
    </div>
  )
}
