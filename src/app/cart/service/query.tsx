import { useQuery } from "@tanstack/react-query";
import { getAddressOneRequest } from "./request";

export const useFetchAddressOneRequest = (id: number) => {
    return useQuery(["useAddressOneRequest", id], () => getAddressOneRequest(id));
};