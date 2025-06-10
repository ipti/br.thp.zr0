import { useNavigation } from "@/utils/navigation"
import { AddProductTransfWorkType, AddUserTransfWorkType, UpdateProductTransfWorkType } from "./type"
import Swal from "sweetalert2"
import { requestAddUserTransformationWorkshop, requestAddProductTransformationWorkshop, requestUpdateProductTransformationWorkshop } from "./request"
import queryClient from "@/service/react-query"

export function TransfWorkshopController() {

    function AddUserTransfWorkshopAction(body: AddUserTransfWorkType) {
        requestAddUserTransformationWorkshop(body).then(data => {
            Swal.fire({
                title: "Membro adicionado!",
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
        AddUserTransfWorkshopAction, AddProductTransfWorkshopAction, UpdateProductTransfWorkshopAction
    }
}