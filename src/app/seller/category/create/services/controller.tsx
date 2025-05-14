import { useNavigation } from "@/utils/navigation"
import { CreateCategoryRequest } from "./request"
import { CreateCategoryTypes } from "./type"

export function CreateCategoryController() {

    const history = useNavigation()

    function CreateCategoryAction(body: CreateCategoryTypes) {
        CreateCategoryRequest(body).then(data => {
            history.history.push("/seller/category")
            
        }).catch(erros => {
            
        })
    }
    return {
        CreateCategoryAction
    }
}