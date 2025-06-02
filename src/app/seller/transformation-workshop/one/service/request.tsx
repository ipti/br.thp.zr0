import http from "@/service/axios";
import { logout } from "@/service/localstorage";
import { AddUserTrnasfWorkType } from "./type";

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

export const requestAddTransformationWorkshop = (body: AddUserTrnasfWorkType) => {
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

