import { logout } from "@/service/localstorage";
import { useNavigation } from "@/utils/navigation";
import Swal from "sweetalert2";
import { CreateCategoryRequest } from "./request";
import { CreateCategoryTypes } from "./type";

export function CreateCategoryController() {
  const history = useNavigation();

  function CreateCategoryAction(body: CreateCategoryTypes) {
    CreateCategoryRequest(body)
      .then((data) => {
        history.history.push("/seller/category");
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
    CreateCategoryAction,
  };
}
