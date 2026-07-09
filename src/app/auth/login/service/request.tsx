"use client";
import http from "@/service/axios";
import { LoginTypes } from "./types";

export const LoginRequest = async (
  body: LoginTypes
) => {
  return await http
    .post(
      "/auth/login",
      { username: body.email, password: body.password },
    )
};

export const GetMyCartRequest = async () => {
  return await http.get("/cart/me/items");
};

export const AddCartItemRequest = async (body: {
  productId: number;
  quantity: number;
  variantId?: number;
}) => {
  return await http.post("/cart/items", body);
};

export const GetProductByUidRequest = async (uid: string) => {
  return await http.get(`/product-bff/uid/${uid}`);
};
