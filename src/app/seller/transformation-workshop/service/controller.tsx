import Swal from "sweetalert2";
import { CreateTransformationWorkshopRequest, UpdateTransformationWorkshopRequest } from "./request";
import { TransformationWorkshopTypes } from "./type";
import { useNavigation } from "@/utils/navigation";

export function TransformationWorkshopController() {
  const history = useNavigation();

  async function CreateTransformationWorkshopAction(
    body: TransformationWorkshopTypes
  ) {
    try {
      await CreateTransformationWorkshopRequest(body);
      Swal.fire({
        title: "Oficina de transformação criada com sucesso!",
        icon: "success",
      });
      history.history.push("/seller/transformation-workshop");
    } catch (error: any) {
      Swal.fire({
        title: error.response?.data?.message || "Erro ao criar oficina",
        icon: "error",
      });
    }
  }

  async function UpdateTransformationWorkshopAction(
    id: string,
    body: TransformationWorkshopTypes
  ) {
    try {
      await UpdateTransformationWorkshopRequest(id, body);
      Swal.fire({
        title: "Oficina de transformação atualizada com sucesso!",
        icon: "success",
      });
      history.history.push("/seller/transformation-workshop");
    } catch (error: any) {
      Swal.fire({
        title: error.response?.data?.message || "Erro ao atualizar oficina",
        icon: "error",
      });
    }
  }

  return {
    CreateTransformationWorkshopAction,
    UpdateTransformationWorkshopAction,
  };
}

