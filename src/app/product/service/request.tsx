import http from "@/service/axios";

export const requestProductOne = (id: string) => {
    let path = "/product/"+id;
    return http
        .get(path)
        .then((response) => response.data)
        .catch((err) => {
            if (err.response.status === 401) {
               
            }
            throw err;
        });

};
