import queryClient from "@/service/react-query"
import Swal from "sweetalert2"
import { requestOrderUpdate } from "./request"
import { OrderUpdate } from "./types"

export function OrderController() {

    function OrderUpdateAction(id: string, body: OrderUpdate) {
        requestOrderUpdate(id, body).then(data => {
            Swal.fire({
                title: "Produto adicionado!",
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
        OrderUpdateAction
    }
}