import http from "@/service/axios";
import {
  ProductReviewResponse,
  ShippingCalculateType,
  WishlistStatus
} from "./type";

export const requestProductOneUid = (id: string) => {
    let path = "/product-bff/uid/"+id;
    return http
        .get(path)
        .then((response) => response.data)
        .catch((err) => {
            if (err.response.status === 401) {
               
            }
            throw err;
        });

};


export const ShippingCalculateRequest = async (
    body: ShippingCalculateType 
  ) => {
    return await http
      .post(
        "/shipping/calculate",
        body,
      )
  };

export const GetProductReviewsRequest = async (uid: string) => {
  const response = await http.get<ProductReviewResponse>(`/product/${uid}/reviews`);
  return response.data;
};

export const CreateProductReviewRequest = async (
  uid: string,
  body: { rating: number; comment?: string }
) => {
  const response = await http.post(`/product/${uid}/review`, body);
  return response.data;
};

export const GetWishlistStatusRequest = async (uid: string) => {
  const response = await http.get<WishlistStatus>(`/wishlist/check/${uid}`);
  return response.data;
};

export const AddWishlistRequest = async (uid: string) => {
  const response = await http.post(`/wishlist/${uid}`);
  return response.data;
};

export const RemoveWishlistRequest = async (uid: string) => {
  const response = await http.delete(`/wishlist/${uid}`);
  return response.data;
};
  
