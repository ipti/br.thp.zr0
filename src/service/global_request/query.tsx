import { useQuery } from "@tanstack/react-query";
import { requestUserToken } from "./request";

export const useFetchUserToken = () => {
    return useQuery(["useUserToken"], () => requestUserToken());
};