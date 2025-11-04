import React, { useState, useEffect } from 'react';
import CheckoutForm from './checkout_form/checkout_form';
import { apiUrl } from '@/service/url_api';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');


const CheckoutComponent = ({price, idOrder}: {price: number, idOrder: number}) => {
    const [clientSecret, setClientSecret] = useState('');

   const [hasFetched, setHasFetched] = useState(false); // Estado para controlar se a requisição foi feita

    useEffect(() => {
        if (!hasFetched) { // Só executa se ainda não tiver feito a requisição
            setHasFetched(true); // Marca como já processado
            fetch(apiUrl + '/payment/create-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: Math.round(price * 100), currency: 'BRL', idOrder: idOrder }),
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log('Dados recebidos (data):', data);
                    setClientSecret(data.client_secret);
                })
                .catch((err) =>
                    console.error('Erro ao iniciar pagamento:', err)
                );
        }
    }, [hasFetched, price, idOrder]); //

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