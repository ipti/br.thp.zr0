import http from "@/service/axios";
import { logout } from "@/service/localstorage";

export const requestTransformationWorkshop = () => {
    let path = "/transformation-workshop-user-bff";
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
