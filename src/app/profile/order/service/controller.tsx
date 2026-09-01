import queryClient from "@/service/react-query"
import Swal from "sweetalert2"
import { requestOrderUpdate } from "./request"
import { OrderUpdate } from "./types"

export function OrderController() {

    function OrderUpdateAction(id: string, body: OrderUpdate) {
        return requestOrderUpdate(id, body).then(() => {
            Swal.fire({
                title: "Pedido atualizado!",
                icon: "success",

            })
            queryClient.refetchQueries(['useRequestOrderOne'])
            queryClient.refetchQueries(['useRequestOrderTransformationWorkshop'])
        }).catch(erros => {
            Swal.fire({
                title: erros.response?.data?.message ?? 'Não foi possível atualizar o pedido.',
                icon: "error",

            })
        })
    }



    return {
        OrderUpdateAction
    }
}
