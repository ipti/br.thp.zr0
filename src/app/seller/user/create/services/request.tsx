import http from "@/service/axios";
import { CreateUserTypes } from "./type";

export const CreateUserRequest = async (
  body: CreateUserTypes
) => {
  return await http
    .post(
      "/users",
      body,
      { skipAuth: true }
    )
};
