"use client"

import { Dispatch, SetStateAction } from "react"
import { LoginRequest } from "./request"
import { LoginTypes } from "./types"
import { login } from "@/service/localstorage"
import { useNavigation } from "@/utils/navigation"

export function LoginController(setErros: Dispatch<SetStateAction<string>>) {

    const history = useNavigation()

    function LoginAction(body: LoginTypes) {
        LoginRequest(body).then(data => {
            setErros("")
            login(data.data.access_token);
            history.history.push("/")
        }).catch(erros => {
            console.log(erros.response.data.message)
            setErros(erros.response.data.message)
        })
    }
    return {
        LoginAction
    }
}