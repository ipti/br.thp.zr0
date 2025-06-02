import { useNavigation } from "@/utils/navigation"
import { AddUserTrnasfWorkType } from "./type"
import Swal from "sweetalert2"
import { requestAddTransformationWorkshop } from "./request"
import queryClient from "@/service/react-query"

export function AddUserTransfWorkshopController() {

    const history = useNavigation()

    function AddUserTransfWorkshopAction(body: AddUserTrnasfWorkType) {
        requestAddTransformationWorkshop(body).then(data => {
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