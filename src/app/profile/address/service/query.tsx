import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { requestGetAddressCustomer } from "./request";

export const useFetchRequestGetAddressCustomer = () => {
    const hasToken = Boolean(Cookies.get("access_token"));

    return useQuery(
        ["useFetchRequestGetAddressCustomer"],
        () => requestGetAddressCustomer(),
        { enabled: hasToken },
    );
};
