"use client"

import { login } from "@/service/localstorage"
import { useNavigation } from "@/utils/navigation"
import { VerifyEmailRequest } from "./request"

export function VerifyEmailController() {

    const history = useNavigation()

    function VerifyEmailAction(token?: string) {
        VerifyEmailRequest(token).then(data => {
            login(data.data.access_token);
            history.history.push("/auth/login")
        }).catch(erros => {
            console.log(erros.response.data.message)
            alert(erros.response.data.message)
        })
    }
    return {
        VerifyEmailAction
    }
}