import { ZButton } from "@/components/button/button";
import ZConfirmDialog from "@/components/confirm_dialog/confirm_dialog";
import { Order } from "@/components/order/order";
import React, { useState } from "react";
import { OrderController } from "../../service/controller";
import { OrderItem, OrderOneType } from "../../service/types";
import "./card.css";
import { ModalUpdateOrder } from "./modal_update_order/modal_update_order";

interface OrderProps {
    order: OrderOneType;
}

const OrderCard: React.FC<OrderProps> = ({ order }) => {
    const [visible, setVisible] = useState<any>(false)
    const [refundVisible, setRefundVisble] = useState(false)

    const controllerOrder = OrderController()


    const handleRefund = () => {
        controllerOrder.RefundOrderUpdateAction({
            amount: order.total_amount, idOrder: order.id
        })
        setRefundVisble(!refundVisible)
        // aqui você pode chamar sua API (fetch/axios)
    };

    if (!order) return <>Carregando...</>

    return (
        <>
            <div className="flex flex-row justify-content-end mb-5 gap-2">
                <ZButton label="Alterar Status" onClick={() => setVisible(order)} />
               {order.payment_status === 'PAID' && <ZButton label="Fazer reembolso" severity="danger" outlined icon='pi pi-undo' onClick={() => setRefundVisble(!refundVisible)} />}
            </div>
             {(order.payment_status !== 'PAID' &&  order.payment_status !== 'REFUNDED')  && <p className="mb-3">Cancelamento solicitado porém não foi pago, altere o status para Cancelado</p>}
            <Order order={order} />
            <ModalUpdateOrder visible={visible} onHide={() => setVisible(false)} />
            <ZConfirmDialog visible={refundVisible} header={'Reembolse o pagamento'} message='Faça a solitição de reembolso' acceptLabel="Reembolsar" acceptClassName="severity" rejectLabel="Não" reject={() => setRefundVisble(false)} accept={() => handleRefund()} />
        </>
    );
};

export default OrderCard;
