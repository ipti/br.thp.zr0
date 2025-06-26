"use client";
import http from "@/service/axios";
import { SendEmailRecoveryTypes } from "./types";

export const SendEmailRecoveryPasswordRequest = async (
  body: SendEmailRecoveryTypes
) => {
  return await http
    .put(
      "/aux-user/send-email-recover-password",
      { email: body.email },
    )
};
