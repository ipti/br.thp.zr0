import { useNavigation } from "@/utils/navigation";
import { CreateUserRequest, UpdateUserRequest } from "./request";
import { UserTypes } from "../service/type";
import Swal from "sweetalert2";
import { logout } from "@/service/localstorage";

export function UserController() {
  const history = useNavigation();

  function CreateUserAction(body: UserTypes) {
    CreateUserRequest(body)
      .then((data) => {
        Swal.fire({
          title: "Perfil criado, por favor verificar email",
          icon: "success",
        });
        history.history.push("/");
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

  async function UpdateUserAction(id: string, body: UserTypes) {
    try {
      await UpdateUserRequest(id, body);
      Swal.fire({
        title: "Usuário atualizado com sucesso!",
        icon: "success",
      });
      history.history.push("/seller/user");
    } catch (error: any) {
      Swal.fire({
        title: error.response?.data?.message || "Erro ao atualizar usuário",
        icon: "error",
      });
    }
    
  }
  return {
    CreateUserAction,
    UpdateUserAction
  };
}
