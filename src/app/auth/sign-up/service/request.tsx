import http from "@/service/axios";
import { SignUpTypes } from "./types";

export const SignUpRequest = async (
  body: SignUpTypes
) => {
  return await http
    .post(
      "/user-bff/created-user-with-custumer",
      body,
    )
};
