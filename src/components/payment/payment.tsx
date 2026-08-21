import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from './checkout_form/checkout_form'

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null

export default function CheckoutComponent({
  clientSecret,
  orderId,
  onConfirmed
}: {
  clientSecret?: string
  orderId: number
  onConfirmed?: () => Promise<unknown>
}) {
  if (!stripePublicKey) {
    return (
      <div className="checkout-inline-error" role="alert">
        O pagamento está temporariamente indisponível. Tente novamente mais tarde.
      </div>
    )
  }

  if (!clientSecret) return null

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: 'stripe' } }}
    >
      <CheckoutForm
        clientSecret={clientSecret}
        orderId={orderId}
        onConfirmed={onConfirmed}
      />
    </Elements>
  )
}
