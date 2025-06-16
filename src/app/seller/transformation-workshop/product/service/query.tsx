import { useQuery } from "@tanstack/react-query";
import { requestProductTransformationWorkshop } from "./request";

export const useFetchRequestProductTransformationWorkshop = (idTw: number) => {
    return useQuery(["userequestProductTransformationWorkshop"], () => requestProductTransformationWorkshop(idTw));
};