import Swal from "sweetalert2";
import { CreateTransformationWorkshopRequest } from "./request";
import { CreateTransformationWorkshopTypes } from "./type";
import { useNavigation } from "@/utils/navigation";

export function TransformationWorkshopController() {
  const history = useNavigation();

  function CreateTransformationWorkshopAction(
    body: CreateTransformationWorkshopTypes
  ) {
    CreateTransformationWorkshopRequest(body)
      .then((data) => {
        Swal.fire({
          title: "Oficina de transformação criada com sucesso!",
          icon: "success",
        });
        history.history.push("/seller/transformation-workshop");
      })
      .catch((erros) => {
        Swal.fire({
          title: erros.response.data.message,
          icon: "error",
        });
      });
  }

  return {
    CreateTransformationWorkshopAction,
  };
}
