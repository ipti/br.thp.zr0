import { useQuery } from "@tanstack/react-query";
import { requestProduct } from "./request";

export const useFetchrequestProduct = () => {
    return useQuery(["userequestProduct"], () => requestProduct());
};