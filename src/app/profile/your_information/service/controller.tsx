import Swal from "sweetalert2";
import { createAddressBilling, updateAddressBilling, updateCustumer, updateUser } from "./request";
import { CreateAddressBilling, UpdateCustomerType, UpdateUserType } from "./type";

export function ControllerYourInformation(){

    function UpdateCustomer(
       {id, body}:{id: number, body: UpdateCustomerType}
      ) {
        updateCustumer({body: body, id: id})
          .then((data) => {
            Swal.fire({
              title: "Dados atualizados com sucesso!",
              icon: "success",
            });
          })
          .catch((erros) => {
            console.log(erros.response.data.message);
          });
      }

       function UpdateUser(
       {id, body}:{id: number, body: UpdateUserType}
      ) {
        updateUser({body: body, id: id})
          .then((data) => {
          })
          .catch((erros) => {
            console.log(erros.response.data.message);
          });
      }

      function CreateAddressBilling(
       {body}:{body: CreateAddressBilling}
      ) {
        createAddressBilling({body: body})
          .then((data) => {
          })
          .catch((erros) => {
            console.log(erros.response.data.message);
          });
      }

      function UpdateAddressBilling(
       {body, id}:{body: CreateAddressBilling, id: number}
      ) {
        updateAddressBilling({body: body, id: id})
          .then((data) => {
          })
          .catch((erros) => {
            console.log(erros.response.data.message);
          });
      }

    return {UpdateCustomer, UpdateUser, CreateAddressBilling, UpdateAddressBilling}
}