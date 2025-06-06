import http from "@/service/axios";

export const CreateProductRequest = async (
  body: FormData
) => {
  return await http
    .post(
      "/product",
      body,
    )
};
