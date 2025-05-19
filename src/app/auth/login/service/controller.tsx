"use client"

import { Dispatch, SetStateAction } from "react"
import { LoginRequest } from "./request"
import { LoginTypes } from "./types"
import { login } from "@/service/localstorage"
import { useNavigation } from "@/utils/navigation"
import Cookies from 'js-cookie';
import { PerfisEnum } from "@/utils/enum/perfis"

export function LoginController(setErros: Dispatch<SetStateAction<string>>) {

    const exp90 = new Date()
    exp90.setMinutes(exp90.getMinutes() + 90)

    const history = useNavigation()

    function LoginAction(body: LoginTypes) {
        LoginRequest(body).then(data => {
            setErros("")
            console.log(data)
            Cookies.set('access_token', data.data.access_token, {expires: exp90})
            login(data.data.access_token);
            if(data.data.userRegistered.role === PerfisEnum.SELLER){
                 history.history.push("/seller/home")  
            }
            // history.history.push("/")
        }).catch(erros => {
            console.log(erros.response.data.message)
            setErros(erros.response.data.message)
        })
    }
    return {
        LoginAction
    }
}