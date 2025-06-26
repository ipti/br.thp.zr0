import { logout } from "@/service/localstorage";
import { useNavigation } from "@/utils/navigation";
import Swal from "sweetalert2";
import { ShippingCalculateType } from "./type";
import { ShippingCalculateRequest } from "./request";


export function ProductClientController() {
  const history = useNavigation();

  function ShippingCalculateAction(body: ShippingCalculateType) {
    ShippingCalculateRequest(body)
      .then((data) => {
        console.log(data)
      })
      .catch((erros) => {
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
  return {
    ShippingCalculateAction,
  };
}
