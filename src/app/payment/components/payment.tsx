'use client'
import ZCard from "@/components/card/card";
import CheckoutComponent from "@/components/payment/payment";
import { useParams, useSearchParams } from "next/navigation";
import { useFetchRequestOrderOne } from "../service/query";
import { OrderOneType } from "../service/types";

export default function PaymentComponent() {

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const { data: orderService } = useFetchRequestOrderOne(id?.toString());
    const order: OrderOneType | undefined = orderService;
    const delivery = order?.order_items;
    return (
        <>
            <ZCard className="p-4">
               {order && <CheckoutComponent price={(order?.total_amount! + (delivery?.reduce((acumulador, item) => acumulador + item.delivery_estimate.cost, 0) ?? 0))} idOrder={order?.id ?? 0} />}
            </ZCard>
        </>
    )
}