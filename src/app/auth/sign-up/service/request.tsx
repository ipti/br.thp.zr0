import http from "@/service/axios";
import { SignUpTypes } from "./types";

export const SignUpRequest = async (
  body: SignUpTypes
) => {
  return await http
    .post(
      "/users",
      body,
      { skipAuth: true }
    )
};
