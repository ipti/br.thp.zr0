import { useQuery } from "@tanstack/react-query";
import { requestCategory, requestCategoryOne } from "./request";

export const useFetchRequestCategory = () => {
    return useQuery(["useRequestCategory"], () => requestCategory());
};

export const useFetchRequestCategoryOne = (idCategory?: string) => {
    return useQuery(["useRequestCategoryOne", idCategory], () => requestCategoryOne(idCategory),  {
      enabled: !!idCategory, // Só ativa a query se idCategory for truthy
    });
};