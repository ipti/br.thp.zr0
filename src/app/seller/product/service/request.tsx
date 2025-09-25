import http from "@/service/axios";
import { logout } from "@/service/localstorage";

export const requestProduct = () => {
    let path = "/product";
    return http
        .get(path)
        .then((response) => response.data)
        .catch((err) => {
            if (err.response.status === 401) {
                logout();
                window.location.reload();
            }
            throw err;
        });

};

export const CreateProductRequest = async (
  body: FormData
) => {
  return await http
    .post(
      "/product",
      body,
    )
};

export const UpdateProductRequest = async (id: string, body: any) => {
  return await http.put(`/product/${id}`, body, {
    headers: { "Content-Type": "application/json" }
  });
};

export const requestProductOne = (idOne?: string) => {
  let path = "/product/" + idOne;
  if (idOne) {
    return http
      .get(path)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response.status === 401) {
          logout();
          window.location.reload();
        }
        throw err;
      });
  }
};
