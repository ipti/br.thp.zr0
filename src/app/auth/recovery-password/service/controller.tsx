"use client"

import { login } from "@/service/localstorage"
import { Dispatch, SetStateAction } from "react"
import Swal from "sweetalert2"
import { SendEmailRecoveryPasswordRequest } from "./request"
import { SendEmailRecoveryTypes } from "./types"
import { useNavigation } from "@/utils/navigation"

export function SendEmailRecoveryPasswordController(setErros: Dispatch<SetStateAction<string>>) {

      const history = useNavigation()

    function SendEmailRecoveryPasswordAction(body: SendEmailRecoveryTypes) {
        SendEmailRecoveryPasswordRequest(body).then(data => {
            setErros("")
            login(data.data.access_token);
            Swal.fire({
                title: "Email enviado",
                text: "Acesse o email para poder resetar suar senha?",
                icon: "success",
                toast: true,
                timer: 3600,
                showConfirmButton: false
              });
              setTimeout(() => {
                history.history.push("/auth/login")
              }, 3600);
        }).catch(erros => {
            console.log(erros.response.data.message)
            setErros(erros.response.data.message)
        })
    }
    return {
        SendEmailRecoveryPasswordAction
    }
}