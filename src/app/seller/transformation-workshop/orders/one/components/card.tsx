import React, { useState } from "react";
import "./card.css";
import { orderStatus } from "@/utils/enum/order_status";
import { paymentStatus } from "@/utils/enum/payment_status";
import ZDropdown from "@/components/dropdown/dropdown";
import { ZButton } from "@/components/button/button";
import { OrderController } from "../../service/controller";

interface OrderProps {
    order: any;
}

const OrderCard: React.FC<OrderProps> = ({ order }) => {
    const totalProducts = order.order_items.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
    );

    const controllerOrder = OrderController()

    const delivery = order.order_items[0]?.delivery_estimate;

    // estados locais para edição
    const [status, setStatus] = useState(order.status);
    const [payStatus, setPayStatus] = useState(order.payment_status);

    const handleSave = () => {
        controllerOrder.OrderUpdateAction(order.id, { status: status, payment_status: payStatus })
        // aqui você pode chamar sua API (fetch/axios)
        console.log("Novo status:", status, " | Novo pagamento:", payStatus);
    };

    if(!order) return <>Carregando...</>

    return (
        <div className="order-card">
            <header className="order-header grid">
                <p className="md: flex flex-row gap-1"><p style={{fontWeight: 'bold'}}>Pedido</p> #{order.uid}</p>
                <span className={`status ${status.toLowerCase()}`}>
                    {orderStatus[status]}
                </span>
            </header>

            <section className="order-section">
                <h3>Cliente</h3>
                <p><strong>Nome:</strong> {order.user.name}</p>
                <p><strong>Email:</strong> {order.user.email}</p>
            </section>

            <section className="order-section">
                <h3>Oficina</h3>
                <p><strong>Nome:</strong> {order.workshop.name}</p>
                <p><strong>CNPJ:</strong> {order.workshop.cnpj}</p>
                <p><strong>Endereço:</strong> {order.workshop.address}, {order.workshop.number} - {order.workshop.neighborhood}</p>
                <p><strong>Cidade:</strong> {order.workshop.city.name} - {order.workshop.state.acronym}</p>
            </section>

            <section className="order-section">
                <h3>Endereço de Entrega</h3>
                <p>{order.order_delivery_address.address}, {order.order_delivery_address.number}</p>
                <p>{order.order_delivery_address.neighborhood}</p>
                <p>{order.order_delivery_address.city.name} / {order.order_delivery_address.state.acronym}</p>
                <p>CEP: {order.order_delivery_address.cep}</p>
            </section>

            <section className="order-section">
                <h3>Itens do Pedido ({totalProducts})</h3>
                <ul>
                    {order.order_items.map((item: any) => (
                        <li key={item.id}>
                            <div className="item-info">
                                <strong>{item.product.name}</strong>
                                <p>{item.product.description}</p>
                            </div>
                            <div className="item-details">
                                <p>Qtd: {item.quantity}</p>
                                <p>Preço Unitário: R$ {item.unit_price.toFixed(2)}</p>
                                <p>Total: R$ {item.total_price.toFixed(2)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="order-section delivery">
                <h3>Entrega</h3>
                {delivery ? (
                    <>
                        <p><strong>Transportadora:</strong> {delivery.carrier}</p>
                        <p><strong>Serviço:</strong> {delivery.service}</p>
                        <p><strong>Prazo:</strong> {delivery.deliveryTime} dias</p>
                        <p><strong>Custo:</strong> R$ {delivery.cost.toFixed(2)}</p>
                    </>
                ) : (
                    <p>Sem informações de entrega</p>
                )}
            </section>

            <footer className="order-footer">
                <p><strong>Total do Pedido:</strong> R$ {order.total_amount.toFixed(2)}</p>

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
        </div>
    );
};

export default OrderCard;
