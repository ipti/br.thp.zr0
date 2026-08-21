'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFetchRequestOrderOne } from "../../service/query";
import { OrderOneType } from "../../service/types";
import OrderCard from "./card/card";
import ZMessage from "@/components/message/message";
import "./components.css";

export function OrderOneComponents() {
    const params = useParams(); // retorna { id: "123" }
    const id = params.id;
    const [orderCreated, setOrderCreated] = useState(false)
    const {data: orderService} = useFetchRequestOrderOne(id?.toString())
    const order: OrderOneType | undefined = orderService

    useEffect(() => {
      const currentId = id?.toString()
      if (!currentId) return

      const createdOrderId = sessionStorage.getItem('production-order-created')
      if (createdOrderId === currentId) {
        sessionStorage.removeItem('production-order-created')
        setOrderCreated(true)
      }
    }, [id])
    
    return(
        <div>
           {orderCreated ? (
            <ZMessage
              severity="success"
              text="Pedido realizado com sucesso! Agora você pode efetuar o pagamento."
              className="order-created-message"
            />
           ) : null}
        
           {order ? (
            <OrderCard order={order} />
           ) : (
            <div>Nenhum pedido encontrado</div>
           )}
           <div className="p-2" />
        </div>
    )
}
