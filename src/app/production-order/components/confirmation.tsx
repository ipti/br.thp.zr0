// Passo 3 da jornada de Encomenda ("Confirmação"). Este fluxo permanece
// isolado do carrinho e mantém seleção, validação e finalização próprias.
'use client'

import { useFetchRequestGetAddressCustomer } from '@/app/profile/address/service/query'
import {
  Address as ProfileAddress,
  AddressList,
} from '@/app/profile/address/service/type'
import { ProductOne } from '@/app/seller/product/one/service/type'
import { ZSaleTypeBadge } from '@/components/badge/sale_type_badge'
import { ZButton } from '@/components/button/button'
import ZRadioButton from '@/components/radio_button/radio_button'
import ZSkeleton from '@/components/skeleton/skeleton'
import { useFetchUserToken } from '@/service/global_request/query'
import { UserGlobal } from '@/service/global_request/type'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SIMULATION_MODE_LABEL } from '../service/constants'
import { CREATED_ORDER_SESSION_KEY } from '@/app/profile/order/constants'
import { ProductionOrderController } from '../service/controller'
import { useProductionOrderStore } from '../zustand/zustand'
import './confirmation_review.css'

type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'BANK_SLIP'

const PAYMENT_OPTIONS: Array<{
  value: PaymentMethod
  label: string
  description: string
  icon: string
}> = [
  {
    value: 'PIX',
    label: 'PIX',
    description: 'Pagamento rápido pelo aplicativo do seu banco.',
    icon: 'pi pi-bolt',
  },
  {
    value: 'CREDIT_CARD',
    label: 'Cartão de crédito',
    description: 'Os dados do cartão serão informados na próxima etapa.',
    icon: 'pi pi-credit-card',
  },
  {
    value: 'BANK_SLIP',
    label: 'Boleto',
    description: 'A compensação pode levar até três dias úteis.',
    icon: 'pi pi-file',
  },
]

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const onlyDigits = (value?: string) => value?.replace(/\D/g, '') ?? ''

