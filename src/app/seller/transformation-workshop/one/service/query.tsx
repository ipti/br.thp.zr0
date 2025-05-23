import { useQuery } from "@tanstack/react-query";
import { requestTransformationWorkshopOne } from "./request";

export const useFetchRequestTransformationWorkshopOne = (idOne?: string) => {
    return useQuery(["useRequestTransformationWorkshop", idOne], () => requestTransformationWorkshopOne(idOne));
};