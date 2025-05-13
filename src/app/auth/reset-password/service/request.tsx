import http from "@/service/axios";
import { ResetPasswordTypes } from "./types";

export const ResetPasswordRequest = async (
  body: ResetPasswordTypes,
  token?: string
) => {
  return await http.put("/aux-user/recovery-password", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
