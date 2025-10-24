import React, { useState, useEffect } from 'react';
import CheckoutForm from './checkout_form/checkout_form';
import { apiUrl } from '@/service/url_api';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');


const CheckoutComponent = () => {
    const [clientSecret, setClientSecret] = useState('');

    // Obter o clientSecret do backend
    useEffect(() => {
        fetch(apiUrl + '/payment/create-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: 5000, currency: 'usd' }),
        })
            .then((res) => {
                if (!res.ok) { // Valida o status da resposta
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json(); // Processo o corpo da resposta
            })
            .then((data) => {
                console.log('Dados recebidos (data):', data);
                setClientSecret(data.client_secret)
            })
            .catch((err) => console.error('Erro ao iniciar pagamento:', err));
    }, []);

    const appearance: { theme: 'stripe' } = { theme: 'stripe' };
    const options = { clientSecret, appearance };
    return (
        <div>
            <h1>Página de Checkout</h1>
            {/* Renderiza o formulário apenas após carregar o clientSecret */}
            {clientSecret && <Elements stripe={stripePromise} options={options}>

                {clientSecret && <CheckoutForm clientSecret={clientSecret} />}
            </Elements>}
        </div>
    );
};

export default CheckoutComponent;