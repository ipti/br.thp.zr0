import { useQuery } from "@tanstack/react-query";
import {
  GetProductReviewsRequest,
  GetWishlistStatusRequest,
  requestProductOneUid
} from "./request";

export const useFetchrequestProductOneUid = (id: string | undefined) => {
    return useQuery(["userequestProductOneUid", id], () => requestProductOneUid(id));
};

export const useFetchProductReviews = (id: string | undefined) => {
    return useQuery(["useFetchProductReviews", id], () => GetProductReviewsRequest(id!), {
        enabled: !!id,
    });
};

export const useFetchWishlistStatus = (id: string | undefined, enabled: boolean) => {
    return useQuery(["useFetchWishlistStatus", id], () => GetWishlistStatusRequest(id!), {
        enabled: !!id && enabled,
    });
};
