import React from "react";
import "./card.css";
import { orderStatus } from "@/utils/enum/order_status";
import { paymentStatus } from "@/utils/enum/payment_status";

interface OrderProps {
  order: any;
}

const OrderCard: React.FC<OrderProps> = ({ order }) => {
  const totalProducts = order.order_items.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  const delivery = order.order_items[0]?.delivery_estimate;

  return (
    <div className="order-card">
      <header className="order-header">
        <h2>Pedido #{order.id}</h2>
        <span className={`status ${order.status.toLowerCase()}`}>
          {orderStatus[order.status]}
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
        <p><strong>Cidade:</strong> {order.workshop.city_fk} - {order.workshop.state_fk}</p>
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
        <p><strong>Status Pagamento:</strong> {paymentStatus[order.payment_status]}</p>
      </footer>
    </div>
  );
};

export default OrderCard;
