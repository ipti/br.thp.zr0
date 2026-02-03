import { useQuery } from "@tanstack/react-query";
import { requestOrderOne, requestOrderSolitedCancellation } from "./request";

export const useFetchrequestOrderSolitedCancellation = (page: string, limit: string) => {
    return useQuery(["useOrderSolitedCancellation", page, limit], () => requestOrderSolitedCancellation(page, limit));
};

export const useFetchRequestOrderOne = (idOrder?: string) => {
    return useQuery(["useRequestOrderOne", idOrder], () => requestOrderOne(idOrder), {enabled: !!idOrder});
};