'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFetchRequestOrderOne } from "../../service/query";
import { OrderOneType } from "../../service/types";
import OrderCard from "./card/card";
import ZMessage from "@/components/message/message";
import { ZButton } from "@/components/button/button";
import ZSkeleton from "@/components/skeleton/skeleton";
import "./components.css";

export function OrderOneComponents() {
    const params = useParams(); // retorna { id: "123" }
    const id = params.id;
    const [orderCreated, setOrderCreated] = useState(false)
    const {
      data: orderService,
      isLoading,
      isError,
      refetch
    } = useFetchRequestOrderOne(id?.toString())
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
        
           {isLoading ? (
            <div className="order-detail-loading" aria-label="Carregando pedido">
              <ZSkeleton width="100%" height="13rem" />
              <div className="order-detail-loading__grid">
                <ZSkeleton width="100%" height="22rem" />
                <ZSkeleton width="100%" height="16rem" />
              </div>
            </div>
           ) : isError ? (
            <div className="order-detail-state" role="alert">
              <span className="order-detail-state__icon"><i className="pi pi-exclamation-circle" aria-hidden="true" /></span>
              <h1>Não foi possível carregar o pedido</h1>
              <p>Verifique sua conexão e tente novamente.</p>
              <ZButton label="Tentar novamente" icon="pi pi-refresh" outlined onClick={() => void refetch()} />
            </div>
           ) : order ? (
            <OrderCard order={order} />
           ) : (
            <div className="order-detail-state" role="status">
              <span className="order-detail-state__icon"><i className="pi pi-search" aria-hidden="true" /></span>
              <h1>Pedido não encontrado</h1>
              <p>Não encontramos um pedido com este identificador na sua conta.</p>
            </div>
           )}
           <div className="p-2" />
        </div>
    )
}
