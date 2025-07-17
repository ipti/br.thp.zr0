import http from "@/service/axios";
import { UpdateCustomerType, UpdateUserType } from "./type";

export async function updateCustumer({ id, body }: { id: number, body: UpdateCustomerType }) {
    return await http.patch('customer/' + id, body)
}

export async function updateUser({ id, body }: { id: number, body: UpdateUserType }) {
    return await http.put('users/' + id, body)
}