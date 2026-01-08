import { useQuery } from "@tanstack/react-query";
import { requestOrderOne, requestOrderTransformationWorkshop } from "./request";

export const useFetchRequestOrderTransformationWorkshop = (idTw?: string) => {
    return useQuery(["useRequestOrderTransformationWorkshop", idTw], () => requestOrderTransformationWorkshop(idTw));
};

export const useFetchRequestOrderOne = (idOrder?: string) => {
    return useQuery(["useRequestOrderOne", idOrder], () => requestOrderOne(idOrder), {enabled: !!idOrder});
};