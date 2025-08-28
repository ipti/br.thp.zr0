import { useQuery } from "@tanstack/react-query";
import { getAddressOneRequest, requestProductOneQuantity } from "./request";

export const useFetchAddressOneRequest = (id: number) => {
    return useQuery(["useAddressOneRequest", id], () => getAddressOneRequest(id));
};

export const useFetchProductOneQuantity = (id: string) => {
    return useQuery(["useFetchProductOneQuantity", id], () => requestProductOneQuantity(id));
};