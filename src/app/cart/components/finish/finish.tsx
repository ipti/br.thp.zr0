'use client'

import { Address } from '@/app/profile/address/service/type'
import { ZButton } from '@/components/button/button'
import ZDivider from '@/components/divider/divider'
import ZInputText from '@/components/input/input'
import ZSkeleton from '@/components/skeleton/skeleton'
import { useFetchUserToken } from '@/service/global_request/query'
import { UserGlobal } from '@/service/global_request/type'
import { useCartStore } from '@/service/store/cart_store'
import { isAxiosError } from 'axios'
import { useRef, useState } from 'react'
import { CheckoutPaymentMethod, validateCheckoutReview } from '../../review_validation'
import { CartController } from '../../service/controller'
import { useFetchAddressOneRequest } from '../../service/query'
import { ValidateCouponRequest } from '../../service/request'
import { formatCurrency, getCartSubtotal, getSelectedCartItems } from '../../utils'
import { useCartStepsStore } from '../../zustand/zustand'
import CardAddress from '../card_address/card_address'
import CardPerson from '../card_person/card_person'

const paymentOptions: Array<{
  value: CheckoutPaymentMethod
  label: string
  description: string
}> = [
  { value: 'PIX', label: 'PIX', description: 'Pagamento rápido pelo aplicativo do seu banco.' },
  { value: 'CREDIT_CARD', label: 'Cartão de crédito', description: 'Informe os dados do cartão na próxima etapa.' },
  { value: 'BANK_SLIP', label: 'Boleto', description: 'A compensação pode levar até três dias úteis.' }
]

type Feedback = { type: 'success' | 'error'; message: string }

