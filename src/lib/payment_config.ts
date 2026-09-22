// Lido apenas em Server Components — nunca importar de um arquivo 'use client'.
// PAYMENT_ENABLED e WHATSAPP_NUMBER não usam o prefixo NEXT_PUBLIC_ de propósito:
// a configuração não deve ficar exposta no bundle do cliente. Cada página que
// precisa desse valor lê aqui e repassa via props para o Client Component.

export type PaymentConfig = {
  paymentEnabled: boolean
  whatsappNumber: string
}

export function getPaymentConfig(): PaymentConfig {
  const paymentEnabled = process.env.PAYMENT_ENABLED !== 'false'
  const whatsappNumber = process.env.WHATSAPP_NUMBER ?? ''

  if (!paymentEnabled && !whatsappNumber) {
    console.warn(
      '[payment_config] PAYMENT_ENABLED=false mas WHATSAPP_NUMBER não está configurado.'
    )
  }

  return { paymentEnabled, whatsappNumber }
}
