import http from "@/service/axios";
import { CreateAddressCustomerType, UpdateDefaultAddressCustomerType } from "./type";

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

  export const requestUpdateDefaultAddressCustomer = async (
    body: UpdateDefaultAddressCustomerType 
  ) => {
    return await http
      .patch(
        "/address-customer/default",
        body,
      )
  };
  

  export const requestDeleteAddressCustomer = async (
    id: number, costumerId: number
  ) => {
    return await http
      .delete(
        "/address-customer/"+ id + "/" + costumerId,
      )
  };
  