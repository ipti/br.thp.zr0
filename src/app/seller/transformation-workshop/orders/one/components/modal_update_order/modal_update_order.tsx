import { ZButton } from "@/components/button/button";
import ZDialog from "@/components/dialog/dialog";
import ZDropdown from "@/components/dropdown/dropdown";
import { orderStatus } from "@/utils/enum/order_status";
import { paymentStatus } from "@/utils/enum/payment_status";
import { useEffect, useState } from "react";
import { OrderController } from "../../../service/controller";

export function ModalUpdateOrder({ visible, onHide }: { visible: any, onHide(): void }) {

    const [status, setStatus] = useState(visible.status);
    const [payStatus, setPayStatus] = useState(visible.payment_status);

    const controllerOrder = OrderController()

   useEffect(() => {
      setPayStatus(visible.payment_status)
      setStatus(visible.status)
    }, [visible]);

    const handleSave = () => {
        controllerOrder.OrderUpdateAction(visible.id, { status: status, payment_status: payStatus })
        onHide()
        // aqui você pode chamar sua API (fetch/axios)
    };

     
    return (
        <ZDialog visible={visible} onHide={onHide} header={'Editar Status'} style={{width: innerWidth < 600 ? '90vw' : '50vw'}}>
            <footer className="order-footer">

                <div className="status-edit mt-4">
                    <div className="flex flex-column gap-2">
                        <label>Status do Pedido</label>
                        <ZDropdown options={Object.keys(orderStatus).map((item) => { return { name: orderStatus[item], value: item } })} optionLabel="name" value={status} onChange={(e) => setStatus(e.target.value)} />
                        {/* <select >
              {Object.keys(orderStatus).map((key) => (
                <option key={key} value={key}>
                  {orderStatus[key]}
                </option>
              ))}
            </select> */}
                    </div>
                    <div className="flex flex-column gap-2 mt-4">
                        <label>Status do Pagamento</label>
                        <ZDropdown options={Object.keys(paymentStatus).map((item) => { return { name: paymentStatus[item], value: item } })} optionLabel="name" value={payStatus} onChange={(e) => setPayStatus(e.target.value)} />
                    </div>
                </div>
                <div className="flex flex-row justify-content-end mt-4">
                    <ZButton onClick={handleSave}>
                        Salvar Alterações
                    </ZButton>
                </div>
            </footer>
        </ZDialog>
    )
}