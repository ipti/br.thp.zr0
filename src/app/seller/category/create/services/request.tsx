import http from "@/service/axios";
import { CreateCategoryTypes } from "./type";

export const CreateCategoryRequest = async (
  body: CreateCategoryTypes
) => {
  return await http
    .post(
      "/category",
      body,
    )
};
