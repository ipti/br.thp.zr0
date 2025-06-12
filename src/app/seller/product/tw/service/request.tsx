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
