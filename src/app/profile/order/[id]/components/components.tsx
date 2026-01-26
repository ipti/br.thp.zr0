'use client'
import { useParams } from "next/navigation";
import { useFetchRequestOrderOne } from "../../service/query";
import { OrderOneType } from "../../service/types";
import OrderCard from "./card/card";
import { Button } from "primereact/button";
import { ZButton } from "@/components/button/button";

export function OrderOneComponents() {
    const params = useParams(); // retorna { id: "123" }
    const id = params.id;
    const {data: orderService} = useFetchRequestOrderOne(id?.toString())
    const order: OrderOneType | undefined = orderService
    
    return(
        <div>
        
           {order ? (
            <OrderCard order={order} />
           ) : (
            <div>Nenhum pedido encontrado</div>
           )}
           <div className="p-2" />
        </div>
    )
}