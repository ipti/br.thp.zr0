"use client";
import http from "@/service/axios";
import { CreateAdressCustomer, VerifyEmailTypes } from "./types";

export const VerifyEmailRequest = async (
  body: VerifyEmailTypes
) => {
  return await http
    .post(
      "/users/get-email",
      { email: body.email },
    )
};

export const CreateAddressCustomerRequest = async (
  body: CreateAdressCustomer
) => {
  return await http
    .post(
      "/users/get-email",
      { email: body.email },
    )
};

