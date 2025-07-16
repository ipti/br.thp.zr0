import http from "@/service/axios";
import { UpdateCustomerType } from "./type";

export async function updateCustumer({id, body}:{id: number, body: UpdateCustomerType}) {
    return await http.patch('customer/'+id, body)
}