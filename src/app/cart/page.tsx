import CartComponent from "./components/components";
import { getPaymentConfig } from '@/lib/payment_config'

export default function CartPage() {
    const { paymentEnabled, whatsappNumber } = getPaymentConfig()
    return (
        <div className="px-3 py-2 md:px-6 md:py-4">
            <CartComponent paymentEnabled={paymentEnabled} whatsappNumber={whatsappNumber} />
        </div>
    )
}
