import { useNavigation } from "@/utils/navigation"
import { CreateProductRequest } from "./request"
import { CreateProductTypes } from "./type"

export function CreateProductController() {

    const history = useNavigation()

    function CreateProductAction(body: CreateProductTypes) {
        CreateProductRequest(body).then(data => {
            history.history.push("/")
            
        }).catch(erros => {
            
        })
    }
    return {
        CreateProductAction
    }
}