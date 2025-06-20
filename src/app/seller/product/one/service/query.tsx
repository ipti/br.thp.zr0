import { useQuery } from "@tanstack/react-query";
import { requestProductOne } from "./request";

export const useFetchrequestProductOne = (id: string) => {
    return useQuery(["userequestProductOne", id], () => requestProductOne(id));
};