import { useQuery } from "@tanstack/react-query";
import { requestProductOne, requestProductOneUid } from "./request";

export const useFetchrequestProductOne = (id: string | undefined) => {
    return useQuery(["userequestProductOne", id], () => requestProductOne(id));
};

export const useFetchrequestProductOneUid = (id: string | undefined) => {
    return useQuery(["userequestProductOneUid", id], () => requestProductOneUid(id));
};