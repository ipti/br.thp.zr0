import http from "@/service/axios";
import { CreateAddressCustomerType } from "./type";

export const requestGetAddressCustomer = () => {
     let path = "/user-bff/address-custumer";
    return http
        .get(path)
        .then((response) => response.data)
        .catch((err) => {
            if (err.response.status === 401) {
               
            }
            throw err;
        });

};

export const requestCreateAddressCustomer = async (
    body: CreateAddressCustomerType 
  ) => {
    return await http
      .post(
        "/address-customer",
        body,
      )
  };
  