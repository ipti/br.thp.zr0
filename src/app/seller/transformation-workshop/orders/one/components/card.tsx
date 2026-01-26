import { ZButton } from "@/components/button/button";
import { Order } from "@/components/order/order";
import { orderStatus } from "@/utils/enum/order_status";
import React, { useState } from "react";
import "./card.css";
import { ModalUpdateOrder } from "./modal_update_order/modal_update_order";
import ZConfirmDialog from "@/components/confirm_dialog/confirm_dialog";
import { OrderItem, OrderlistType } from "../../service/types";
import { OrderController } from "../../service/controller";

interface OrderProps {
    order: OrderlistType;
}

const OrderCard: React.FC<OrderProps> = ({ order }) => {
    const [visible, setVisible] = useState<any>(false)
    const [refundVisible, setRefundVisble] = useState(false)

    const controllerOrder = OrderController()


    const handleRefund = () => {
        controllerOrder.RefundOrderUpdateAction({
            amount: order.total_amount + order.order_items.reduce(
                (acc: number, item: OrderItem) => acc,
                0
            ), idOrder: order.id
        })
        setRefundVisble(!refundVisible)
        // aqui você pode chamar sua API (fetch/axios)
    };

    if (!order) return <>Carregando...</>

    return (
        <>
            <div className="flex flex-row justify-content-end mb-5 gap-2">
                <ZButton label="Alterar Status" onClick={() => setVisible(order)} />
                <ZButton label="Fazer reembolso" severity="danger" outlined icon='pi pi-undo' onClick={() => setRefundVisble(!refundVisible)} />
            </div>
            <Order order={order} />
            <ModalUpdateOrder visible={visible} onHide={() => setVisible(false)} />
            <ZConfirmDialog visible={refundVisible} header={'Reembolse o pagamento'} reject={() => setRefundVisble(false)} accept={() => handleRefund()} />
        </>
    );
};

export default OrderCard;