export default function Finish({
  handleActiveIndex,
  handleSetOrders
}: {
  handleActiveIndex: (i: number) => void
  handleSetOrders: (orders: { id: number; uid: string }[]) => void
}) {
  const [isLoadingFinish, setIsLoadingFinish] = useState(false)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState<string | null>(null)
  const [couponFeedback, setCouponFeedback] = useState<Feedback | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('PIX')
  const submissionLockRef = useRef(false)
  const validationSummaryRef = useRef<HTMLDivElement>(null)

  const controllerCart = CartController()
  const cart = useCartStore(state => state.cart)
  const cartSteps = useCartStepsStore(state => state)
  const { data: addressRequest, isLoading: isLoadingAddress } = useFetchAddressOneRequest(
    cartSteps.cartSteps.address_selected ?? 0
  )
  const { data: userRequest, isLoading: isLoadingUser } = useFetchUserToken()

  const user: UserGlobal | undefined = userRequest
  const address: Address | undefined = addressRequest
  const selectedItems = getSelectedCartItems(cart, cartSteps.cartSteps.product_selected)
  const subtotal = getCartSubtotal(cart, cartSteps.cartSteps.product_selected)
  const deliveries = cartSteps.cartSteps.deliverySelected ?? []
  const shippingTotal = deliveries.reduce(
    (sum, item) => sum + (Number.isFinite(item.validOptions?.cost) ? item.validOptions.cost : 0),
    0
  )
  const orderTotal = subtotal + shippingTotal
  const isLoadingReview = isLoadingAddress || isLoadingUser
  const validationErrors = isLoadingReview
    ? []
    : validateCheckoutReview({
        user,
        address,
        selectedAddressId: cartSteps.cartSteps.address_selected,
        items: selectedItems,
        deliveries,
        paymentMethod,
        couponDiscount,
        orderTotal
      })

  const focusValidationSummary = () => {
    requestAnimationFrame(() => validationSummaryRef.current?.focus())
  }

  const handleCreateOrder = () => {
    if (submissionLockRef.current || isLoadingFinish || isLoadingReview) return
    setCreateError(null)

    if (validationErrors.length > 0 || !address || !user) {
      focusValidationSummary()
      return
    }

    submissionLockRef.current = true
    setIsLoadingFinish(true)
    controllerCart.CreateOrder(
      {
        address: {
          address: address.address,
          cep: address.cep,
          number: address.number,
          complement: address.complement ?? '',
          neighborhood: address.neighborhood,
          cityId: address.city.id,
          stateId: address.state.id,
          name: address.name,
          phone: address.phone
        },
        payment_method: paymentMethod,
        coupon_code: couponApplied ?? undefined,
        userId: user.id,
        items: deliveries.flatMap(item => {
          const product = cart.find(cartItem => cartItem.id === item.productId)
          return product ? [{
            productId: item.productId,
            variantId: product.variantId,
            quantity: item.quantity,
            delivery_estimate: item.validOptions,
            workshopId: item.workshopId
          }] : []
        }),
        observation: ''
      },
      () => {
        submissionLockRef.current = false
        setIsLoadingFinish(false)
      },
      orders => {
        handleSetOrders(orders)
      },
      message => {
        setCreateError(message)
        requestAnimationFrame(() => validationSummaryRef.current?.focus())
      }
    )
  }

  const handleCouponChange = (value: string) => {
    setCouponCode(value)
    setCouponFeedback(null)
    if (couponApplied && value.trim().toUpperCase() !== couponApplied.toUpperCase()) {
      setCouponApplied(null)
      setCouponDiscount(0)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setCouponApplied(null)
    setCouponDiscount(0)
    setCouponFeedback({ type: 'success', message: 'Cupom removido.' })
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || isApplyingCoupon) return
    setCouponFeedback(null)

    if (!Number.isFinite(orderTotal) || orderTotal <= 0) {
      setCouponFeedback({ type: 'error', message: 'O pedido precisa ter um total válido para aplicar um cupom.' })
      return
    }

    setIsApplyingCoupon(true)
    try {
      const result = await ValidateCouponRequest(couponCode.trim(), orderTotal)
      if (!Number.isFinite(result.discount) || result.discount < 0 || result.discount > orderTotal) {
        throw new Error('Invalid coupon discount')
      }
      setCouponCode(result.code)
      setCouponDiscount(result.discount)
      setCouponApplied(result.code)
      setCouponFeedback({ type: 'success', message: `Cupom ${result.code} aplicado.` })
    } catch (error: unknown) {
      setCouponDiscount(0)
      setCouponApplied(null)
      setCouponFeedback({
        type: 'error',
        message: isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message ?? 'Não foi possível aplicar o cupom.'
          : 'Não foi possível aplicar o cupom.'
      })
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  return (
    <div className="checkout-stage">
      <div className="checkout-stage-heading">
        <div>
          <h2 data-checkout-heading tabIndex={-1}>Revise e confirme</h2>
          <p>Confira os dados antes de criar o pedido.</p>
        </div>
      </div>

      <div className="checkout-review-layout">
        <div className="checkout-review-column">
          {isLoadingReview ? <ZSkeleton height="180px" /> : null}

          {!isLoadingReview && (validationErrors.length > 0 || createError) ? (
            <div
              className="checkout-validation-summary"
              role="alert"
              tabIndex={-1}
              ref={validationSummaryRef}
            >
              <strong>Antes de finalizar:</strong>
              <ul>
                {createError ? <li>{createError}</li> : null}
                {validationErrors.map(error => <li key={error}>{error}</li>)}
              </ul>
            </div>
          ) : null}

          {user?.customer ? <CardPerson item={user} cep={address?.cep} isEdit /> : null}

          <div className="checkout-review-section-heading">
            <h3>Endereço selecionado</h3>
            <button type="button" onClick={() => handleActiveIndex(1)}>Editar endereço</button>
          </div>
          {address ? <CardAddress item={address} isView /> : null}

          <div className="checkout-review-section-heading">
            <h3>Produtos selecionados</h3>
            <button type="button" onClick={() => handleActiveIndex(0)}>Editar produtos</button>
          </div>
          <div className="checkout-review-products">
            {selectedItems.map(item => (
              <article key={item.id} className="checkout-review-product">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="" width={80} height={80} />
                <div>
                  <h4>{item.name}</h4>
                  <p>{formatCurrency(item.price)} × {item.quantity}</p>
                </div>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </article>
            ))}
          </div>

          <div className="checkout-review-section-heading">
            <h3>Entregas</h3>
            <button type="button" onClick={() => handleActiveIndex(2)}>Editar entregas</button>
          </div>
          <div className="checkout-review-deliveries">
            {deliveries.map(item => (
              <article key={`${item.productId}-${item.workshopId}`}>
                <strong>{item.productName}</strong>
                <span>{item.workshopName}</span>
                <p>{item.validOptions.carrier} · {item.validOptions.service}</p>
                <p>Estimativa: {item.validOptions.deliveryTime} dias úteis</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="checkout-review-summary" aria-label="Resumo e finalização do pedido">
          <div className="card_total">
            <h3>Resumo do pedido</h3>
            <dl className="cart-totals checkout-review-totals">
              <div><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
              <div><dt>Frete</dt><dd>{formatCurrency(shippingTotal)}</dd></div>
              {couponDiscount > 0 ? (
                <div><dt>Desconto</dt><dd>−{formatCurrency(couponDiscount)}</dd></div>
              ) : null}
            </dl>

            <div className="checkout-coupon-field">
              <label htmlFor="checkout-coupon">Cupom de desconto</label>
              <div className="checkout-coupon-controls">
                <ZInputText
                  id="checkout-coupon"
                  value={couponCode}
                  onChange={event => handleCouponChange(event.target.value)}
                  placeholder="Digite seu cupom"
                  aria-describedby="checkout-coupon-feedback"
                  invalid={couponFeedback?.type === 'error'}
                />
                <ZButton
                  type="button"
                  label="Aplicar"
                  loading={isApplyingCoupon}
                  disabled={!couponCode.trim() || isApplyingCoupon || couponApplied === couponCode.trim()}
                  onClick={() => void handleApplyCoupon()}
                />
              </div>
              {couponFeedback ? (
                <p
                  id="checkout-coupon-feedback"
                  className={`checkout-field-feedback is-${couponFeedback.type}`}
                  role={couponFeedback.type === 'error' ? 'alert' : 'status'}
                >
                  {couponFeedback.message}
                </p>
              ) : null}
              {couponApplied ? (
                <button type="button" className="checkout-text-action" onClick={handleRemoveCoupon}>
                  Remover cupom
                </button>
              ) : null}
            </div>

            <fieldset className="checkout-payment-options">
              <legend>Método de pagamento</legend>
              {paymentOptions.map(option => (
                <label
                  key={option.value}
                  className={`checkout-payment-option${paymentMethod === option.value ? ' is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={() => setPaymentMethod(option.value)}
                  />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                </label>
              ))}
            </fieldset>

            <ZDivider />
            <div className="cart-summary-total" aria-live="polite">
              <span>Total</span>
              <strong>{formatCurrency(orderTotal - couponDiscount)}</strong>
            </div>

            <p className="checkout-confirmation-note">
              Ao finalizar, você confirma que revisou os produtos, o endereço, a entrega e a forma de pagamento.
            </p>
            <ZButton
              label="Finalizar pedido"
              style={{ width: '100%' }}
              loading={isLoadingFinish}
              disabled={isLoadingReview || isLoadingFinish}
              onClick={handleCreateOrder}
            />
          </div>
        </aside>
      </div>

      <div className="checkout-actions checkout-review-back">
        <ZButton security="secondary" onClick={() => handleActiveIndex(2)}>Voltar</ZButton>
      </div>
    </div>
  )
}
