import queryClient from "@/service/react-query"
import Swal from "sweetalert2"
import { requestAddProductTransformationWorkshop, requestUpdateProductTransformationWorkshop } from "./request"
import { AddProductTransfWorkType, UpdateProductTransfWorkType } from "./type"

export function ProductTransfWorkshopController() {

    function AddProductTransfWorkshopAction(body: AddProductTransfWorkType) {
        requestAddProductTransformationWorkshop(body).then(data => {
            Swal.fire({
                title: "Produto adicionado!",
                icon: "success",
                
            })
            queryClient.refetchQueries('useRequestTransformationWorkshop')
        }).catch(erros => {
             Swal.fire({
                title: erros.response.data.message,
                icon: "error",
                
            })
        })
    }

    function UpdateProductTransfWorkshopAction(id: number,body: UpdateProductTransfWorkType) {
        requestUpdateProductTransformationWorkshop(id, body).then(data => {
            Swal.fire({
                title: "Quantidade atualizada!",
                icon: "success",
                
            })
            queryClient.refetchQueries('useRequestTransformationWorkshop')
        }).catch(erros => {
             Swal.fire({
                title: erros.response.data.message,
                icon: "error",
                
            })
        })
    }

    return {
     AddProductTransfWorkshopAction, UpdateProductTransfWorkshopAction
    }
}