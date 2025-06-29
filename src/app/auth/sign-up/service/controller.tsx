"use client"

import { Dispatch, SetStateAction } from "react"
import { SignUpRequest } from "./request"
import { SignUpTypes } from "./types"
import { useNavigation } from "@/utils/navigation"

export function SignUpController(setErros: Dispatch<SetStateAction<string>>) {

    const history = useNavigation()

    function SignUpAction(body: SignUpTypes) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        SignUpRequest(body).then(data => {
            history.history.push("/auth/login")
            
        }).catch(erros => {
            console.log(erros.response.data.message)
            setErros(erros.response.data.message)
        })
    }
    return {
        SignUpAction
    }
}