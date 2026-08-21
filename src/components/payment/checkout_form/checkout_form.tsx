import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { FormEvent, useState } from 'react'
import { ZButton } from '@/components/button/button'
import './checkout_form.css'

type PaymentMessage = {
  kind: 'success' | 'info' | 'error'
  text: string
}

export default function CheckoutForm({
  clientSecret,
  orderId,
  onConfirmed
}: {
  clientSecret: string
  orderId: number
  onConfirmed?: () => Promise<unknown>
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<PaymentMessage | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setMessage(null)

    if (!stripe || !elements) {
      setMessage({ kind: 'error', text: 'O formulário de pagamento ainda está carregando.' })
      return
    }

    setIsProcessing(true)
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/profile/order/${orderId}?payment=return`
        },
        redirect: 'if_required'
      })

      if (result.error) {
        setMessage({
          kind: 'error',
          text: result.error.message ?? 'Não foi possível processar o pagamento.'
        })
        return
      }

      await onConfirmed?.()
      const retrieved = await stripe.retrievePaymentIntent(clientSecret)
      const status = retrieved.paymentIntent?.status

      if (status === 'succeeded') {
        setMessage({ kind: 'success', text: 'Pagamento confirmado com sucesso.' })
      } else if (status === 'processing') {
        setMessage({ kind: 'info', text: 'Pagamento em processamento. A confirmação pode levar alguns minutos.' })
      } else if (status === 'requires_action') {
        setMessage({ kind: 'info', text: 'Use as instruções exibidas para concluir o pagamento.' })
      } else {
        setMessage({ kind: 'info', text: 'Pagamento enviado. Aguardando confirmação.' })
      }
    } catch {
      setMessage({
        kind: 'error',
        text: 'Não foi possível concluir o pagamento. Verifique sua conexão e tente novamente.'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="form-container">
      <h2>Pagamento seguro</h2>
      <p className="payment-form-description">Seus dados são processados de forma segura pela Stripe.</p>
      <form onSubmit={handleSubmit}>
        <div className="payment-element-wrapper">
          <PaymentElement />
        </div>
        <ZButton
          type="submit"
          label={isProcessing ? 'Processando…' : 'Pagar agora'}
          loading={isProcessing}
          disabled={!stripe || !elements || isProcessing}
          className="payment-submit"
        />
      </form>

      {message && (
        <div
          className={`form-message ${message.kind}`}
          role={message.kind === 'error' ? 'alert' : 'status'}
          aria-live={message.kind === 'error' ? 'assertive' : 'polite'}
        >
          {message.text}
        </div>
      )}
    </div>
  )
}
