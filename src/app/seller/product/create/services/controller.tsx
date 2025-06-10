import { useNavigation } from "@/utils/navigation"
import { CreateProductRequest } from "./request"
import { CreateProductTypes } from "./type"
import queryClient from "@/service/react-query"

export function CreateProductController() {

    const history = useNavigation()

    function CreateProductAction(body: CreateProductTypes) {

        const formData = new FormData()

        formData.append("name", body.name)
        formData.append("description", body.description ?? "")
        formData.append("idCategory", body.idCategory.toString())
        formData.append("price", body.price.toString())
        formData.append("height", body.height.toString())
        formData.append("length", body.length.toString())
        formData.append("weight", body.weight.toString())
        formData.append("width", body.width.toString())


        body?.files?.forEach((file: any) => {
            formData.append('files', file);
          });
        
        CreateProductRequest(formData).then(data => {
            history.history.push("/seller/product")
            queryClient.refetchQueries('userequestProduct')
        }).catch(erros => {
            
        })
    }
    return {
        CreateProductAction
    }
}