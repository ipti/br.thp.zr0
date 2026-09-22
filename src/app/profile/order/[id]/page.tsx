import { OrderOneComponents } from "./components/components";
import { getPaymentConfig } from '@/lib/payment_config'

export default function OrderOnePage() {
    const { paymentEnabled, whatsappNumber } = getPaymentConfig()
    return(
        <div>
            <OrderOneComponents paymentEnabled={paymentEnabled} whatsappNumber={whatsappNumber} />
        </div>
    )
}