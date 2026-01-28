'use client'
import { ZButton } from "@/components/button/button";
import ZConfirmDialog from "@/components/confirm_dialog/confirm_dialog";
import { Order } from "@/components/order/order";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { OrderController } from "../../../service/controller";
import "./card.css";

interface OrderProps {
    order: any;
}

const OrderCard: React.FC<OrderProps> = ({ order }) => {

    const [canceled, setCanceled] = useState(false);

    const history = useRouter()

     const controllerOrder = OrderController()

    const handleSave = () => {
        controllerOrder.OrderUpdateAction(order.id, { status: 'SOLITED_CANCELLATION', payment_status: order.payment_status })
        // aqui você pode chamar sua API (fetch/axios)
    }
 
    if (!order) return <>Carregando...</>

    return (
        <>

            <div className="flex flex-row justify-content-end mb-5 gap-2">
                {(order.payment_status === 'PENDING' || order.payment_status === 'FAILED') && !(order.status === 'SOLITED_CANCELLATION' || order.status === "CANCELLED") &&
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
               <ZConfirmDialog message="Deseja mesmo solicitar o cancelamento?" header="Confirmação" accept={() => handleSave()} acceptLabel="Sim" rejectLabel="Não" visible={canceled} onHide={() => setCanceled(false)} />
        </>
    );
};

export default OrderCard;
