import http from "@/service/axios";
import { logout } from "@/service/cookies";

export const requestOrderTransformationWorkshop = (idTw?: string) => {
    let path = "/transformation-workshop-user-bff/order?id="+idTw;
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