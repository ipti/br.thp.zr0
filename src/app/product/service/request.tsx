import http from "@/service/axios";
import { ShippingCalculateType } from "./type";

export const requestProductOneUid = (id: string) => {
    let path = "/product-bff/uid/"+id;
    return http
        .get(path)
        .then((response) => response.data)
        .catch((err) => {
            if (err.response.status === 401) {
               
            }
            throw err;
        });

};


export const ShippingCalculateRequest = async (
    body: ShippingCalculateType 
  ) => {
    return await http
      .post(
        "/shipping/calculate",
        body,
      )
  };
  