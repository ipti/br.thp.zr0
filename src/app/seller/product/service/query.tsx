import { useQuery } from "@tanstack/react-query";
import { requestProduct, requestProductOne } from "./request";

export const useFetchRequestProduct = () => {
    return useQuery(["userequestProduct"], () => requestProduct());
};

export const useFetchrequestProductOne = (idProduct?: string) => {
    return useQuery(["userequestProductOne", idProduct], () => requestProductOne(idProduct),  {
      enabled: !!idProduct,
    });
};