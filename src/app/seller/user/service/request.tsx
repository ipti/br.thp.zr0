import http from "@/service/axios";
import { logout } from "@/service/localstorage";
import { UserTypes } from "./type";

export const requestListUserTransformationWorkshop = () => {
    let path = "/user-bff/transf-work";
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

export const CreateUserRequest = async (
    body: UserTypes
) => {
    return await http
        .post(
            "/user-bff/created-user-with-tw",
            body,
        )
};

export const requestUserOne = (idOne?: string) => {
  let path = "/users/" + idOne;
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

export const UpdateUserRequest = async (
  id: string,
  body: UserTypes
) => {
  return await http
    .put(
      `/users/${id}`,
      body,
    )
};