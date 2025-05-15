import { useNavigation } from "@/utils/navigation"
import { CreateUserRequest } from "./request"
import { CreateUserTypes } from "./type"
import Swal from "sweetalert2"

export function CreateUserController() {

    const history = useNavigation()

    function CreateUserAction(body: CreateUserTypes) {
        CreateUserRequest(body).then(data => {
            Swal.fire({
                title: "Perfil criado, por favor verificar email",
                icon: "success",
                
            })
            history.history.push("/")
            
        }).catch(erros => {
            
        })
    }
    return {
        CreateUserAction
    }
}