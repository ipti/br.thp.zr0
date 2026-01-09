import { formatDateToBR } from "@/utils/hook/format_data";
import { Order } from "../../service/types";
import "./card_order.css";
import { useRouter } from "next/navigation";
import { orderStatus } from "@/utils/enum/order_status";

export default function CardOrder({ item }: { item: Order }) {
    const history = useRouter()
    return (
        <div className="card_order" onClick={() => history.push(`/profile/order/${item.id.toString()}`)}>
            <h4>
                #{item.uid}
            </h4>
            <div className="p-1" />
            <div className="flex flex-row justify-content-between">
                <div className="flex flex-row gap-2 align-items-center">
                    {item.order_items.slice(0, 3).map((order_item) => {
                        return (<img
                            key={order_item.product.id}
                            src={order_item.product.product_image[0]?.img_url}
                            alt={order_item.product.name}
                            className="product_image_order_card"
                        />
                        )
                    })}

                </div>
                <div className="flex flex-row gap-2 align-items-center">
                    <div className={`status ${item.payment_status.toLowerCase()}`}>
                        <i className="pi pi-dollar" />
                    </div>
                    <div className={`status ${item.status.toLowerCase()}`}>
                        Status: {orderStatus[item.status]}
                    </div>
                </div>
            </div>
            <div className="p-1" />
            <div className="flex flex-row justify-content-between">

                <p>
                    {formatDateToBR(item.createdAt)}
                </p>
                <p>
                    Quant. produtos: {item._count.order_items}
                </p>
            </div>

        </div>
    )
}