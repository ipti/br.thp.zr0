"use client";
import http from "@/service/axios";
import { CreateAdressCustomer, CreateOrder, VerifyEmailTypes } from "./types";
import { logout } from "@/service/cookies";

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
      body
    )
};

export const CreateOrderRequest = async (
  body: CreateOrder
) => {
  return await http
    .post(
      "/orders",
      body
    )
};


export const getAddressOneRequest = async (
  id: number
) => {
  return await http
    .get(
      "/address-customer/" + id
    ).then((response) => response.data)
    .catch((err) => {
      if (err.response.status === 401) {
        logout();
        window.location.reload();
      }
      throw err;
    });

};
