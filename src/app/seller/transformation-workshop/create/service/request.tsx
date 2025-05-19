import http from "@/service/axios";
import { CreateTransformationWorkshopTypes } from "./type";

export const CreateTransformationWorkshopRequest = async (
  body: CreateTransformationWorkshopTypes
) => {
  return await http
    .post(
      "/transformation-workshop",
      body
    )
};
