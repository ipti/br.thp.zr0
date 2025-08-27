import { useQuery } from "@tanstack/react-query";
import { requestProductOne } from "./request";

export const useFetchrequestProductOne = (id: string | undefined) => {
    return useQuery(["userequestProductOne", id], () => requestProductOne(id));
};