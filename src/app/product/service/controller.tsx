import { logout } from "@/service/localstorage";
import { useNavigation } from "@/utils/navigation";
import Swal from "sweetalert2";
import { ShippingCalculateType } from "./type";
import { ShippingCalculateRequest } from "./request";
import { SetStateAction } from "react";


export function ProductClientController({ setShipping, setShippingSelect }: { setShipping?: any, setShippingSelect?: any }) {
  const history = useNavigation();

  function ShippingCalculateAction(body: ShippingCalculateType, setLoading: (value: SetStateAction<boolean>) => void) {
    ShippingCalculateRequest(body)
      .then((data) => {
        if (setShipping) setShipping(data.data)
        setLoading(false)
        if (setShippingSelect) setShippingSelect(data?.data?.shipments[0]?.result?.bestOption)
      })
      .catch((erros) => {
        console.log(erros)
        setLoading(false)

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
