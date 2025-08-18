import http from "@/service/axios";
import { logout } from "@/service/localstorage";
import { AddUserTransfWorkType } from "./type";

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

  return []
};

export const requestOrdersTransformationWorkshopOne = (idOne?: string) => {
  let path = "/orders-bff/tw/" + idOne;
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

  return []
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



