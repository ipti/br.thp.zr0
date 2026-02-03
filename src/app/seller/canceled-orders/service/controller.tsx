import queryClient from "@/service/react-query"
import Swal from "sweetalert2"
import { requestOrderUpdate, requestRefundOrderUpdate } from "./request"
import { OrderUpdate, RefundOrder } from "./types"

export function OrderController() {

    function OrderUpdateAction(idOne?: string,body: OrderUpdate) {
        requestOrderUpdate(idOne, body).then(data => {
            Swal.fire({
                title: "Pedido atualizado!",
                icon: "success",

            })
            queryClient.refetchQueries('useRequestOrderOne')
            queryClient.refetchQueries('useRequestOrderTransformationWorkshop')
        }).catch(erros => {
            Swal.fire({
                title: erros.response.data.message,
                icon: "error",

            })
        })
    }

     function RefundOrderUpdateAction(body: RefundOrder) {
        requestRefundOrderUpdate(body).then(data => {
            Swal.fire({
                title: "Reembolso aplicado!",
                icon: "success",

            })
            queryClient.refetchQueries('useRequestOrderOne')
            queryClient.refetchQueries('useRequestOrderTransformationWorkshop')
        }).catch(erros => {
            Swal.fire({
                title: erros.response.data.message,
                icon: "error",

            })
        })
    }



    return {
        OrderUpdateAction, RefundOrderUpdateAction
    }
}