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
    const totalProducts = order?.order_items.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
    );
    return (
        <div className="grid">
            {order && <div className="col-6 p-4">

                <section className="">
                    <h3>Itens do Pedido ({totalProducts})</h3>
                    <div className="my-4">
                        {order.order_items.map((item: any) => (
                            <div key={item.id} className="flex flex-row">
                                <div className="item-info">
                                    <strong>{item.product.name}</strong>
                                </div>
                                <div className="item-details">
                                    <p>Qtd: {item.quantity}</p>
                                    <p>Preço Unitário: R$ {item.unit_price.toFixed(2)}</p>
                                    <p>Total: R$ {item.total_price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="order-section delivery">
                    <h3>Entrega</h3>
                    {delivery ? <>
                        {delivery?.map((item) => {

                            return <>
                                <p><strong>Transportadora:</strong> {item.delivery_estimate.carrier}</p>
                                <p><strong>Serviço:</strong> {item.delivery_estimate.service}</p>
                                <p><strong>Prazo:</strong> {item.delivery_estimate.deliveryTime} dias</p>
                                <p><strong>Custo:</strong> R$ {item.delivery_estimate.cost.toFixed(2)}</p>
                            </>
                        }
                        )}</> : (
                        <p>Sem informações de entrega</p>
                    )}
                </section>

                <footer className="order-footer">
                    <p><strong>Total do Pedido:</strong> R$ {(order.total_amount + (delivery?.reduce((sum, item) => sum + item.delivery_estimate.cost,
                        0) ?? 0)).toFixed(2)}</p>

                    <div className="flex flex-row justify-content-end mt-4">

                    </div>
                </footer>
            </div>}
            {order && <div className="col-6"><CheckoutComponent price={(order?.total_amount! + (delivery?.reduce((acumulador, item) => acumulador + item.delivery_estimate.cost, 0) ?? 0))} idOrder={order?.id ?? 0} /></div>}
        </div>
    )
}