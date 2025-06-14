import http from "@/service/axios";
import { logout } from "@/service/localstorage";
import { AddProductTransfWorkType, AddUserTransfWorkType, UpdateProductTransfWorkType } from "./type";

export const requestTransformationWorkshopOne = (idOne?: string) => {
  let path = "/transformation-workshop-user-bff/one?id=" + idOne;
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

export const requestAddUserTransformationWorkshop = (body: AddUserTransfWorkType ) => {
  let path = "/transformation-workshop-user-bff/add-user";

    return http
      .post(path, body)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response.status === 401) {
          logout();
          window.location.reload();
        }
        throw err;
      });
  
};

export const requestAddProductTransformationWorkshop = (body: AddProductTransfWorkType) => {
  let path = "/transformation-workshop-product-bff/add-product";

    return http
      .post(path, body)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response.status === 401) {
          logout();
          window.location.reload();
        }
        throw err;
      });
  
};

export const requestUpdateProductTransformationWorkshop = (id: number, body: UpdateProductTransfWorkType) => {
  let path = "/transformation-workshop-product-bff/update-product/"+id;

    return http
      .put(path, body)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response.status === 401) {
          logout();
          window.location.reload();
        }
        throw err;
      });
  
};
