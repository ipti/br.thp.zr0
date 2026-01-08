import { useQuery } from "@tanstack/react-query";
import { requestOrderOne, requestOrderUser, requestPaymentIntentOne } from "./request";

export const useFetchRequestOrderUser = () => {
    return useQuery(["useRequestOrderUser"], () => requestOrderUser());
};

export const useFetchRequestOrderOne = (idOrder?: string) => {
    return useQuery(["useRequestOrderOne", idOrder], () => requestOrderOne(idOrder), {enabled: !!idOrder});
};

export const useFetchRequestPaymentIntentOne = (idOrder?: number) => {
    return useQuery(["useRequestPaymentIntentOne", idOrder], () => requestPaymentIntentOne(idOrder), {enabled: !!idOrder});
};
