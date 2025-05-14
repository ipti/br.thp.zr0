import http from "@/service/axios";
import { CreateProductTypes } from "./type";

export const CreateProductRequest = async (
  body: CreateProductTypes
) => {
  return await http
    .post(
      "/product",
      body,
      { skipAuth: true }
    )
};
