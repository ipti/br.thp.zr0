export const STRIPE_PUBLIC_KEY_ENV = 'NEXT_PUBLIC_STRIPE_PUBLIC_KEY'

export const isStripePublishableKey = (value?: string | null): value is string =>
  Boolean(value && /^pk_(test|live)_/.test(value))
