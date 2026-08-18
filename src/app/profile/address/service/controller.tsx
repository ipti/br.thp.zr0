import { requestCreateAddressCustomer, requestDeleteAddressCustomer, requestUpdateDefaultAddressCustomer } from "./request";
import { CreateAddressCustomerType, UpdateDefaultAddressCustomerType } from "./type";
import { logout } from "@/service/cookies";
import queryClient from "@/service/react-query";
import { useToast } from "@/components/toast/hook/useToast";
import { isAxiosError } from "axios";

export const ControllerAddressCustomer = () => {

  const toast = useToast()

    
      async function CreateAddressCustomerAction(body: CreateAddressCustomerType) {
        try {
          const data = await requestCreateAddressCustomer(body)
          await queryClient.invalidateQueries(["useFetchRequestGetAddressCustomer"])
          toast.showToast('Endereço adicionado com sucesso!', 'success')
          return data
        } catch (error: unknown) {
          const message = isAxiosError<{ message?: string }>(error)
            ? error.response?.data?.message ?? 'Não foi possível adicionar o endereço.'
            : 'Não foi possível adicionar o endereço.'
          toast.showToast(message, 'error')
          if (isAxiosError(error) && error.response?.status === 401) {
            logout()
            window.location.reload()
          }
          throw error
        }
      }

      function UpdateDefaultAddressCustomerAction(body: UpdateDefaultAddressCustomerType) {
        requestUpdateDefaultAddressCustomer(body)
          .then(() => {
           void queryClient.invalidateQueries(["useFetchRequestGetAddressCustomer"])
           toast.showToast('Endereço definido como padrão!', "success")
          })
          .catch((erros) => {
            console.log(erros)
            toast.showToast(erros.response.data.message, "error")
           
            if (erros.response.status === 401) {
              logout();
              window.location.reload();
            }
            throw erros;
          });
      }

      function DeleteAddressCustomerAction(id: number, costumerId: number) {
        requestDeleteAddressCustomer(id, costumerId)
          .then(() => {
             toast.showToast('Endereço excluído com sucesso!', "success")
           void queryClient.invalidateQueries(["useFetchRequestGetAddressCustomer"])
          })
          .catch((erros) => {
            console.log(erros)
            toast.showToast(erros.response.data.message, "error")
            if (erros.response.status === 401) {
              logout();
              window.location.reload();
            }
            throw erros;
          });
      }

    return {CreateAddressCustomerAction, DeleteAddressCustomerAction, UpdateDefaultAddressCustomerAction}
}
