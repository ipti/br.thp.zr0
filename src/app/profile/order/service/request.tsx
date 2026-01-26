import http from "@/service/axios";
import { logout } from "@/service/cookies";

export const requestOrderUser = () => {
    let path = "/user-bff/order";
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

export const requestOrderOne = (idOne?: string) => {
    let path = "/orders/"+idOne;
    if(idOne){return http
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

export const requestOrderUpdate = (idOne?: string, body: OrderUpdate ) => {
    let path = "/orders/"+idOne;
    if(idOne){return http
        .patch(path, body)
        .then((response) => response.data)
        .catch((err) => {
            if (err.response.status === 401) {
                logout();
                window.location.reload();
            }
            throw err;
        });}
};
