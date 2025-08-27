import { useQuery } from "@tanstack/react-query";
import { requestGetAddressCustomer } from "./request";

export const useFetchRequestGetAddressCustomer = () => {
    return useQuery(["useFetchRequestGetAddressCustomer"], () => requestGetAddressCustomer());
};