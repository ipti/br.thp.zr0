import http from "@/service/axios";
import { logout } from "@/service/localstorage";
import { AddUserTransfWorkType } from "./type";

export const requestMemberTransformationWorkshop = (idTw?: string) => {
  let path = "/transformation-workshop-user-bff/members?id="+idTw;
  if(idTw){return http
      .get(path)
      .then((response) => response.data)
      .catch((err) => {
          if (err.response.status === 401) {
              logout();
              window.location.reload();
          }
          throw err;
      });}

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



