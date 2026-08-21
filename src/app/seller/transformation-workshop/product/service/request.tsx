import http from "@/service/axios";
import { logout } from "@/service/localstorage";
import { AddProductTransfWorkType, UpdateProductTransfWorkType } from "./type";

export const requestProductTransformationWorkshop = (idTw?: string) => {
    let path = "/transformation-workshop-user-bff/product?id="+idTw;
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


export const requestAddProductTransformationWorkshop = (body: AddProductTransfWorkType) => {
    let path = "/transformation-workshop-product-bff/add-product";

      return http
        .post(path, body)
        .then((response) => response.data)
        .catch((err) => {
          if (err.response.status === 401) {
            logout();
            window.location.reload();
          }
          throw err;
        });

  };

  export const requestUpdateProductTransformationWorkshop = (body: UpdateProductTransfWorkType, delta: number) => {
    let path = `/inventory/${delta >= 0 ? 'entry' : 'exit'}`;

      return http
        .post(path, {
          idProduct: body.product_fk,
          idTransformationWorkshop: body.tw_fk,
          quantity: Math.abs(delta),
        })
        .then((response) => response.data)
        .catch((err) => {
          if (err.response.status === 401) {
            logout();
            window.location.reload();
          }
          throw err;
        });

  };
