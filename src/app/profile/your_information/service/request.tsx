import http from "@/service/axios";
import { CreateAddressBilling, UpdateCustomerType, UpdateUserType } from "./type";

export async function updateCustumer({ id, body }: { id: number, body: UpdateCustomerType }) {
    return await http.patch('customer/' + id, body)
}

export async function updateUser({ id, body }: { id: number, body: UpdateUserType }) {
    return await http.put('users/' + id, body)
}

export async function createAddressBilling({body}:{body: CreateAddressBilling}) {
    return await http.post('/billing-address-customer', body)
}

export async function updateAddressBilling({body, id}:{body: CreateAddressBilling, id: number}) {
    return await http.patch('/billing-address-customer/'+id, body)
}