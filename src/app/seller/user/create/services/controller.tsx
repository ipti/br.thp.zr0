import { useNavigation } from "@/utils/navigation"
import { CreateUserRequest } from "./request"
import { CreateUserTypes } from "./type"

export function CreateUserController() {

    const history = useNavigation()

    function CreateUserAction(body: CreateUserTypes) {
        CreateUserRequest(body).then(data => {
            history.history.push("/")
            
        }).catch(erros => {
            
        })
    }
    return {
        CreateUserAction
    }
}