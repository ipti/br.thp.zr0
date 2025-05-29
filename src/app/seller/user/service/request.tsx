import http from "@/service/axios";
import { logout } from "@/service/localstorage";

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
