import queryClient from "@/service/react-query"
import Swal from "sweetalert2"
import { requestAddUserTransformationWorkshop } from "./request"
import { AddUserTransfWorkType } from "./type"

export function MemberTransfWorkshopController() {


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

    
    return {
        AddUserTransfWorkshopAction
    }
}