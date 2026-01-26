import Swal from "sweetalert2";
import { requestCreateAddressCustomer, requestDeleteAddressCustomer, requestUpdateDefaultAddressCustomer } from "./request";
import { CreateAddressCustomerType, UpdateDefaultAddressCustomerType } from "./type";
import { logout } from "@/service/cookies";
import queryClient from "@/service/react-query";
import { useToast } from "@/components/toast/hook/useToast";

export const ControllerAddressCustomer = () => {

  const toast = useToast()

    
      function CreateAddressCustomerAction(body: CreateAddressCustomerType) {
        requestCreateAddressCustomer(body)
          .then((data) => {
           queryClient.refetchQueries("requestCreateAddressCustomer")
          })
          .catch((erros) => {
            console.log(erros)
            Swal.fire({
              title: erros.response.data.message,
              icon: "error",
            });
            if (erros.response.status === 401) {
              logout();
              window.location.reload();
            }
            throw erros;
          });
      }

      function UpdateDefaultAddressCustomerAction(body: UpdateDefaultAddressCustomerType) {
        requestUpdateDefaultAddressCustomer(body)
          .then((data) => {
           queryClient.refetchQueries("requestCreateAddressCustomer")
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
          .then((data) => {
             toast.showToast('Endereço excluído com sucesso!', "success")
           queryClient.refetchQueries("requestCreateAddressCustomer")
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