import { useQuery } from "@tanstack/react-query";
import { requestProduct } from "./request";

export const useFetchRequestProduct = () => {
    return useQuery(["userequestProduct"], () => requestProduct());
};