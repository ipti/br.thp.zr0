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
                
            <div className={`status ${item.payment_status.toLowerCase()}`}>
                <i className="pi pi-dollar" />
            </div>
            <div className={`status ${item.status.toLowerCase()}`}>
                Status: {orderStatus[item.status]}
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