'use client'
import { ZButton } from "@/components/button/button";
import ZConfirmDialog from "@/components/confirm_dialog/confirm_dialog";
import { orderStatus } from "@/utils/enum/order_status";
import { paymentStatus } from "@/utils/enum/payment_status";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { OrderController } from "../../../service/controller";
import "./card.css";
import { Order } from "@/components/order/order";

interface OrderProps {
    order: any;
}

const OrderCard: React.FC<OrderProps> = ({ order }) => {

    const [canceled, setCanceled] = useState(false);

    const history = useRouter()
    const totalProducts = order.order_items.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
    );


    const delivery = order.order_items[0]?.delivery_estimate;

    // estados locais para edição
    const [payStatus, setPayStatus] = useState(order.payment_status);

    const controllerOrder = OrderController()

    if (!order) return <>Carregando...</>

    const handleSave = () => {
        controllerOrder.OrderUpdateAction(order.id, { status: 'SOLITED_CANCELLATION', payment_status: payStatus })
        // aqui você pode chamar sua API (fetch/axios)
    };


    return (
        <>

            <div className="flex flex-row justify-content-end mb-5 gap-2">
                {(payStatus === 'PENDING' || payStatus === 'FAILED') && !(order.status === 'SOLITED_CANCELLATION') &&
                    <>
                        <ZButton onClick={() => history.push('/payment?id=' + order.id)} icon="pi pi-credit-card" label="  " severity="success">
                            Realizar pagamento
                        </ZButton>
                    </>
                }
                {
                    (order.status === 'CONFIRMED' || order.status === 'PENDING') && <ZButton outlined onClick={() => { setCanceled(!canceled) }} label="Solicitar cancelamento" severity="danger" icon='pi pi-undo' />
                }
            </div>

            <Order order={order} />
        </>
    );
};

export default OrderCard;
