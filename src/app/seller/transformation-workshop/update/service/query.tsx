import { useQuery } from "@tanstack/react-query";
import { requestTransformationWorkshopOne } from "./request";

export const useFetchRequestTransformationWorkshop = (idOne?: string) => {
    return useQuery(["useRequestTransformationWorkshopOne", idOne], () => requestTransformationWorkshopOne(idOne),  {
      enabled: !!idOne, // Só ativa a query se idOne for truthy
    });
};