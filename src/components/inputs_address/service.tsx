import http from "@/service/axios";
import { logout } from "@/service/localstorage";

export const requestState = () => {
    const path = "/state";
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

export const requestCity = (state_id?: number) => {
    if (state_id) {
        const path = "/city?state_fk=" + state_id;
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