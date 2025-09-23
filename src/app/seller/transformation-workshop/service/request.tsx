import http from "@/service/axios";
import { TransformationWorkshopTypes } from "./type";

export const CreateTransformationWorkshopRequest = async (
  body: TransformationWorkshopTypes
) => {
  return await http.post("/transformation-workshop", body);
};

export const UpdateTransformationWorkshopRequest = async (
  id: string,
  body: TransformationWorkshopTypes
) => {
  return await http.patch(`/transformation-workshop/${id}`, body);
};