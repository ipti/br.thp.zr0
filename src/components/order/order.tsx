import { OrderItem } from "@/app/order/service/types";
import { orderStatus } from "@/utils/enum/order_status";
import { TimelineItem, ZTimeline } from "../timeline/timeline";
import './order.css';
import { OrderOneType } from "@/app/profile/order/service/types";
import { Accordion, AccordionTab } from "primereact/accordion";

export function Order({ order }: { order: OrderOneType }) {




    if (!order) return <></>

    const onlyOrderOne = order.order_services[0]

    function OrderOne() {


        const timeline: TimelineItem[] = [{ label: 'Pedido efeturado', id: 1, icon: <i className="pi pi-cart-arrow-down" />, status: 'completed' }, { label: 'Pedido pago', id: 2, icon: <i className="pi pi-truck" />, status: ['PAID'].includes(order.payment_status) ? 'completed' : 'pending' }, { label: 'Pedido Enviado', id: 3, icon: <i className="pi pi-wallet" />, status: ['SHIPPED', 'COMPLETED'].includes(onlyOrderOne.status) ? 'completed' : 'pending' }, { label: 'Pedido finalizado', id: 4, icon: <i className="pi pi-check-circle" />, status: ['COMPLETED'].includes(onlyOrderOne.status) ? 'completed' : 'pending' }]

        const timelineCancelled: TimelineItem[] = [{ label: 'Pedido efeturado', id: 1, icon: <i className="pi pi-cart-arrow-down" />, status: 'completed' }, { label: 'Pedido Cancelado', id: 2, icon: <i className="pi pi-times" />, status: ['CANCELLED'].includes(onlyOrderOne.status) ? 'completed' : 'pending', color: 'red' },]
        const delivery = onlyOrderOne?.order_item[0]?.delivery_estimate;
        const totalProducts = onlyOrderOne?.order_item.reduce(
            (acc: number, item: any) => acc + item.quantity,
            0
        );

        return (
            <>
                <div className="z-order-card">
                    <div className={innerWidth > 600 ? "flex flex-row justify-content-between mb-5" : "flex flex-column mb-5 gap-2"}>
                        {/* 
                    <p className="md: flex flex-row gap-1"><p style={{ fontWeight: 'bold' }}>Pedido</p> #{order.uid}</p> */}
                        <span className={`status ${onlyOrderOne.status.toLowerCase()}`}>
                            {orderStatus[onlyOrderOne.status]}
                        </span>
                        <div>
                            <h1>R$ {(onlyOrderOne.total_amount + onlyOrderOne.order_item.reduce(
                                (acc: number, item: OrderItem) => acc + item.delivery_estimate.cost,
                                0
                            )).toFixed(2)}</h1>
                            <p>Total do Pedido </p>
                        </div>
                    </div>
                    <ZTimeline items={onlyOrderOne.status === 'CANCELLED' ? timelineCancelled : timeline} direction={innerWidth > 600 ? "horizontal" : 'vertical'} />
                </div>
                <div className="p-3"></div>
                <div className="z-order-card">
                    <section className="order-section">
                        <h3><i className="pi pi-shop mr-1"></i>Oficina</h3>
                        <p>Nome</p>
                        <p><strong>{onlyOrderOne.transformation_workshop.name}</strong></p>
                        <p>CNPJ</p>
                        <p><strong>{onlyOrderOne.transformation_workshop.cnpj}</strong></p>
                        <p>Endereço</p>
                        <p><strong>{onlyOrderOne.transformation_workshop.address}, {onlyOrderOne.transformation_workshop.number} - {onlyOrderOne.transformation_workshop.neighborhood}</strong></p>
                        <p>Cidade</p>
                        <p><strong>{onlyOrderOne.transformation_workshop.city.name} - {onlyOrderOne.transformation_workshop.state.acronym}</strong></p>
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
                {order.order_services.map((item) => {
                    return (
                        <div className="z-order-card" key={item.id}>
                            <section className="order-section">
                                <h3>Itens do Pedido ({totalProducts})</h3>
                                <ul>
                                    {item.order_item.map((item: any) => (
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
                    )
                })}
            </>
        )

    }

    return (
        <div>
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
                    <h3><i className="pi pi-truck mr-1"></i>Endereço de Entrega</h3>
                    <p>{order.order_delivery_address.address}, {order.order_delivery_address.number}, {order.order_delivery_address.neighborhood}</p>
                    <p>{order.order_delivery_address.city.name} / {order.order_delivery_address.state.acronym}</p>
                    <p>CEP: {order.order_delivery_address.cep}</p>

                </section>
            </div>
            <div className="p-3"></div>
            {order.order_services.length > 1 ? <>
                <Accordion activeIndex={0}>
                    {order.order_services.map((item) => {

                        const timeline: TimelineItem[] = [{ label: 'Pedido efeturado', id: 1, icon: <i className="pi pi-cart-arrow-down" />, status: 'completed' }, { label: 'Pedido pago', id: 2, icon: <i className="pi pi-truck" />, status: ['PAID'].includes(order.payment_status) ? 'completed' : 'pending' }, { label: 'Pedido Enviado', id: 3, icon: <i className="pi pi-wallet" />, status: ['SHIPPED', 'COMPLETED'].includes(item.status) ? 'completed' : 'pending' }, { label: 'Pedido finalizado', id: 4, icon: <i className="pi pi-check-circle" />, status: ['COMPLETED'].includes(item.status) ? 'completed' : 'pending' }]

                        const timelineCancelled: TimelineItem[] = [{ label: 'Pedido efeturado', id: 1, icon: <i className="pi pi-cart-arrow-down" />, status: 'completed' }, { label: 'Pedido Cancelado', id: 2, icon: <i className="pi pi-times" />, status: ['CANCELLED'].includes(item.status) ? 'completed' : 'pending', color: 'red' },]
                        const delivery = item?.order_item[0]?.delivery_estimate;
                        const totalProducts = item?.order_item.reduce(
                            (acc: number, item: any) => acc + item.quantity,
                            0
                        );
                        return (
                            <AccordionTab header={'Pedido #' + item.uid} key={item.id}>
                                <div className="z-order-card">
                                    <div className={innerWidth > 600 ? "flex flex-row justify-content-between mb-5" : "flex flex-column mb-5 gap-2"}>
                                        {/* 
                    <p className="md: flex flex-row gap-1"><p style={{ fontWeight: 'bold' }}>Pedido</p> #{order.uid}</p> */}
                                        <span className={`status ${item.status.toLowerCase()}`}>
                                            {orderStatus[item.status]}
                                        </span>
                                        <div>
                                            <h1>R$ {(item.total_amount + item.order_item.reduce(
                                                (acc: number, item: OrderItem) => acc + item.delivery_estimate.cost,
                                                0
                                            )).toFixed(2)}</h1>
                                            <p>Total do Pedido </p>
                                        </div>
                                    </div>
                                    <ZTimeline items={item.status === 'CANCELLED' ? timelineCancelled : timeline} direction={innerWidth > 600 ? "horizontal" : 'vertical'} />
                                </div>
                                <div className="p-3"></div>
                                <div className="z-order-card">
                                    <section className="order-section">
                                        <h3><i className="pi pi-shop mr-1"></i>Oficina</h3>
                                        <p>Nome</p>
                                        <p><strong>{item.transformation_workshop.name}</strong></p>
                                        <p>CNPJ</p>
                                        <p><strong>{item.transformation_workshop.cnpj}</strong></p>
                                        <p>Endereço</p>
                                        <p><strong>{item.transformation_workshop.address}, {item.transformation_workshop.number} - {item.transformation_workshop.neighborhood}</strong></p>
                                        <p>Cidade</p>
                                        <p><strong>{item.transformation_workshop.city.name} - {item.transformation_workshop.state.acronym}</strong></p>
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
                                            {item.order_item.map((item: any) => (
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
                            </AccordionTab>

                        )
                    })}
                </Accordion>
            </> : <>
             {onlyOrderOne ? OrderOne() : <>Error</>}
            </>}

        </div >
    )
}