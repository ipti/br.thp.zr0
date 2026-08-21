import queryClient from "@/service/react-query"
import Swal from "sweetalert2"
import { requestAddProductTransformationWorkshop, requestUpdateProductTransformationWorkshop } from "./request"
import { AddProductTransfWorkType, UpdateProductTransfWorkType } from "./type"

interface RequestError {
    response?: { data?: { message?: string | string[] } }
}

export function ProductTransfWorkshopController() {

    async function AddProductTransfWorkshopAction(body: AddProductTransfWorkType) {
        try {
            const data = await requestAddProductTransformationWorkshop(body)
            await queryClient.invalidateQueries(['userequestProductTransformationWorkshop'])
            Swal.fire({
                title: "Produto adicionado!",
                icon: "success",
            })
            return data
        } catch (error: unknown) {
            const requestError = error as RequestError
            const responseMessage = requestError.response?.data?.message
            const message = Array.isArray(responseMessage)
                ? responseMessage.join(' ')
                : responseMessage ?? 'Não foi possível adicionar o produto.'
            await Swal.fire({
                title: message,
                icon: "error",
            })
            throw error
        }
    }

    async function UpdateProductTransfWorkshopAction(body: UpdateProductTransfWorkType, delta: number) {
        if (delta === 0) return
        try {
            const data = await requestUpdateProductTransformationWorkshop(body, delta)
            await queryClient.invalidateQueries(['userequestProductTransformationWorkshop'])
            Swal.fire({
                title: "Quantidade atualizada!",
                icon: "success",
            })
            return data
        } catch (error: unknown) {
            const requestError = error as RequestError
            const responseMessage = requestError.response?.data?.message
            const message = Array.isArray(responseMessage)
                ? responseMessage.join(' ')
                : responseMessage ?? 'Não foi possível atualizar a quantidade.'
            await Swal.fire({
                title: message,
                icon: "error",
            })
            throw error
        }
    }

    return {
     AddProductTransfWorkshopAction, UpdateProductTransfWorkshopAction
    }
}
