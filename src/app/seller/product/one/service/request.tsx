import http from "@/service/axios";

export const requestProductOne = (id: string | undefined) => {
    let path = "/product-bff/" + id;
    if (id) {

        return http
            .get(path)
            .then((response) => response.data)
            .catch((err) => {
                if (err.response.status === 401) {

                }
                throw err;
            });
    }

};

export const requestProductOneUid = (id: string | undefined) => {
    let path = "/product/get-uid/" + id;
    if (id) {

        return http
            .get(path)
            .then((response) => response.data)
            .catch((err) => {
                if (err.response.status === 401) {

                }
                throw err;
            });
    }

};
