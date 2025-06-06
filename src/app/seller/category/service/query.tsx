import { useQuery } from "@tanstack/react-query";
import { requestCategory } from "./request";

export const useFetchRequestCategory = () => {
    return useQuery(["useRequestCategory"], () => requestCategory());
};