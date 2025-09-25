import { useNavigation } from "@/utils/navigation"
import { ProductTypes } from "./type"
import Swal from "sweetalert2";
import { CreateProductRequest, UpdateProductRequest } from "./request";
import queryClient from "@/service/react-query"

export function ProductController() {

    const history = useNavigation()

    function CreateProductAction(body: ProductTypes) {

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

    async function UpdateProductAction(id: string, body: ProductTypes) {
        try {
            await UpdateProductRequest(id, body);
            Swal.fire({
                title: "Produto atualizado com sucesso!",
                icon: "success",
            });
            history.history.push("/seller/product");
        } catch (error: any) {
            Swal.fire({
                title: error.response?.data?.message || "Erro ao atualizar produto",
                icon: "error",
            });
        }

    }

    return {
        CreateProductAction,
        UpdateProductAction,
    };
}