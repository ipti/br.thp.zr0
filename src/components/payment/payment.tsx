'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useEffect, useMemo, useState } from 'react'
import CheckoutForm from './checkout_form/checkout_form'
import { isStripePublishableKey } from './stripe_config'

const buildTimeStripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
const validBuildTimeKey = isStripePublishableKey(buildTimeStripePublicKey)
  ? buildTimeStripePublicKey
  : null

export default function CheckoutComponent({
  clientSecret,
  orderId,
  onConfirmed
}: {
  clientSecret?: string
  orderId: number
  onConfirmed?: () => Promise<unknown>
}) {
  const [stripePublicKey, setStripePublicKey] = useState<string | null>(validBuildTimeKey)
  const [isLoadingConfig, setIsLoadingConfig] = useState(!validBuildTimeKey)

  useEffect(() => {
    if (validBuildTimeKey) return

    const controller = new AbortController()

    const loadRuntimeConfig = async () => {
      try {
        const response = await fetch('/api/runtime-config/stripe', {
          cache: 'no-store',
          signal: controller.signal
        })
        const config = await response.json() as { publicKey?: string | null }

        if (response.ok && isStripePublishableKey(config.publicKey)) {
          setStripePublicKey(config.publicKey)
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setStripePublicKey(null)
        }
      } finally {
        if (!controller.signal.aborted) setIsLoadingConfig(false)
      }
    }

    void loadRuntimeConfig()
    return () => controller.abort()
  }, [])

  const stripePromise = useMemo(
    () => stripePublicKey ? loadStripe(stripePublicKey) : null,
    [stripePublicKey]
  )

  if (isLoadingConfig) {
    return (
      <div className="checkout-inline-status" role="status" aria-live="polite">
        Carregando pagamento seguro…
      </div>
    )
  }

  if (!stripePublicKey || !stripePromise) {
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
