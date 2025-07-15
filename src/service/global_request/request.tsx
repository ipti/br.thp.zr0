import http from "@/service/axios";
import { logout } from "@/service/cookies";

export const requestUserToken = () => {
    let path = "/user-bff/token";
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
