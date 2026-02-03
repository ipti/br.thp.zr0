'use client'
import { useSearchParams } from "next/navigation";
import { useFetchRequestOrderOne } from "../service/query"
import { OrderOneType } from "../service/types";
import OrderCard from "./components/card";
import { getIdTw } from "@/service/cookies";

export default function OrdersPage() {
  const searchParams = useSearchParams();

  const idOrder = searchParams.get("idOrder");
    const {data: orderService} = useFetchRequestOrderOne(idOrder ?? undefined)
    const order: OrderOneType | undefined = orderService
    
    return(
        <div>
           {order ? (
            <OrderCard order={order} />
           ) : (
            <div>Nenhum pedido encontrado</div>
           )}
        </div>
    )
}