import { useQuery } from "@tanstack/react-query";
import {  requestProductOneUid } from "./request";

export const useFetchrequestProductOneUid = (id: string | undefined) => {
    return useQuery(["userequestProductOneUid", id], () => requestProductOneUid(id));
};
