import { useQuery } from "@tanstack/react-query";
import { requestMemberTransformationWorkshop } from "./request";

export const useFetchRequestMemberTransformationWorkshop = (idOne?: string) => {
    return useQuery(["useRequestMemberTransformationWorkshop", idOne], () => requestMemberTransformationWorkshop(idOne));
};