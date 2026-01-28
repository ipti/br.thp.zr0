import { OrderItem } from "@/app/order/service/types";
import { orderStatus } from "@/utils/enum/order_status";
import { TimelineItem, ZTimeline } from "../timeline/timeline";
import './order.css';

export function Order({ order }: { order: any }) {

    const timeline: TimelineItem[] = [{ label: 'Pedido efeturado', id: 1 , icon: <i className="pi pi-cart-arrow-down" />, status: 'completed' }, { label: 'Pedido pago', id: 2, icon: <i className="pi pi-truck" />, status: ['PAID'].includes(order.payment_status) ? 'completed' : 'pending' }, { label: 'Pedido Enviado', id: 3, icon: <i className="pi pi-wallet" />, status: ['SHIPPED', 'COMPLETED'].includes(order.status) ? 'completed' : 'pending'  }, { label: 'Pedido finalizado', id: 4, icon: <i className="pi pi-check-circle" />, status: ['COMPLETED'].includes(order.status) ? 'completed' : 'pending' }]
   

    const timelineCancelled: TimelineItem[] = [{ label: 'Pedido efeturado', id: 1 , icon: <i className="pi pi-cart-arrow-down" />, status: 'completed' }, { label: 'Pedido Cancelado', id: 2, icon: <i className="pi pi-times" />, status: ['CANCELLED'].includes(order.status) ? 'completed' : 'pending', color: 'red' },]

   
    const delivery = order.order_items[0]?.delivery_estimate;
    const totalProducts = order.order_items.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
    );

    if(!order) return <></>



    return (
        <div>

            <div className="z-order-card">
                <div className={innerWidth > 600 ? "flex flex-row justify-content-between mb-5" : "flex flex-column mb-5 gap-2"}>
                    {/* 
                    <p className="md: flex flex-row gap-1"><p style={{ fontWeight: 'bold' }}>Pedido</p> #{order.uid}</p> */}
                    <span className={`status ${order.status.toLowerCase()}`}>
                        {orderStatus[order.status]}
                    </span>
                    <div>
                        <h1>R$ {(order.total_amount + order.order_items.reduce(
                            (acc: number, item: OrderItem) => acc + item.delivery_estimate.cost,
                            0
                        )).toFixed(2)}</h1>
                        <p>Total do Pedido </p>

                    </div>
                </div>
                <ZTimeline items={order.status === 'CANCELLED' ? timelineCancelled :timeline} direction={innerWidth > 600 ? "horizontal" : 'vertical'} />
            </div>
            <div className="p-3"></div>
            <div className="z-order-card">
                <section className="order-section">
                    <h3><i className="pi pi-user mr-1"></i>Cliente</h3>
                    <p><strong>{order.user.name}</strong> </p>
                    <p>{order.user.email}</p>
                </section>
            </div>

            <div className="p-3"></div>
            <div className="z-order-card">
                <section className="order-section">
                    <h3><i className="pi pi-shop mr-1"></i>Oficina</h3>
                    <p>Nome</p>
                    <p><strong>{order.workshop.name}</strong></p>
                    <p>CNPJ</p>
                    <p><strong>{order.workshop.cnpj}</strong></p>
                    <p>Endereço</p>
                    <p><strong>{order.workshop.address}, {order.workshop.number} - {order.workshop.neighborhood}</strong></p>
                    <p>Cidade</p>
                    <p><strong>{order.workshop.city.name} - {order.workshop.state.acronym}</strong></p>
                </section>
            </div>
            <div className="p-3"></div>
            <div className="z-order-card">
                <section className="order-section">
                    <h3><i className="pi pi-truck mr-1"></i>Endereço de Entrega</h3>
                    <p>{order.order_delivery_address.address}, {order.order_delivery_address.number}, {order.order_delivery_address.neighborhood}</p>
                    <p>{order.order_delivery_address.city.name} / {order.order_delivery_address.state.acronym}</p>
                    <p>CEP: {order.order_delivery_address.cep}</p>
                    {delivery ? (
                        <>
                            <p>{delivery.carrier} - {delivery.service}</p>
                            <p>R$ {delivery.cost.toFixed(2)} - {delivery.deliveryTime} dias uteis</p>
                        </>
                    ) : (
                        <p>Sem informações de entrega</p>
                    )}
                </section>
            </div>
            <div className="p-3"></div>
            <div className="z-order-card">
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
            </div>
        </div >
    )
}