export default function Confirmation({
  product,
  handleActiveIndex,
}: {
  product: ProductOne | null
  handleActiveIndex: (i: number) => void
}) {
  const { ReserveProductionOrderAction, CreateProductionOrderAction } =
    ProductionOrderController()
  const router = useRouter()
  const productionOrder = useProductionOrderStore(state => state.productionOrder)
  const getSelectedPlan = useProductionOrderStore(state => state.getSelectedPlan)
  const reset = useProductionOrderStore(state => state.reset)
  const { data: userRequest, isLoading: isLoadingUser } = useFetchUserToken()
  const { data: addressCustomerRequest, isLoading: isLoadingAddresses } =
    useFetchRequestGetAddressCustomer()

  const user: UserGlobal | undefined = userRequest
  const addressList: AddressList | undefined = addressCustomerRequest
  const [addressSelectedId, setAddressSelectedId] = useState<number>()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX')
  const [loading, setLoading] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const submissionLockRef = useRef(false)
  const validationSummaryRef = useRef<HTMLDivElement>(null)
  const plan = getSelectedPlan()

  useEffect(() => {
    const addresses = addressList?.customer?.address_customer
    if (!addressSelectedId && addresses?.length) {
      setAddressSelectedId(
        addresses.find(address => address.is_default)?.id ?? addresses[0].id,
      )
    }
  }, [addressList, addressSelectedId])

  if (!plan || !productionOrder.productId || !productionOrder.simulationMode) {
    return (
      <div className="confirmation-missing-plan" role="alert">
        <strong>Selecione um plano antes de confirmar.</strong>
        <p>Volte à simulação e escolha entre menor custo ou menor prazo.</p>
        <ZButton label="Voltar à simulação" onClick={() => handleActiveIndex(1)} />
      </div>
    )
  }

  const selectedAddress: ProfileAddress | undefined =
    addressList?.customer?.address_customer?.find(
      item => item.id === addressSelectedId,
    )
  const desiredQuantity = productionOrder.desiredQuantity ?? 0
  const productSubtotal = (product?.price ?? 0) * desiredQuantity
  const estimatedTotal = productSubtotal + plan.totalCost
  const isLoadingReview = isLoadingUser || isLoadingAddresses
  const allocatedQuantity = plan.shipments.reduce(
    (total, shipment) => total + shipment.quantity,
    0,
  )

  const validationErrors: string[] = []
  if (!isLoadingReview) {
    if (!user?.id) {
      validationErrors.push('Sua sessão expirou. Entre novamente para continuar.')
    }
    if (!product || desiredQuantity < 1) {
      validationErrors.push('Revise o produto e a quantidade da encomenda.')
    }
    if (!plan.shipments.length || allocatedQuantity !== desiredQuantity) {
      validationErrors.push('Selecione novamente um plano de produção válido.')
    }
    if (!selectedAddress) {
      validationErrors.push('Selecione um endereço de entrega.')
    } else if (
      !selectedAddress.name?.trim() ||
      !selectedAddress.phone?.trim() ||
      !selectedAddress.address?.trim() ||
      !selectedAddress.number?.trim() ||
      !selectedAddress.neighborhood?.trim() ||
      onlyDigits(selectedAddress.cep).length !== 8 ||
      !selectedAddress.city?.id ||
      !selectedAddress.state?.id
    ) {
      validationErrors.push('Complete o endereço selecionado antes de continuar.')
    }
    if (!PAYMENT_OPTIONS.some(option => option.value === paymentMethod)) {
      validationErrors.push('Selecione um método de pagamento válido.')
    }
    if (!Number.isFinite(estimatedTotal) || estimatedTotal < 0) {
      validationErrors.push('Não foi possível calcular o total da encomenda.')
    }
  }

  const focusValidationSummary = () => {
    requestAnimationFrame(() => validationSummaryRef.current?.focus())
  }

  const handleSubmissionError = (message: string) => {
    submissionLockRef.current = false
    setLoading(false)
    setCreateError(message)
    focusValidationSummary()
  }

  const handleConfirm = () => {
    if (submissionLockRef.current || loading || isLoadingReview) return

    setSubmitAttempted(true)
    setCreateError(null)
    if (validationErrors.length || !user || !selectedAddress) {
      focusValidationSummary()
      return
    }

    submissionLockRef.current = true
    setLoading(true)
    const shipments = plan.shipments.map(shipment => ({
      workshopId: shipment.workshopId,
      quantity: shipment.quantity,
    }))
    const creationShipments = plan.shipments.map(shipment => ({
      workshopId: shipment.workshopId,
      quantity: shipment.quantity,
      estimatedDeliveryAt: shipment.deliveryAt,
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
            shipments: creationShipments,
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
            const order = result.orders?.[0] ??
              (result.id ? { id: result.id, uid: result.uid ?? '' } : undefined)
            if (!order) {
              handleSubmissionError(
                'O pedido foi processado sem uma identificação válida. Consulte seus pedidos antes de tentar novamente.',
              )
              return
            }
            sessionStorage.setItem(CREATED_ORDER_SESSION_KEY, String(order.id))
            reset()
            router.push(`/profile/order/${order.id}`)
          },
          setLoading,
          handleSubmissionError,
        )
      },
      setLoading,
      handleSubmissionError,
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
            Confira seus dados, a produção, a entrega e o pagamento antes de
            reservar a capacidade das oficinas.
          </p>
        </div>
        <div className="confirmation-deadline">
          <i className="pi pi-calendar" aria-hidden="true" />
          <span>Entrega estimada até</span>
          <strong>{new Date(plan.maxDeliveryAt).toLocaleDateString('pt-BR')}</strong>
        </div>
      </div>

      {isLoadingReview ? (
        <div className="confirmation-loading" role="status">
          <ZSkeleton height="10rem" />
          <ZSkeleton height="18rem" />
        </div>
      ) : (
        <div className="confirmation-review-layout">
          <div className="confirmation-review-column">
            {submitAttempted && (validationErrors.length > 0 || createError) && (
              <div
                className="confirmation-validation-summary"
                role="alert"
                tabIndex={-1}
                ref={validationSummaryRef}
              >
                <strong>Antes de confirmar:</strong>
                <ul>
                  {createError && <li>{createError}</li>}
                  {validationErrors.map(error => <li key={error}>{error}</li>)}
                </ul>
              </div>
            )}

            <section className="confirmation-review-section" aria-labelledby="customer-review-title">
              <div className="confirmation-section-heading">
                <div>
                  <span>Cliente</span>
                  <h3 id="customer-review-title">Seus dados</h3>
                </div>
                <Link href="/profile">Editar dados</Link>
              </div>
              {user ? (
                <div className="confirmation-customer-card">
                  <i className="pi pi-user" aria-hidden="true" />
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    {user.customer?.phone && <span>{user.customer.phone}</span>}
                  </div>
                </div>
              ) : (
                <p className="confirmation-inline-error">Não foi possível carregar seus dados.</p>
              )}
            </section>

            <section className="confirmation-review-section" aria-labelledby="product-review-title">
              <div className="confirmation-section-heading">
                <div>
                  <span>Produto</span>
                  <h3 id="product-review-title">Produto selecionado</h3>
                </div>
                <ZButton label="Editar quantidade" text onClick={() => handleActiveIndex(0)} />
              </div>
              <div className="confirmation-product-row">
                <div className="confirmation-product-image">
                  {product?.product_image?.[0]?.img_url ? (
                    <Image
                      src={product.product_image[0].img_url}
                      alt=""
                      width={72}
                      height={72}
                      unoptimized
                    />
                  ) : (
                    <i className="pi pi-image" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <strong>{product?.name ?? 'Produto'}</strong>
                  <span>
                    {formatCurrency(product?.price ?? 0)} × {desiredQuantity}{' '}
                    {desiredQuantity === 1 ? 'unidade' : 'unidades'}
                  </span>
                </div>
                <strong>{formatCurrency(productSubtotal)}</strong>
              </div>
            </section>

            <section className="confirmation-review-section" aria-labelledby="production-review-title">
              <div className="confirmation-section-heading">
                <div>
                  <span>Produção</span>
                  <h3 id="production-review-title">
                    Plano {SIMULATION_MODE_LABEL[productionOrder.simulationMode].toLocaleLowerCase('pt-BR')}
                  </h3>
                </div>
                <ZButton label="Editar plano" text onClick={() => handleActiveIndex(1)} />
              </div>
              <div className="confirmation-shipments">
                {plan.shipments.map((shipment, index) => (
                  <article key={shipment.workshopId}>
                    <span className="confirmation-shipment-number">{index + 1}</span>
                    <div>
                      <strong>{shipment.workshopName}</strong>
                      <span>
                        {shipment.quantity}{' '}
                        {shipment.quantity === 1 ? 'unidade' : 'unidades'} ·
                        prontas em{' '}
                        {new Date(shipment.readyAt).toLocaleDateString('pt-BR')}
                      </span>
                      <small>
                        Entrega estimada em{' '}
                        {new Date(shipment.deliveryAt).toLocaleDateString('pt-BR')}
                      </small>
                    </div>
                    <strong>{formatCurrency(shipment.freightCost)}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="confirmation-review-section" aria-labelledby="address-review-title">
              <div className="confirmation-section-heading">
                <div>
                  <span>Entrega</span>
                  <h3 id="address-review-title">Endereço de entrega</h3>
                </div>
                <Link href="/profile/address">Gerenciar endereços</Link>
              </div>
              <div className="confirmation-addresses" role="radiogroup" aria-label="Endereços de entrega">
                {addressList?.customer?.address_customer?.map(item => (
                  <label
                    key={item.id}
                    htmlFor={`confirmation-address-${item.id}`}
                    className={`confirmation-address-card${item.id === addressSelectedId ? ' is-selected' : ''}`}
                  >
                    <ZRadioButton
                      inputId={`confirmation-address-${item.id}`}
                      name="delivery-address"
                      value={item.id}
                      checked={item.id === addressSelectedId}
                      onChange={() => setAddressSelectedId(item.id)}
                    />
                    <span>
                      <strong>{item.name}</strong>
                      <span>{item.address}, {item.number}</span>
                      <small>
                        {item.neighborhood} · CEP {item.cep}
                        {item.is_default ? ' · Endereço padrão' : ''}
                      </small>
                    </span>
                  </label>
                ))}
                {!addressList?.customer?.address_customer?.length && (
                  <div className="confirmation-address-empty">
                    <i className="pi pi-map-marker" aria-hidden="true" />
                    <strong>Nenhum endereço cadastrado</strong>
                    <p>Cadastre um endereço para receber sua encomenda.</p>
                    <Link href="/profile/address">Cadastrar endereço</Link>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="confirmation-summary" aria-label="Resumo e confirmação da encomenda">
            <div className="confirmation-summary-card">
              <div className="confirmation-summary-title">
                <div>
                  <span>Resumo</span>
                  <h3>Sua encomenda</h3>
                </div>
                <ZSaleTypeBadge saleType="ENCOMENDA" />
              </div>

              <dl className="confirmation-totals">
                <div><dt>Produtos</dt><dd>{formatCurrency(productSubtotal)}</dd></div>
                <div><dt>Frete estimado</dt><dd>{formatCurrency(plan.totalCost)}</dd></div>
              </dl>

              <div className="confirmation-grand-total" aria-live="polite">
                <span>Total estimado</span>
                <strong>{formatCurrency(estimatedTotal)}</strong>
              </div>

              <div className="confirmation-summary-deadline">
                <i className="pi pi-calendar" aria-hidden="true" />
                <span>
                  Entrega estimada até{' '}
                  <strong>{new Date(plan.maxDeliveryAt).toLocaleDateString('pt-BR')}</strong>
                </span>
              </div>

              <fieldset className="confirmation-payment-options">
                <legend>Método de pagamento</legend>
                {PAYMENT_OPTIONS.map(option => (
                  <label
                    key={option.value}
                    htmlFor={`production-payment-${option.value}`}
                    className={`confirmation-payment-option${paymentMethod === option.value ? ' is-selected' : ''}`}
                  >
                    <ZRadioButton
                      inputId={`production-payment-${option.value}`}
                      name="production-payment-method"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={() => setPaymentMethod(option.value)}
                    />
                    <i className={option.icon} aria-hidden="true" />
                    <span>
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </span>
                  </label>
                ))}
              </fieldset>

              <p className="confirmation-note">
                Ao confirmar, reservaremos por alguns minutos a capacidade das
                oficinas antes de criar o pedido.
              </p>
              <ZButton
                label="Confirmar encomenda"
                icon="pi pi-check"
                loading={loading}
                disabled={isLoadingReview || loading}
                onClick={handleConfirm}
                className="confirmation-submit"
              />
              <small className="confirmation-security-note">
                <i className="pi pi-lock" aria-hidden="true" /> Processo seguro
                e sujeito à disponibilidade no momento da reserva.
              </small>
            </div>
          </aside>
        </div>
      )}

      <div className="production-order-actions confirmation-back-action">
        <ZButton
          label="Voltar à simulação"
          icon="pi pi-arrow-left"
          severity="secondary"
          text
          onClick={() => handleActiveIndex(1)}
          disabled={loading}
        />
      </div>
    </div>
  )
}
