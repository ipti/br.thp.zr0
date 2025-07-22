import Swal from "sweetalert2";
import { requestCreateAddressCustomer } from "./request";
import { CreateAddressCustomerType } from "./type";
import { logout } from "@/service/cookies";
import queryClient from "@/service/react-query";

export const ControllerAddressCustomer = () => {

    
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

    return {CreateAddressCustomerAction}
}