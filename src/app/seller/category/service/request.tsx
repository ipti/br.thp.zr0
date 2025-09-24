import http from "@/service/axios";
import { logout } from "@/service/localstorage";
import { CategoryTypes } from "./type";

export const requestCategory = () => {
    let path = "/category";
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

export const requestCategoryOne = (idOne?: string) => {
  let path = "/category/" + idOne;
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


export const CreateCategoryRequest = async (
  body: CategoryTypes
) => {
  return await http
    .post(
      "/category",
      body,
    )
};
export const UpdateCategoryRequest = async (
  id: string,
  body: CategoryTypes
) => {
  return await http
    .patch(
      "/category",
      body,
    )
};
