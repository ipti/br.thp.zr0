"use client"

import { Dispatch, SetStateAction } from "react"
import { SignUpRequest } from "./request"
import { SignUpTypes } from "./types"
import { useNavigation } from "@/utils/navigation"
import Swal from "sweetalert2"

export function SignUpController(setErros: Dispatch<SetStateAction<string>>) {

    const history = useNavigation()

    function SignUpAction(body: SignUpTypes, handleReturn?: () => void) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        SignUpRequest(body).then(data => {
            // history.history.push("/auth/login")
            handleReturn && handleReturn()
            Swal.fire({
                icon: 'success',
                title: 'Cadastro realizado com sucesso!',
                text: 'Verifique o seu e-mail antes de acessar a plataforma.',
                timer: 3000,
                showConfirmButton: false
            }).then(() => {
                history.history.push("/auth/login")
            });
        }).catch(erros => {
            console.log(erros.response.data.message)
            handleReturn && handleReturn()
            setErros(erros.response.data.message)
        })
    }
    return {
        SignUpAction
    }
}