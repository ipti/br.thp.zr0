import { redirect } from 'next/navigation'
import { getPaymentConfig } from '@/lib/payment_config'
import PaymentComponent from "./components/payment";

export default function PaymentPage() {
    const { paymentEnabled } = getPaymentConfig()
    if (!paymentEnabled) {
        redirect('/cart')
    }

    return(
        <>
            <PaymentComponent />
        </>
    )
}