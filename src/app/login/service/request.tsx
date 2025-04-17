import http from "@/service/axios"
import { LoginTypes } from "./types"

export const LoginRequest = async (body: LoginTypes) => {
    return await http.post("/auth/login", { username: body.email, password: body.password }).then(data => {
console.log(data)
    }).catch(err => console.log(err))
}

