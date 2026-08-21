import { ShippingGetType } from '@/app/product/service/type'
import { ShippingCalculateRequest } from '@/app/product/service/request'
import { Address } from '@/app/profile/address/service/type'
import { ZButton } from '@/components/button/button'
import ZSkeleton from '@/components/skeleton/skeleton'
import { useFetchUserToken } from '@/service/global_request/query'
import { UserGlobal } from '@/service/global_request/type'
import { useCartStore } from '@/service/store/cart_store'
import { isAxiosError } from 'axios'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CartController } from '../../service/controller'
import { useFetchAddressOneRequest } from '../../service/query'
import { formatCurrency, getCartSubtotal, getSelectedCartItems } from '../../utils'
import { DeliverySelectedType, useCartStepsStore } from '../../zustand/zustand'
import { CardDelivery } from './card_delivery'

export default function Delivery({
  handleActiveIndex,
}: {
  handleActiveIndex: (i: number) => void
}) {
  const [shipping, setShipping] = useState<ShippingGetType[]>()
  const [shippingSelect, setShippingSelect] = useState<DeliverySelectedType[]>([])
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [isReserving, setIsReserving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const reserveLockRef = useRef(false)

  const cartController = CartController()
  const cartSteps = useCartStepsStore(state => state)
  const productSelected = cartSteps.productSelected
  const cart = useCartStore(state => state.cart)
  const { data: userRequest } = useFetchUserToken()
  const {
    data: addressRequest,
    isLoading: isLoadingAddress,
    isError: isAddressError,
    refetch: refetchAddress
  } = useFetchAddressOneRequest(cartSteps.cartSteps.address_selected ?? 0)

  const user: UserGlobal | undefined = userRequest
  const address: Address | undefined = addressRequest

  const calculateShipping = useCallback(async (currentAddress: Address) => {
    setLoadingShipping(true)
    setErrorMessage(null)
    setShipping(undefined)
    try {
      const response = await ShippingCalculateRequest({
        destinationZipCode: currentAddress.cep.replace(/\D/g, ''),
        orderItems: productSelected()
      })
      setShipping(response.data as ShippingGetType[])
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined
      setErrorMessage(message ?? 'Não foi possível calcular as opções de entrega.')
    } finally {
      setLoadingShipping(false)
    }
  }, [productSelected])

  useEffect(() => {
    if (address) void calculateShipping(address)
  }, [address, calculateShipping])

  useEffect(() => {
    setShippingSelect(cartSteps.cartSteps.deliverySelected ?? [])
  }, [cartSteps.cartSteps.deliverySelected])

  const handleSelectOptions = (data: DeliverySelectedType) => {
    const remaining = shippingSelect.filter(item => !(
      item.productId === data.productId && item.workshopId === data.workshopId
    ))
    return [...remaining, data]
  }

  const shipmentKeys = new Set(
    shipping?.map(item => `${item.productId}:${item.workshopId}`) ?? []
  )
  const validShippingSelection = shippingSelect.filter(selection =>
    shipping?.some(item =>
      item.productId === selection.productId &&
      item.workshopId === selection.workshopId &&
      item.result.validOptions.some(option =>
        option.serviceCode === selection.validOptions.serviceCode
      )
    )
  )
  const selectedShipmentKeys = new Set(
    validShippingSelection
      .map(item => `${item.productId}:${item.workshopId}`)
  )
  const missingShipments = Math.max(shipmentKeys.size - selectedShipmentKeys.size, 0)
  const hasUnavailableShipment = shipping?.some(
    item => !item.result?.validOptions?.length
  ) ?? false
  const subtotal = getCartSubtotal(cart, cartSteps.cartSteps.product_selected)
  const selectedItems = getSelectedCartItems(cart, cartSteps.cartSteps.product_selected)
  const shippingQuantities = new Map<string, number>()
  shipping?.forEach(item => {
    shippingQuantities.set(
      item.productId,
      (shippingQuantities.get(item.productId) ?? 0) + item.quantity
    )
  })
  const hasQuantityMismatch = selectedItems.some(
    item => shippingQuantities.get(item.id) !== item.quantity
  )
  const shippingTotal = validShippingSelection.reduce(
    (sum, item) => sum + (Number.isFinite(item.validOptions?.cost) ? item.validOptions.cost : 0),
    0
  )

  const handleReserveStock = async () => {
    setErrorMessage(null)
    if (reserveLockRef.current || isReserving) return
    if (!user?.id) {
      setErrorMessage('Sua sessão expirou. Entre novamente para continuar o checkout.')
      return
    }
    if (!shipping?.length || missingShipments > 0 || hasUnavailableShipment || hasQuantityMismatch) {
      setErrorMessage('Selecione uma opção válida para cada remessa.')
      return
    }

    reserveLockRef.current = true
    setIsReserving(true)
    try {
      await cartController.ReserveStock({
        userId: user.id,
        items: validShippingSelection.map(item => ({
          productId: item.productId,
          workshopId: item.workshopId,
          quantity: item.quantity,
        })),
      })

      cartSteps.updateCartSteps({
        ...cartSteps.cartSteps,
        deliverySelected: validShippingSelection,
      })
      handleActiveIndex(3)
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined
      setErrorMessage(message ?? 'Não foi possível reservar o estoque. Revise a entrega e tente novamente.')
    } finally {
      reserveLockRef.current = false
      setIsReserving(false)
    }
  }

  const continueLabel = hasQuantityMismatch
    ? 'Revise as quantidades'
    : missingShipments > 0
    ? `Selecione a entrega de ${missingShipments} ${missingShipments === 1 ? 'remessa' : 'remessas'}`
    : 'Continuar para revisão'

  return (
    <div className="checkout-stage">
      <div className="checkout-stage-heading">
        <div>
          <h2 data-checkout-heading tabIndex={-1}>Escolha a entrega</h2>
          <p>Selecione uma opção para cada remessa do pedido.</p>
        </div>
      </div>

      {isLoadingAddress ? <ZSkeleton height="64px" /> : null}
      {isAddressError ? (
        <div className="checkout-inline-error" role="alert">
          <span>Não foi possível carregar o endereço selecionado.</span>
          <ZButton type="button" label="Tentar novamente" outlined onClick={() => void refetchAddress()} />
        </div>
      ) : null}
      {address ? (
        <div className="delivery-address">
          <i className="pi pi-map-marker" aria-hidden="true" />
          <span>{address.address} · {address.city.name}/{address.state.acronym} · CEP {address.cep}</span>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="checkout-inline-error" role="alert" tabIndex={-1} ref={element => element?.focus()}>
          <span>{errorMessage}</span>
          {shippingSelect[0]?.productId ? (
            <Link href={`/production-order?productId=${encodeURIComponent(shippingSelect[0].productId)}`}>
              Encomendar separadamente
            </Link>
          ) : null}
        </div>
      ) : null}

      {!loadingShipping && shipping && hasQuantityMismatch ? (
        <div className="checkout-inline-error" role="alert">
          <span>O estoque mudou e não atende mais às quantidades selecionadas.</span>
          <div className="checkout-inline-actions">
            <ZButton type="button" label="Ajustar quantidade" outlined onClick={() => handleActiveIndex(0)} />
            {selectedItems[0]?.id ? (
              <Link href={`/production-order?productId=${encodeURIComponent(selectedItems[0].id)}`}>
                Encomendar separadamente
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="delivery-layout">
        <div className="delivery-options" aria-label="Opções de entrega">
          {loadingShipping ? (
            <div className="flex flex-column gap-2" role="status" aria-label="Calculando entrega">
              <ZSkeleton height="72px" />
              <ZSkeleton height="72px" />
              <ZSkeleton height="72px" />
            </div>
          ) : null}

          {!loadingShipping && errorMessage && address ? (
            <ZButton type="button" label="Calcular novamente" outlined onClick={() => void calculateShipping(address)} />
          ) : null}

          {!loadingShipping && shipping?.length === 0 ? (
            <div className="checkout-empty-state" role="status">
              <h3>Nenhuma opção de entrega disponível</h3>
              <p>Revise o endereço ou encomende os produtos separadamente.</p>
            </div>
          ) : null}

          {!loadingShipping && shipping?.map(shippingItem => (
            <CardDelivery
              key={`${shippingItem.productId}-${shippingItem.workshopId}`}
              handleSelectOptions={handleSelectOptions}
              setShippingSelect={setShippingSelect}
              shippingItem={shippingItem}
              shippingSelect={shippingSelect}
            />
          ))}
        </div>

        <aside className="delivery-summary" aria-label="Resumo da entrega">
          <div className="card_total">
            <h3>Resumo</h3>
            <dl className="cart-totals">
              <div><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
              <div><dt>Frete</dt><dd>{formatCurrency(shippingTotal)}</dd></div>
            </dl>
            <div className="cart-summary-total" aria-live="polite">
              <span>Total estimado</span>
              <strong>{formatCurrency(subtotal + shippingTotal)}</strong>
            </div>
            {missingShipments > 0 ? (
              <p className="cart-summary-hint" role="status">
                Faltam {missingShipments} {missingShipments === 1 ? 'remessa' : 'remessas'}.
              </p>
            ) : null}
          </div>
        </aside>
      </div>

      <div className="checkout-actions">
        <ZButton label="Voltar" security="secondary" onClick={() => handleActiveIndex(1)} />
        <ZButton
          label={continueLabel}
          disabled={
            loadingShipping ||
            isLoadingAddress ||
            isAddressError ||
            !shipping?.length ||
            missingShipments > 0 ||
            hasUnavailableShipment
            || hasQuantityMismatch
          }
          loading={isReserving}
          onClick={() => void handleReserveStock()}
        />
      </div>
    </div>
  )
}
