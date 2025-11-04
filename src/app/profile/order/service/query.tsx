import { useQuery } from "@tanstack/react-query";
import { requestOrderOne, requestOrderUser } from "./request";

export const useFetchRequestOrderUser = () => {
    return useQuery(["useRequestOrderUser"], () => requestOrderUser());
};

export const useFetchRequestOrderOne = (idOrder?: string) => {
    return useQuery(["useRequestOrderOne", idOrder], () => requestOrderOne(idOrder), {enabled: !!idOrder});
};