import { logout } from "@/service/localstorage";
import { useNavigation } from "@/utils/navigation";
import Swal from "sweetalert2";
import { CreateCategoryRequest, UpdateCategoryRequest } from "./request";
import { CategoryTypes } from "./type";

export function CategoryController() {
  const history = useNavigation();

  function CreateCategoryAction(body: CategoryTypes) {
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

  async function UpdateCategoryAction(
      id: string,
      body: CategoryTypes
    ) {
      try {
        await UpdateCategoryRequest(id, body);
        Swal.fire({
          title: "Categoria atualizada com sucesso!",
          icon: "success",
        });
        history.history.push("/seller/category");
      } catch (error: any) {
        Swal.fire({
          title: error.response?.data?.message || "Erro ao atualizar categoria",
          icon: "error",
        });
      }
    }
  return {
    CreateCategoryAction,
    UpdateCategoryAction
  };


}
