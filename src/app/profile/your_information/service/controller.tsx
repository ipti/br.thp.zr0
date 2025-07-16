import { updateCustumer } from "./request";
import { UpdateCustomerType } from "./type";

export function ControllerYourInformation(){

    function UpdateCustomer(
       {id, body}:{id: number, body: UpdateCustomerType}
      ) {
        updateCustumer({body: body, id: id})
          .then((data) => {
          })
          .catch((erros) => {
            console.log(erros.response.data.message);
          });
      }

    return {UpdateCustomer}
}