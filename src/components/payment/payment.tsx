import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './checkout_form/checkout_form';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');


const CheckoutComponent = ({clientSecret}: {clientSecret: string}) => {

    console.log('stripe:',process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '')
   
    const appearance: { theme: 'stripe' } = { theme: 'stripe' };
    const options = { clientSecret, appearance };
    return (
        <div>
            {clientSecret && <Elements stripe={stripePromise} options={options}>
                {<CheckoutForm clientSecret={clientSecret} />}
            </Elements>}
        </div>
    );
};

export default CheckoutComponent;