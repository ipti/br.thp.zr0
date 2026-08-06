// Passo 3 da jornada de Encomenda ("Confirmação"). Isolado de src/app/cart/ —
// nunca importar useCartStore/useCartStepsStore/CardAddress do carrinho aqui;
// a seleção de endereço é própria desta tela, com estado local.
'use client'
import { useState } from 'react'
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

export default function Confirmation({
  handleActiveIndex,
}: {
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
    <div>
      <div className="flex flex-row align-items-center gap-2 mb-3">
        <h3 className="m-0">Resumo do Pedido de Encomenda</h3>
        <ZSaleTypeBadge saleType="ENCOMENDA" />
      </div>

      <p>Modo escolhido: {SIMULATION_MODE_LABEL[productionOrder.simulationMode]}</p>
      <p>Custo total: R$ {plan.totalCost.toFixed(2)}</p>
      <p>
        Entrega estimada até{' '}
        {new Date(plan.maxDeliveryAt).toLocaleDateString('pt-BR')}
      </p>

      <ul>
        {plan.shipments.map(shipment => (
          <li key={shipment.workshopId}>
            {shipment.workshopName} — {shipment.quantity} unidades — pronto em{' '}
            {new Date(shipment.readyAt).toLocaleDateString('pt-BR')}
          </li>
        ))}
      </ul>

      <div className="p-2" />
      <h4>Endereço de entrega</h4>
      <div className="grid">
        {addressList?.customer?.address_customer?.map(item => (
          <div key={item.id} className="col-12 md:col-6">
            <ZCard
              style={{
                border:
                  item.id === addressSelectedId
                    ? '1px solid var(--primary-color)'
                    : '',
              }}
              onClick={() => setAddressSelectedId(item.id)}
            >
              <div className="flex flex-row align-items-center gap-2">
                <ZRadioButton checked={item.id === addressSelectedId} readOnly />
                <div>
                  <p className="m-0">
                    {item.address}, {item.number}
                  </p>
                  <p className="m-0">{item.neighborhood}</p>
                </div>
              </div>
            </ZCard>
          </div>
        ))}
      </div>

      <div className="p-2" />
      <div className="flex flex-column gap-2 mb-3" style={{ maxWidth: 320 }}>
        <label>Método de pagamento</label>
        <ZDropdown
          value={paymentMethod}
          options={[
            { label: 'PIX', value: 'PIX' },
            { label: 'Cartão de crédito', value: 'CREDIT_CARD' },
            { label: 'Boleto', value: 'BANK_SLIP' },
          ]}
          onChange={e => setPaymentMethod(e.value)}
        />
      </div>

      <div className="flex flex-row gap-2">
        <ZButton
          label="Voltar"
          severity="secondary"
          text
          onClick={() => handleActiveIndex(1)}
        />
        <ZButton
          label="Confirmar pedido"
          disabled={!selectedAddress}
          loading={loading}
          onClick={handleConfirm}
        />
      </div>
    </div>
  )
}
