import { useQuery } from "@tanstack/react-query";
import { requestOrderOne, requestOrderTransformationWorkshop } from "./request";

export const useFetchRequestOrderTransformationWorkshop = (idTw?: string, page: string, limit: string) => {
    return useQuery(["useRequestOrderTransformationWorkshop", idTw, page, limit], () => requestOrderTransformationWorkshop(idTw, page, limit));
};

export const useFetchRequestOrderOne = (idOrder?: string, idTw?: string) => {
    return useQuery(["useRequestOrderOne", idOrder, idTw], () => requestOrderOne(idOrder, idTw), {enabled: !!idOrder});
};