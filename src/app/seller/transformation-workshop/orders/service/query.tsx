import { useQuery } from "@tanstack/react-query";
import { requestOrderTransformationWorkshop } from "./request";

export const useFetchRequestOrderTransformationWorkshop = (idTw?: string) => {
    return useQuery(["useRequestOrderTransformationWorkshop", idTw], () => requestOrderTransformationWorkshop(idTw));
};