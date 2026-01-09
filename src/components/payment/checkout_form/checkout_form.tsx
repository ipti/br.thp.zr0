// CheckoutForm.tsx
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import './checkout_form.css';
import { ZButton } from '@/components/button/button';

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!stripe || !elements) {
      setMessage('Stripe ainda não carregado.');
      return;
    }

    setIsProcessing(true);

    // confirmPayment usará o PaymentElement (já ligado ao clientSecret via Elements)
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Se você quiser redirecionar após 3DS ou método que requer redirecionamento:
        return_url: `${window.location.origin}/profile/order`,
        payment_method_data: {
          billing_details: {}
        },
        receipt_email: 'jonnyzico10@gmail.com'
      },
      // redirect: 'if_required' // opcional: evita redirecionamento se não for necessário
    });

    setIsProcessing(false);

    // resultado: se houver erro, result.error estará preenchido
    if (result.error) {
      setMessage(result.error.message ?? 'Erro ao processar o pagamento.');
      return;
    }

    // Se não houver erro e não houve redirecionamento, podemos checar o PaymentIntent
    // Usamos stripe.retrievePaymentIntent(clientSecret) para obter o status atual
    try {
      // @ts-ignore - stripe.retrievePaymentIntent existe em stripe-js (v3). Se sua versão não tiver, pule essa chamada.
      const pi = await (stripe as any).retrievePaymentIntent(clientSecret);
      const status = pi?.paymentIntent?.status ?? pi?.status ?? null;

      if (status === 'succeeded') {
        setMessage('Pagamento realizado com sucesso!');
        // atualizar pedido no seu backend, mostrar recibo, etc.
      } else if (status === 'processing') {
        setMessage('Pagamento processando. Aguardando confirmação.');
      } else {
        setMessage(`Status do pagamento: ${status}`);
      }
    } catch (err) {
      // Se retrievePaymentIntent não estiver disponível na sua versão do stripe-js,
      // você pode confiar no webhook do backend para confirmar o pagamento,
      // ou redirecionar via return_url e checar o backend.
      console.warn('Não foi possível recuperar PaymentIntent no cliente:', err);
      setMessage('Pagamento enviado — aguarde confirmação (verifique seu e-mail).');
    }
  };

  return (
    <div className="form-container">
      <h2>Pagamento Seguro</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ margin: '20px 0' }}>
          <PaymentElement />
        </div>
        <div className='flex flex-row justify-content-center'>
          <ZButton type="submit" disabled={!stripe || isProcessing}>
            {isProcessing ? 'Processando...' : 'Pagar Agora'}
          </ZButton>
        </div>
      </form>

      {message && <div className={`form-message ${message.includes('sucesso') ? 'success' : 'error'}`}>{message}</div>}
    </div>
  );
};

export default CheckoutForm;
