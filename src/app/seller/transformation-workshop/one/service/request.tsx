import http from "@/service/axios";
import { logout } from "@/service/localstorage";

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
