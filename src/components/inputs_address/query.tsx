import { useQuery } from "@tanstack/react-query";
import { requestCity, requestState } from "./service";

export const useFetchRequestState = () => {
    return useQuery(["useRequestState"], () => requestState());
};

export const useFetchRequestCity = (id?: number) => {
    return useQuery(["useRequestsCity", id], () => requestCity(id));
  };
  