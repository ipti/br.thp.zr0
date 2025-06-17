import { useQuery } from "@tanstack/react-query";
import { requestProductTransformationWorkshop } from "./request";

export const useFetchRequestProductTransformationWorkshop = (idTw?: string) => {
    return useQuery(["userequestProductTransformationWorkshop", idTw], () => requestProductTransformationWorkshop(idTw));
};