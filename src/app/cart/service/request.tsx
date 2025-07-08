"use client";
import http from "@/service/axios";
import { VerifyEmailTypes } from "./types";

export const VerifyEmailRequest = async (
  body: VerifyEmailTypes
) => {
  return await http
    .post(
      "/users/get-email",
      { email: body.email },
    )
};
